"""
NEXI AI Chatbot - FastAPI Application

SSE streaming endpoint for chat completions with semantic search.
Phase 4: Includes caching, metrics, and admin endpoints.
"""

import json
import logging
import time
from contextlib import asynccontextmanager
from typing import AsyncGenerator, List, Dict, Any
from datetime import datetime

from fastapi import FastAPI, HTTPException, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel

from config import settings, build_system_prompt, ERROR_MESSAGES
from config.prompts import build_semantic_prompt
from models import ChatRequest, HealthResponse, ErrorResponse
from services import (
    stream_chat_completion,
    is_provider_configured,
    get_portfolio_context,
    get_response_cache,
    get_fallback_response,
    # Phase 4: Error tracking
    init_sentry,
    capture_exception,
    add_breadcrumb,
    set_user,
    is_sentry_initialized,
    # Phase 4: A/B Testing
    get_ab_manager,
    get_prompt_for_session,
    # Phase 4: Cost monitoring
    get_cost_monitor,
    record_token_usage,
)
from services.embeddings import search_similar, get_index_stats

# =============================================================================
# Logging Configuration
# =============================================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("nexi")

# =============================================================================
# Metrics Tracking (Phase 4)
# =============================================================================

class MetricsTracker:
    """Track service metrics for monitoring and analytics."""
    
    def __init__(self):
        self.start_time = time.time()
        self.request_count = 0
        self.error_count = 0
        self.total_response_time_ms = 0
        self.response_times: List[float] = []  # Last 100 response times
        self.chat_logs: List[Dict[str, Any]] = []  # Last 500 chat logs
        self.hourly_requests: Dict[int, int] = {}  # Requests per hour
    
    def record_request(self, response_time_ms: float, success: bool = True):
        """Record a request with its response time."""
        self.request_count += 1
        self.total_response_time_ms += response_time_ms
        
        if not success:
            self.error_count += 1
        
        # Track response times (keep last 100)
        self.response_times.append(response_time_ms)
        if len(self.response_times) > 100:
            self.response_times.pop(0)
        
        # Track hourly distribution
        hour = datetime.now().hour
        self.hourly_requests[hour] = self.hourly_requests.get(hour, 0) + 1
    
    def log_chat(self, query: str, response_preview: str, response_time_ms: float, cached: bool = False):
        """Log a chat interaction for admin review."""
        log_entry = {
            "id": f"log_{int(time.time())}_{len(self.chat_logs)}",
            "timestamp": datetime.now().isoformat(),
            "query": query[:200],
            "response_preview": response_preview[:200],
            "response_time_ms": round(response_time_ms, 2),
            "cached": cached,
        }
        
        self.chat_logs.append(log_entry)
        
        # Keep last 500 logs
        if len(self.chat_logs) > 500:
            self.chat_logs.pop(0)
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get current metrics."""
        uptime_seconds = time.time() - self.start_time
        avg_response_time = (
            sum(self.response_times) / len(self.response_times)
            if self.response_times else 0
        )
        
        return {
            "uptime_seconds": round(uptime_seconds, 2),
            "uptime_human": self._format_duration(uptime_seconds),
            "total_requests": self.request_count,
            "error_count": self.error_count,
            "error_rate": f"{(self.error_count / self.request_count * 100):.1f}%" if self.request_count > 0 else "0%",
            "avg_response_time_ms": round(avg_response_time, 2),
            "p95_response_time_ms": round(self._percentile(self.response_times, 95), 2) if self.response_times else 0,
            "requests_per_minute": round(self.request_count / (uptime_seconds / 60), 2) if uptime_seconds > 0 else 0,
            "hourly_distribution": self.hourly_requests,
        }
    
    def get_logs(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent chat logs."""
        return self.chat_logs[-limit:][::-1]
    
    def _format_duration(self, seconds: float) -> str:
        """Format duration in human readable form."""
        hours, remainder = divmod(int(seconds), 3600)
        minutes, secs = divmod(remainder, 60)
        
        if hours > 0:
            return f"{hours}h {minutes}m {secs}s"
        elif minutes > 0:
            return f"{minutes}m {secs}s"
        else:
            return f"{secs}s"
    
    def _percentile(self, data: List[float], percentile: int) -> float:
        """Calculate percentile of a list."""
        if not data:
            return 0
        
        sorted_data = sorted(data)
        index = int(len(sorted_data) * percentile / 100)
        return sorted_data[min(index, len(sorted_data) - 1)]


