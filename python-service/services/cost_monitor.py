"""
NEXI AI Chatbot - Cost Monitoring Service

Tracks token usage and calculates costs for LLM API calls.
Helps optimize expenses and stay within budget.
"""

import logging
import time
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from collections import defaultdict

logger = logging.getLogger("nexi.costs")


# =============================================================================
# Cost Configuration
# =============================================================================

# Token costs per 1000 tokens (as of 2024)
TOKEN_COSTS: Dict[str, Dict[str, float]] = {
    "openai": {
        "gpt-4o-mini": {"input": 0.00015, "output": 0.0006},
        "gpt-4o": {"input": 0.005, "output": 0.015},
        "gpt-4-turbo": {"input": 0.01, "output": 0.03},
        "gpt-3.5-turbo": {"input": 0.0005, "output": 0.0015},
    },
    "groq": {
        "llama-3.1-8b-instant": {"input": 0.0, "output": 0.0},  # Free tier
        "llama-3.1-70b-versatile": {"input": 0.00059, "output": 0.00079},
        "mixtral-8x7b-32768": {"input": 0.00027, "output": 0.00027},
    },
}


@dataclass
class TokenUsage:
    """Token usage for a single request."""
    input_tokens: int
    output_tokens: int
    total_tokens: int
    model: str
    provider: str
    timestamp: float = field(default_factory=time.time)
    session_id: Optional[str] = None
    cached: bool = False
    
    @property
    def cost(self) -> float:
        """Calculate the cost of this usage."""
        provider_costs = TOKEN_COSTS.get(self.provider, {})
        model_costs = provider_costs.get(self.model, {"input": 0, "output": 0})
        
        input_cost = (self.input_tokens / 1000) * model_costs["input"]
        output_cost = (self.output_tokens / 1000) * model_costs["output"]
        
        return input_cost + output_cost


@dataclass
class CostSummary:
    """Summary of costs over a period."""
    total_cost: float
    total_requests: int
    total_tokens: int
    total_input_tokens: int
    total_output_tokens: int
    avg_tokens_per_request: float
    avg_cost_per_request: float
    cached_requests: int
    savings_from_cache: float


# =============================================================================
# Cost Monitor
# =============================================================================

