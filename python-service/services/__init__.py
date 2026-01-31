"""
NEXI AI Chatbot - Services Module

This module contains the core services for the AI chatbot:
- llm: LLM provider integration (OpenAI, Groq)
- context: Portfolio context loading
- embeddings: Vector embeddings and semantic search (Phase 2)
- cache: Response caching (Phase 4)
- error_tracking: Sentry integration (Phase 4)
- ab_testing: A/B testing for prompts (Phase 4)
- cost_monitor: Token cost tracking (Phase 4)
"""

from .llm import stream_chat_completion, get_provider_config, is_provider_configured
from .context import get_portfolio_context, load_portfolio_data
from .embeddings import (
    generate_embedding,
    generate_embeddings_batch,
    search_similar,
    upsert_vectors,
    get_index_stats,
)
from .cache import (
    get_response_cache,
    get_fallback_response,
    ResponseCache,
)
from .error_tracking import (
    init_sentry,
    capture_exception,
    capture_message,
    set_user,
    add_breadcrumb,
    track_chat_error,
    is_initialized as is_sentry_initialized,
)
from .ab_testing import (
    get_ab_manager,
    get_variant_for_session,
    get_prompt_for_session,
    ABTestManager,
    PromptVariant,
)
from .cost_monitor import (
    get_cost_monitor,
    record_token_usage,
    CostMonitor,
)

__all__ = [
    # LLM
    "stream_chat_completion",
    "get_provider_config",
    "is_provider_configured",
    # Context
    "get_portfolio_context",
    "load_portfolio_data",
    # Embeddings (Phase 2)
    "generate_embedding",
    "generate_embeddings_batch",
    "search_similar",
    "upsert_vectors",
    "get_index_stats",
    # Caching (Phase 4)
    "get_response_cache",
    "get_fallback_response",
    "ResponseCache",
    # Error Tracking (Phase 4)
    "init_sentry",
    "capture_exception",
    "capture_message",
    "set_user",
    "add_breadcrumb",
    "track_chat_error",
    "is_sentry_initialized",
    # A/B Testing (Phase 4)
    "get_ab_manager",
    "get_variant_for_session",
    "get_prompt_for_session",
    "ABTestManager",
    "PromptVariant",
    # Cost Monitoring (Phase 4)
    "get_cost_monitor",
    "record_token_usage",
    "CostMonitor",
]
