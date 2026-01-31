"""
NEXI AI Chatbot - A/B Testing Service

Implements A/B testing for prompts and responses.
Allows testing different prompt variations to optimize chat quality.
"""

import hashlib
import logging
import random
import time
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any, Callable
from enum import Enum

logger = logging.getLogger("nexi.ab_testing")


# =============================================================================
# A/B Test Variants
# =============================================================================

class PromptVariant(Enum):
    """Available prompt variants for A/B testing."""
    CONTROL = "control"           # Original prompt (baseline)
    CONCISE = "concise"          # More concise responses
    FRIENDLY = "friendly"        # More conversational tone
    TECHNICAL = "technical"      # More technical detail
    STRUCTURED = "structured"    # Bullet points and structure


@dataclass
class ABTestConfig:
    """Configuration for an A/B test."""
    name: str
    variants: Dict[str, float]  # variant_name -> weight (0.0 to 1.0)
    enabled: bool = True
    description: str = ""
    created_at: float = field(default_factory=time.time)
    
    def __post_init__(self):
        # Validate weights sum to 1.0
        total = sum(self.variants.values())
        if abs(total - 1.0) > 0.001:
            raise ValueError(f"Variant weights must sum to 1.0, got {total}")


@dataclass
class ABTestResult:
    """Result of variant assignment."""
    test_name: str
    variant: str
    session_id: str
    assigned_at: float = field(default_factory=time.time)


# =============================================================================
# Prompt Variations
# =============================================================================

PROMPT_VARIATIONS: Dict[str, Dict[str, str]] = {
    # Response style instructions
    "response_style": {
        PromptVariant.CONTROL.value: """
RESPONSE RULES:
1. Always base answers on the CONTEXT below
2. Keep responses under 4 sentences
3. If asked about topics outside the portfolio, politely redirect
4. For hiring/contact inquiries, direct to the contact form
5. Never claim to know information not in the portfolio
""",
        PromptVariant.CONCISE.value: """
RESPONSE RULES:
1. Be extremely concise - max 2 sentences
2. Use bullet points for lists
3. Get straight to the point
4. Only redirect if absolutely necessary
5. Never fabricate information
""",
        PromptVariant.FRIENDLY.value: """
RESPONSE RULES:
1. Be warm and conversational
2. Use phrases like "Great question!" or "I'd love to tell you about..."
3. Add relevant emoji occasionally
4. Keep responses natural and engaging
5. Encourage follow-up questions
""",
        PromptVariant.TECHNICAL.value: """
RESPONSE RULES:
1. Include technical details when relevant
2. Mention specific technologies, versions, patterns used
3. Explain the "why" behind technical decisions
4. Use code snippets or technical terms appropriately
5. Be precise and accurate
""",
        PromptVariant.STRUCTURED.value: """
RESPONSE RULES:
1. Use bullet points and numbered lists
2. Structure responses with clear sections
3. Highlight key information with **bold**
4. Keep each point concise
5. Add a summary or next step at the end
""",
    },
    
    # Opening personality
    "personality": {
        PromptVariant.CONTROL.value: "You are NEXI, a professional AI assistant.",
        PromptVariant.FRIENDLY.value: "You are NEXI, a friendly and enthusiastic AI assistant who loves helping people learn about the portfolio!",
        PromptVariant.TECHNICAL.value: "You are NEXI, a technically-minded AI assistant with deep expertise in software development.",
    },
}


# =============================================================================
# A/B Testing Manager
# =============================================================================