# Global metrics instance
metrics = MetricsTracker()

# =============================================================================
# Application Lifecycle
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    # Startup
    logger.info("=" * 50)
    logger.info("NEXI AI Service Starting...")
    logger.info(f"Provider: {settings.ai_provider}")
    logger.info(f"Model: {settings.model}")
    logger.info(f"Configured: {settings.is_configured()}")
    logger.info("=" * 50)
    
    # Load portfolio context on startup
    try:
        context = get_portfolio_context()
        logger.info(f"Portfolio loaded: {context.owner.name}")
        logger.info(f"Projects: {len(context.projects)}")
    except Exception as e:
        logger.error(f"Failed to load portfolio: {e}")
    
    # Check semantic search status
    logger.info("-" * 50)
    logger.info("Semantic Search Status:")
    logger.info(f"  Pinecone configured: {settings.is_pinecone_configured()}")
    logger.info(f"  Embeddings configured: {settings.is_embedding_configured()}")
    logger.info(f"  Semantic search enabled: {settings.use_semantic_search}")
    logger.info(f"  Ready: {settings.is_semantic_search_ready()}")
    
    if settings.is_semantic_search_ready():
        try:
            stats = await get_index_stats()
            vector_count = stats.get("total_vector_count", 0)
            logger.info(f"  Index vectors: {vector_count}")
            if vector_count == 0:
                logger.warning("  WARNING: Index is empty! Run 'python scripts/index_portfolio.py'")
        except Exception as e:
            logger.warning(f"  Could not get index stats: {e}")
    
    # Initialize response cache (Phase 4)
    logger.info("-" * 50)
    logger.info("Response Cache Status:")
    cache = get_response_cache()
    cache_stats = cache.get_stats()
    logger.info(f"  Cache initialized: max_size={cache_stats['max_size']}")
    logger.info(f"  Caching enabled: True")
    
    # Initialize Sentry (Phase 4)
    logger.info("-" * 50)
    logger.info("Error Tracking Status:")
    sentry_initialized = init_sentry(settings.sentry_dsn, settings.environment)
    logger.info(f"  Sentry configured: {bool(settings.sentry_dsn)}")
    logger.info(f"  Sentry initialized: {sentry_initialized}")
    logger.info(f"  Environment: {settings.environment}")
    
    # Initialize A/B Testing (Phase 4)
    logger.info("-" * 50)
    logger.info("A/B Testing Status:")
    ab_manager = get_ab_manager(settings.ab_test_seed)
    active_tests = ab_manager.get_all_active_tests()
    logger.info(f"  A/B testing enabled: {settings.ab_testing_enabled}")
    logger.info(f"  Active tests: {len(active_tests)}")
    for test in active_tests:
        logger.info(f"    - {test['name']}: {len(test['variants'])} variants")
    
    # Initialize Cost Monitor (Phase 4)
    logger.info("-" * 50)
    logger.info("Cost Monitoring Status:")
    cost_monitor = get_cost_monitor()
    logger.info(f"  Token cost tracking: {settings.track_token_costs}")
    logger.info(f"  Daily budget: $10.00")
    
    logger.info("=" * 50)
    
    yield
    
    # Shutdown
    logger.info("NEXI AI Service Shutting Down...")

# =============================================================================
# FastAPI Application
# =============================================================================

app = FastAPI(
    title="NEXI AI Chatbot",
    description="AI-powered portfolio assistant with SSE streaming",
    version="1.0.0",
    lifespan=lifespan,
)

# =============================================================================
# CORS Middleware
# =============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# =============================================================================
# Exception Handlers
# =============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(error=exc.detail).model_dump(),
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    logger.error(f"Unexpected error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(error=ERROR_MESSAGES["GENERIC_ERROR"]).model_dump(),
    )

# =============================================================================
# Health Check Endpoint
# =============================================================================