class CostMonitor:
    """
    Monitors and tracks LLM API costs.
    
    Features:
    - Per-request token tracking
    - Cost calculation by model
    - Daily/hourly aggregations
    - Cache savings tracking
    - Budget alerts
    """
    
    def __init__(
        self,
        daily_budget: float = 10.0,
        alert_threshold: float = 0.8,
    ):
        self.daily_budget = daily_budget
        self.alert_threshold = alert_threshold
        
        self._usage_log: List[TokenUsage] = []
        self._hourly_costs: Dict[str, float] = defaultdict(float)
        self._daily_costs: Dict[str, float] = defaultdict(float)
        self._model_usage: Dict[str, Dict[str, int]] = defaultdict(lambda: {"input": 0, "output": 0, "requests": 0})
        
        # Cache tracking
        self._cache_hits = 0
        self._estimated_cache_savings = 0.0
    
    def record_usage(
        self,
        input_tokens: int,
        output_tokens: int,
        model: str,
        provider: str,
        session_id: Optional[str] = None,
        cached: bool = False,
    ) -> TokenUsage:
        """
        Record token usage for a request.
        
        Args:
            input_tokens: Number of input tokens
            output_tokens: Number of output tokens
            model: Model name
            provider: Provider name (openai, groq)
            session_id: Optional session identifier
            cached: Whether this was a cache hit
            
        Returns:
            TokenUsage record
        """
        usage = TokenUsage(
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            total_tokens=input_tokens + output_tokens,
            model=model,
            provider=provider,
            session_id=session_id,
            cached=cached,
        )
        
        self._usage_log.append(usage)
        
        # Keep only last 10000 records
        if len(self._usage_log) > 10000:
            self._usage_log = self._usage_log[-10000:]
        
        # Update aggregations
        hour_key = datetime.now().strftime("%Y-%m-%d-%H")
        day_key = datetime.now().strftime("%Y-%m-%d")
        
        cost = usage.cost
        self._hourly_costs[hour_key] += cost
        self._daily_costs[day_key] += cost
        
        # Update model usage
        self._model_usage[model]["input"] += input_tokens
        self._model_usage[model]["output"] += output_tokens
        self._model_usage[model]["requests"] += 1
        
        # Track cache
        if cached:
            self._cache_hits += 1
            # Estimate what this would have cost without cache
            self._estimated_cache_savings += self._estimate_cost(input_tokens, output_tokens, model, provider)
        
        # Check budget
        self._check_budget_alert(day_key)
        
        logger.debug(
            f"Token usage: {input_tokens}in/{output_tokens}out "
            f"({model}) = ${cost:.6f}"
        )
        
        return usage
    
    def _estimate_cost(
        self,
        input_tokens: int,
        output_tokens: int,
        model: str,
        provider: str,
    ) -> float:
        """Estimate cost for given token counts."""
        provider_costs = TOKEN_COSTS.get(provider, {})
        model_costs = provider_costs.get(model, {"input": 0, "output": 0})
        
        input_cost = (input_tokens / 1000) * model_costs["input"]
        output_cost = (output_tokens / 1000) * model_costs["output"]
        
        return input_cost + output_cost
    
    def _check_budget_alert(self, day_key: str):
        """Check if approaching budget limit."""
        daily_cost = self._daily_costs[day_key]
        
        if daily_cost >= self.daily_budget * self.alert_threshold:
            if daily_cost >= self.daily_budget:
                logger.warning(f"BUDGET EXCEEDED: ${daily_cost:.4f} / ${self.daily_budget:.2f}")
            else:
                logger.warning(f"Budget alert: ${daily_cost:.4f} / ${self.daily_budget:.2f} ({daily_cost/self.daily_budget:.0%})")
    
    def get_summary(self, hours: int = 24) -> CostSummary:
        """Get cost summary for the last N hours."""
        cutoff = time.time() - (hours * 3600)
        
        recent_usage = [u for u in self._usage_log if u.timestamp > cutoff]
        
        if not recent_usage:
            return CostSummary(
                total_cost=0,
                total_requests=0,
                total_tokens=0,
                total_input_tokens=0,
                total_output_tokens=0,
                avg_tokens_per_request=0,
                avg_cost_per_request=0,
                cached_requests=0,
                savings_from_cache=0,
            )
        
        total_cost = sum(u.cost for u in recent_usage)
        total_requests = len(recent_usage)
        total_tokens = sum(u.total_tokens for u in recent_usage)
        total_input = sum(u.input_tokens for u in recent_usage)
        total_output = sum(u.output_tokens for u in recent_usage)
        cached_requests = sum(1 for u in recent_usage if u.cached)
        
        return CostSummary(
            total_cost=total_cost,
            total_requests=total_requests,
            total_tokens=total_tokens,
            total_input_tokens=total_input,
            total_output_tokens=total_output,
            avg_tokens_per_request=total_tokens / total_requests if total_requests > 0 else 0,
            avg_cost_per_request=total_cost / total_requests if total_requests > 0 else 0,
            cached_requests=cached_requests,
            savings_from_cache=self._estimated_cache_savings,
        )
    
    def get_daily_breakdown(self, days: int = 7) -> Dict[str, Dict[str, Any]]:
        """Get cost breakdown by day."""
        result = {}
        
        for i in range(days):
            date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
            day_usage = [
                u for u in self._usage_log
                if datetime.fromtimestamp(u.timestamp).strftime("%Y-%m-%d") == date
            ]
            
            if day_usage:
                result[date] = {
                    "cost": sum(u.cost for u in day_usage),
                    "requests": len(day_usage),
                    "tokens": sum(u.total_tokens for u in day_usage),
                }
            else:
                result[date] = {"cost": 0, "requests": 0, "tokens": 0}
        
        return result
    
    def get_model_breakdown(self) -> Dict[str, Dict[str, Any]]:
        """Get usage breakdown by model."""
        result = {}
        
        for model, usage in self._model_usage.items():
            provider_costs = None
            for provider, models in TOKEN_COSTS.items():
                if model in models:
                    provider_costs = models[model]
                    break
            
            if not provider_costs:
                provider_costs = {"input": 0, "output": 0}
            
            input_cost = (usage["input"] / 1000) * provider_costs["input"]
            output_cost = (usage["output"] / 1000) * provider_costs["output"]
            
            result[model] = {
                "requests": usage["requests"],
                "input_tokens": usage["input"],
                "output_tokens": usage["output"],
                "total_tokens": usage["input"] + usage["output"],
                "cost": input_cost + output_cost,
            }
        
        return result
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get comprehensive cost metrics."""
        summary_24h = self.get_summary(24)
        summary_1h = self.get_summary(1)
        
        today = datetime.now().strftime("%Y-%m-%d")
        
        return {
            "summary_24h": {
                "total_cost": f"${summary_24h.total_cost:.4f}",
                "total_requests": summary_24h.total_requests,
                "total_tokens": summary_24h.total_tokens,
                "avg_cost_per_request": f"${summary_24h.avg_cost_per_request:.6f}",
                "cached_requests": summary_24h.cached_requests,
                "cache_savings": f"${summary_24h.savings_from_cache:.4f}",
            },
            "summary_1h": {
                "total_cost": f"${summary_1h.total_cost:.4f}",
                "total_requests": summary_1h.total_requests,
            },
            "budget": {
                "daily_limit": f"${self.daily_budget:.2f}",
                "today_spent": f"${self._daily_costs.get(today, 0):.4f}",
                "remaining": f"${max(0, self.daily_budget - self._daily_costs.get(today, 0)):.4f}",
                "usage_percent": f"{(self._daily_costs.get(today, 0) / self.daily_budget * 100):.1f}%",
            },
            "model_breakdown": self.get_model_breakdown(),
            "daily_breakdown": self.get_daily_breakdown(7),
        }


# =============================================================================
# Global Instance
# =============================================================================

_cost_monitor: Optional[CostMonitor] = None


def get_cost_monitor(daily_budget: float = 10.0) -> CostMonitor:
    """Get or create the global cost monitor."""
    global _cost_monitor
    
    if _cost_monitor is None:
        _cost_monitor = CostMonitor(daily_budget=daily_budget)
        logger.info(f"Cost Monitor initialized (daily budget: ${daily_budget})")
    
    return _cost_monitor


def record_token_usage(
    input_tokens: int,
    output_tokens: int,
    model: str,
    provider: str,
    session_id: Optional[str] = None,
    cached: bool = False,
) -> TokenUsage:
    """Convenience function to record token usage."""
    return get_cost_monitor().record_usage(
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        model=model,
        provider=provider,
        session_id=session_id,
        cached=cached,
    )