class ABTestManager:
    """
    Manages A/B tests for the chatbot.
    
    Features:
    - Consistent assignment per session
    - Weighted random assignment
    - Metrics tracking
    """
    
    def __init__(self, seed: Optional[str] = None):
        self.seed = seed
        self._tests: Dict[str, ABTestConfig] = {}
        self._assignments: Dict[str, Dict[str, ABTestResult]] = {}  # session_id -> {test_name -> result}
        self._metrics: Dict[str, Dict[str, Dict[str, Any]]] = {}  # test_name -> variant -> metrics
        
        # Register default tests
        self._register_default_tests()
    
    def _register_default_tests(self):
        """Register the default A/B tests."""
        # Test 1: Response Style
        self.register_test(ABTestConfig(
            name="response_style",
            variants={
                PromptVariant.CONTROL.value: 0.40,   # 40% baseline
                PromptVariant.CONCISE.value: 0.20,   # 20% concise
                PromptVariant.FRIENDLY.value: 0.20,  # 20% friendly
                PromptVariant.STRUCTURED.value: 0.20, # 20% structured
            },
            description="Test different response style instructions",
        ))
        
        # Test 2: Personality Tone
        self.register_test(ABTestConfig(
            name="personality",
            variants={
                PromptVariant.CONTROL.value: 0.50,   # 50% baseline
                PromptVariant.FRIENDLY.value: 0.30,  # 30% friendly
                PromptVariant.TECHNICAL.value: 0.20, # 20% technical
            },
            description="Test different personality tones",
        ))
    
    def register_test(self, config: ABTestConfig):
        """Register a new A/B test."""
        self._tests[config.name] = config
        self._metrics[config.name] = {
            variant: {"assignments": 0, "positive_feedback": 0, "negative_feedback": 0}
            for variant in config.variants
        }
        logger.info(f"Registered A/B test: {config.name} with {len(config.variants)} variants")
    
    def _hash_assignment(self, session_id: str, test_name: str) -> float:
        """Generate a deterministic hash for consistent assignment."""
        seed_str = self.seed or ""
        key = f"{seed_str}:{session_id}:{test_name}"
        hash_bytes = hashlib.sha256(key.encode()).digest()
        # Convert first 8 bytes to a float between 0 and 1
        hash_int = int.from_bytes(hash_bytes[:8], byteorder="big")
        return hash_int / (2**64 - 1)
    
    def get_variant(self, session_id: str, test_name: str) -> str:
        """
        Get the variant for a session.
        
        Uses consistent hashing to ensure the same session always gets
        the same variant, even across restarts.
        """
        # Check if already assigned
        if session_id in self._assignments:
            if test_name in self._assignments[session_id]:
                return self._assignments[session_id][test_name].variant
        
        # Get test config
        test = self._tests.get(test_name)
        if not test or not test.enabled:
            return PromptVariant.CONTROL.value
        
        # Deterministic assignment based on session hash
        hash_value = self._hash_assignment(session_id, test_name)
        
        # Select variant based on weights
        cumulative = 0.0
        selected = PromptVariant.CONTROL.value
        
        for variant, weight in test.variants.items():
            cumulative += weight
            if hash_value < cumulative:
                selected = variant
                break
        
        # Store assignment
        if session_id not in self._assignments:
            self._assignments[session_id] = {}
        
        result = ABTestResult(
            test_name=test_name,
            variant=selected,
            session_id=session_id,
        )
        self._assignments[session_id][test_name] = result
        
        # Update metrics
        self._metrics[test_name][selected]["assignments"] += 1
        
        logger.debug(f"A/B assigned: session={session_id[:8]}... test={test_name} variant={selected}")
        return selected
    
    def get_prompt_variation(self, session_id: str, variation_type: str) -> str:
        """
        Get the prompt variation text for a session.
        
        Args:
            session_id: The session identifier
            variation_type: Type of variation (e.g., "response_style", "personality")
            
        Returns:
            The prompt text for the assigned variant
        """
        variant = self.get_variant(session_id, variation_type)
        variations = PROMPT_VARIATIONS.get(variation_type, {})
        return variations.get(variant, variations.get(PromptVariant.CONTROL.value, ""))
    
    def record_feedback(self, session_id: str, test_name: str, positive: bool):
        """Record feedback for a variant."""
        if session_id not in self._assignments:
            return
        
        if test_name not in self._assignments[session_id]:
            return
        
        variant = self._assignments[session_id][test_name].variant
        
        if positive:
            self._metrics[test_name][variant]["positive_feedback"] += 1
        else:
            self._metrics[test_name][variant]["negative_feedback"] += 1
    
    def get_test_stats(self, test_name: Optional[str] = None) -> Dict[str, Any]:
        """Get statistics for A/B tests."""
        if test_name:
            if test_name not in self._metrics:
                return {}
            
            metrics = self._metrics[test_name]
            return {
                "test_name": test_name,
                "variants": {
                    variant: {
                        **data,
                        "positive_rate": (
                            data["positive_feedback"] / (data["positive_feedback"] + data["negative_feedback"])
                            if (data["positive_feedback"] + data["negative_feedback"]) > 0
                            else None
                        ),
                    }
                    for variant, data in metrics.items()
                },
            }
        
        # Return all tests
        return {
            name: self.get_test_stats(name)
            for name in self._metrics
        }
    
    def get_all_active_tests(self) -> List[Dict[str, Any]]:
        """Get list of all active tests."""
        return [
            {
                "name": test.name,
                "enabled": test.enabled,
                "variants": list(test.variants.keys()),
                "description": test.description,
            }
            for test in self._tests.values()
        ]


# =============================================================================
# Global Instance
# =============================================================================

_ab_manager: Optional[ABTestManager] = None


def get_ab_manager(seed: Optional[str] = None) -> ABTestManager:
    """Get or create the global A/B test manager."""
    global _ab_manager
    
    if _ab_manager is None:
        _ab_manager = ABTestManager(seed=seed)
        logger.info("A/B Testing Manager initialized")
    
    return _ab_manager


def get_variant_for_session(session_id: str, test_name: str) -> str:
    """Convenience function to get a variant for a session."""
    return get_ab_manager().get_variant(session_id, test_name)


def get_prompt_for_session(session_id: str, variation_type: str) -> str:
    """Convenience function to get prompt variation for a session."""
    return get_ab_manager().get_prompt_variation(session_id, variation_type)