@app.get(
    "/health",
    summary="Health Check",
    description="Check service status and provider configuration",
)
async def health_check():
    """Return service health status."""
    configured = is_provider_configured()
    semantic_ready = settings.is_semantic_search_ready()
    
    # Get index stats if semantic search is ready
    index_stats = None
    if semantic_ready:
        try:
            index_stats = await get_index_stats()
        except Exception:
            index_stats = {"error": "Could not fetch stats"}
    
    # Get cache stats
    cache = get_response_cache()
    cache_stats = cache.get_stats()
    
    # Get A/B testing stats
    ab_manager = get_ab_manager()
    ab_tests = ab_manager.get_all_active_tests()
    
    # Get cost summary
    cost_monitor = get_cost_monitor()
    cost_summary = cost_monitor.get_summary(24)
    
    return {
        "status": "ok" if configured else "not_configured",
        "version": "4.0.0",  # Phase 4 Complete
        "provider": settings.ai_provider,
        "model": settings.model,
        "configured": configured,
        "semantic_search": {
            "enabled": settings.use_semantic_search,
            "ready": semantic_ready,
            "pinecone_configured": settings.is_pinecone_configured(),
            "embedding_configured": settings.is_embedding_configured(),
            "index_name": settings.pinecone_index_name if settings.is_pinecone_configured() else None,
            "index_stats": index_stats,
        },
        "cache": cache_stats,
        "ab_testing": {
            "enabled": settings.ab_testing_enabled,
            "active_tests": len(ab_tests),
        },
        "error_tracking": {
            "sentry_configured": bool(settings.sentry_dsn),
            "sentry_initialized": is_sentry_initialized(),
        },
        "cost_monitoring": {
            "enabled": settings.track_token_costs,
            "today_cost": f"${cost_summary.total_cost:.4f}",
            "today_requests": cost_summary.total_requests,
        },
        "metrics": {
            "uptime": metrics.get_metrics()["uptime_human"],
            "total_requests": metrics.request_count,
            "error_rate": f"{(metrics.error_count / metrics.request_count * 100):.1f}%" if metrics.request_count > 0 else "0%",
        },
    }

# =============================================================================
# Chat Endpoint (SSE Streaming)
# =============================================================================

async def generate_sse_stream(request: ChatRequest) -> AsyncGenerator[dict, None]:
    """Generate SSE stream from LLM response with semantic search, caching, and A/B testing."""
    start_time = time.time()
    response_content = ""
    cached = False
    input_tokens = 0
    output_tokens = 0
    session_id = request.session_id or "anonymous"
    
    try:
        # Set user context for error tracking
        set_user(session_id=session_id)
        add_breadcrumb("Chat request received", "chat", session_id=session_id)
        
        # Get portfolio context
        context = get_portfolio_context()
        
        # Convert messages to dict format
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        # Get the latest user message for semantic search
        user_query = ""
        for msg in reversed(request.messages):
            if msg.role == "user":
                user_query = msg.content
                break
        
        # Estimate input tokens (rough approximation)
        input_tokens = len(user_query.split()) * 2
        
        # Check cache first (Phase 4)
        cache = get_response_cache()
        cached_response = cache.get(user_query)
        
        if cached_response:
            # Return cached response (stream it token by token for consistent UX)
            cached = True
            logger.info(f"Cache hit for query: {user_query[:50]}...")
            add_breadcrumb("Cache hit", "cache", query=user_query[:50])
            
            # Stream cached response word by word for natural feel
            words = cached_response.split()
            for i, word in enumerate(words):
                token = word + (" " if i < len(words) - 1 else "")
                response_content += token
                yield {
                    "event": "message",
                    "data": json.dumps({"type": "content", "content": token}),
                }
            
            output_tokens = len(words) * 2  # Rough estimate
        else:
            # Perform semantic search if configured
            retrieved_docs = []
            if settings.is_semantic_search_ready() and user_query:
                try:
                    retrieved_docs = await search_similar(
                        query=user_query,
                        top_k=settings.semantic_search_top_k,
                        threshold=settings.semantic_search_threshold,
                    )
                    if retrieved_docs:
                        logger.info(f"Semantic search: {len(retrieved_docs)} docs retrieved for '{user_query[:50]}...'")
                        add_breadcrumb("Semantic search", "search", docs_found=len(retrieved_docs))
                except Exception as e:
                    logger.warning(f"Semantic search failed, using fallback: {e}")
                    retrieved_docs = []
            
            # Build system prompt (with or without semantic context)
            # Apply A/B testing variations if enabled
            if retrieved_docs:
                system_prompt = build_semantic_prompt(
                    context=context,
                    retrieved_docs=retrieved_docs,
                    query=user_query,
                )
            else:
                # Fallback to full context prompt
                system_prompt = build_system_prompt(context)
            
            # Apply A/B test prompt variations (Phase 4)
            if settings.ab_testing_enabled:
                response_style = get_prompt_for_session(session_id, "response_style")
                if response_style:
                    # Inject A/B test variation into system prompt
                    system_prompt = system_prompt.replace(
                        "RESPONSE RULES:",
                        response_style.strip() if "RESPONSE RULES:" in response_style else f"RESPONSE RULES:\n{response_style}"
                    )
                    add_breadcrumb("A/B test applied", "ab_test", test="response_style")
            
            # Stream tokens from LLM
            token_count = 0
            async for token in stream_chat_completion(
                messages=messages,
                system_prompt=system_prompt,
                max_tokens=settings.ai_max_tokens,
            ):
                response_content += token
                token_count += 1
                yield {
                    "event": "message",
                    "data": json.dumps({"type": "content", "content": token}),
                }
            
            output_tokens = token_count
            
            # Cache the response for future use (if response is valid)
            if response_content and len(response_content) > 20:
                cache.set(user_query, response_content)
        
        # Signal completion
        yield {
            "event": "message",
            "data": json.dumps({"type": "done"}),
        }
        
        # Record metrics (Phase 4)
        response_time_ms = (time.time() - start_time) * 1000
        metrics.record_request(response_time_ms, success=True)
        metrics.log_chat(user_query, response_content, response_time_ms, cached=cached)
        
        # Record token usage for cost monitoring (Phase 4)
        if settings.track_token_costs:
            record_token_usage(
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                model=settings.model,
                provider=settings.ai_provider,
                session_id=session_id,
                cached=cached,
            )
        
    except Exception as e:
        logger.error(f"Stream error: {e}", exc_info=True)
        
        # Report to Sentry
        capture_exception(e, query=user_query[:100] if user_query else None, session_id=session_id)
        
        # Try fallback response
        fallback = get_fallback_response(user_query) if user_query else None
        
        if fallback:
            for word in fallback.split():
                yield {
                    "event": "message",
                    "data": json.dumps({"type": "content", "content": word + " "}),
                }
            yield {
                "event": "message",
                "data": json.dumps({"type": "done"}),
            }
        else:
            yield {
                "event": "message",
                "data": json.dumps({"type": "error", "error": str(e)}),
            }
        
        # Record error
        response_time_ms = (time.time() - start_time) * 1000
        metrics.record_request(response_time_ms, success=False)


@app.post(
    "/chat",
    summary="Chat Completion (Streaming)",
    description="Send a message and receive streaming SSE response",
)
async def chat(request: ChatRequest):
    """Handle chat completion with SSE streaming."""
    
    # Check if provider is configured
    if not is_provider_configured():
        raise HTTPException(
            status_code=503,
            detail=ERROR_MESSAGES["PROVIDER_UNAVAILABLE"],
        )
    
    # Validate request
    if not request.messages:
        raise HTTPException(
            status_code=400,
            detail=ERROR_MESSAGES["INVALID_MESSAGE"],
        )
    
    # Log request (without full content for privacy)
    logger.info(f"Chat request: {len(request.messages)} messages, session={request.session_id}")
    
    # Return SSE stream
    return EventSourceResponse(
        generate_sse_stream(request),
        media_type="text/event-stream",
    )

# =============================================================================
# Metrics Endpoint (Phase 4)
# =============================================================================

@app.get(
    "/metrics",
    summary="Service Metrics",
    description="Get detailed service metrics for monitoring",
)
async def get_metrics():
    """Return detailed service metrics."""
    cache = get_response_cache()
    
    return {
        "service": metrics.get_metrics(),
        "cache": cache.get_stats(),
        "recent_cache_entries": cache.get_entries(limit=5),
    }


# =============================================================================
# Admin Endpoint - Chat Logs (Phase 4)
# =============================================================================

@app.get(
    "/admin/logs",
    summary="Chat Logs",
    description="Get recent chat logs for admin review",
)
async def get_chat_logs(
    limit: int = Query(default=50, ge=1, le=500, description="Number of logs to return"),
):
    """Return recent chat logs."""
    return {
        "logs": metrics.get_logs(limit=limit),
        "total_logged": len(metrics.chat_logs),
    }


# =============================================================================
# Admin Endpoint - Cache Management (Phase 4)
# =============================================================================

@app.post(
    "/admin/cache/clear",
    summary="Clear Cache",
    description="Clear the response cache",
)
async def clear_cache():
    """Clear all cached responses."""
    cache = get_response_cache()
    cleared = cache.clear()
    
    logger.info(f"Cache cleared: {cleared} entries removed")
    
    return {
        "success": True,
        "entries_cleared": cleared,
    }


@app.get(
    "/admin/cache",
    summary="Cache Details",
    description="Get detailed cache information",
)
async def get_cache_details():
    """Get cache statistics and entries."""
    cache = get_response_cache()
    
    return {
        "stats": cache.get_stats(),
        "entries": cache.get_entries(limit=20),
    }


# =============================================================================
# A/B Testing Endpoints (Phase 4)
# =============================================================================

@app.get(
    "/admin/ab-tests",
    summary="A/B Test Status",
    description="Get A/B testing configuration and results",
)
async def get_ab_tests():
    """Get A/B test configuration and statistics."""
    ab_manager = get_ab_manager()
    
    return {
        "enabled": settings.ab_testing_enabled,
        "active_tests": ab_manager.get_all_active_tests(),
        "statistics": ab_manager.get_test_stats(),
    }


@app.post(
    "/admin/ab-tests/feedback",
    summary="Record A/B Test Feedback",
    description="Record feedback for an A/B test variant",
)
async def record_ab_feedback(
    session_id: str,
    test_name: str,
    positive: bool,
):
    """Record feedback for A/B test analysis."""
    ab_manager = get_ab_manager()
    ab_manager.record_feedback(session_id, test_name, positive)
    
    return {"success": True}


# =============================================================================
# Cost Monitoring Endpoints (Phase 4)
# =============================================================================

@app.get(
    "/admin/costs",
    summary="Cost Monitoring",
    description="Get detailed LLM cost metrics",
)
async def get_cost_metrics():
    """Get comprehensive cost metrics."""
    cost_monitor = get_cost_monitor()
    
    return cost_monitor.get_metrics()


@app.get(
    "/admin/costs/summary",
    summary="Cost Summary",
    description="Get cost summary for a specific period",
)
async def get_cost_summary(
    hours: int = Query(default=24, ge=1, le=168, description="Number of hours to summarize"),
):
    """Get cost summary for the specified period."""
    cost_monitor = get_cost_monitor()
    summary = cost_monitor.get_summary(hours)
    
    return {
        "period_hours": hours,
        "total_cost": f"${summary.total_cost:.4f}",
        "total_requests": summary.total_requests,
        "total_tokens": summary.total_tokens,
        "avg_cost_per_request": f"${summary.avg_cost_per_request:.6f}",
        "cached_requests": summary.cached_requests,
        "cache_savings": f"${summary.savings_from_cache:.4f}",
    }


# =============================================================================
# Error Tracking Endpoint (Phase 4)
# =============================================================================

@app.get(
    "/admin/errors",
    summary="Error Tracking Status",
    description="Get error tracking configuration status",
)
async def get_error_tracking_status():
    """Get Sentry error tracking status."""
    return {
        "sentry_configured": bool(settings.sentry_dsn),
        "sentry_initialized": is_sentry_initialized(),
        "environment": settings.environment,
        "error_count": metrics.error_count,
        "error_rate": f"{(metrics.error_count / metrics.request_count * 100):.1f}%" if metrics.request_count > 0 else "0%",
    }


# =============================================================================
# Root Endpoint
# =============================================================================

@app.get("/", include_in_schema=False)
async def root():
    """Root endpoint redirect to docs."""
    return {
        "service": "NEXI AI Chatbot",
        "version": "4.0.0",
        "docs": "/docs",
        "health": "/health",
        "metrics": "/metrics",
        "admin": {
            "logs": "/admin/logs",
            "cache": "/admin/cache",
            "ab_tests": "/admin/ab-tests",
            "costs": "/admin/costs",
            "errors": "/admin/errors",
        },
    }

# =============================================================================
# Main Entry Point
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )
