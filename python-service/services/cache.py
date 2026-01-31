"""
NEXI AI Chatbot - Response Caching Service

Implements caching for LLM responses to:
- Reduce API costs
- Improve response time for frequent questions
- Provide fallback responses when API is unavailable
"""

import hashlib
import json
import logging
import time
from typing import Optional, Dict, Any, List
from dataclasses import dataclass, field
from collections import OrderedDict

logger = logging.getLogger("nexi.cache")

# =============================================================================
# Cache Configuration
# =============================================================================

DEFAULT_TTL = 3600  # 1 hour
MAX_CACHE_SIZE = 500  # Maximum number of cached responses
SIMILARITY_THRESHOLD = 0.9  # For fuzzy matching (future enhancement)


@dataclass
class CacheEntry:
    """A single cache entry with metadata."""
    key: str
    response: str
    created_at: float
    expires_at: float
    hit_count: int = 0
    last_accessed: float = field(default_factory=time.time)
    metadata: Dict[str, Any] = field(default_factory=dict)


# =============================================================================
# Response Cache
# =============================================================================

class ResponseCache:
    """
    LRU cache for LLM responses with TTL support.
    
    Features:
    - TTL-based expiration
    - LRU eviction when cache is full
    - Query normalization for better hit rates
    - Statistics tracking
    """
    
    def __init__(self, max_size: int = MAX_CACHE_SIZE, default_ttl: int = DEFAULT_TTL):
        self.max_size = max_size
        self.default_ttl = default_ttl
        self._cache: OrderedDict[str, CacheEntry] = OrderedDict()
        self._stats = {
            "hits": 0,
            "misses": 0,
            "evictions": 0,
            "expirations": 0,
        }
    
    def _generate_key(self, query: str, context_hash: Optional[str] = None) -> str:
        """Generate a cache key from query and optional context."""
        normalized = self._normalize_query(query)
        
        if context_hash:
            key_input = f"{normalized}|{context_hash}"
        else:
            key_input = normalized
        
        return hashlib.sha256(key_input.encode()).hexdigest()[:16]
    
    def _normalize_query(self, query: str) -> str:
        """
        Normalize query for better cache hit rates.
        
        - Lowercase
        - Remove extra whitespace
        - Remove common filler words
        - Sort words (optional, for better matching)
        """
        # Basic normalization
        normalized = query.lower().strip()
        normalized = " ".join(normalized.split())  # Remove extra whitespace
        
        # Remove common question prefixes
        prefixes_to_remove = [
            "can you tell me",
            "could you tell me",
            "i want to know",
            "i'd like to know",
            "please tell me",
            "what is",
            "what are",
            "tell me about",
        ]
        
        for prefix in prefixes_to_remove:
            if normalized.startswith(prefix):
                normalized = normalized[len(prefix):].strip()
                break
        
        return normalized
    
    def get(self, query: str, context_hash: Optional[str] = None) -> Optional[str]:
        """
        Get cached response for a query.
        
        Args:
            query: The user's question
            context_hash: Optional hash of context for more specific caching
            
        Returns:
            Cached response if found and not expired, None otherwise
        """
        key = self._generate_key(query, context_hash)
        
        if key not in self._cache:
            self._stats["misses"] += 1
            return None
        
        entry = self._cache[key]
        
        # Check expiration
        if time.time() > entry.expires_at:
            self._stats["expirations"] += 1
            del self._cache[key]
            return None
        
        # Update access stats and move to end (LRU)
        entry.hit_count += 1
        entry.last_accessed = time.time()
        self._cache.move_to_end(key)
        
        self._stats["hits"] += 1
        logger.debug(f"Cache hit for query: {query[:50]}...")
        
        return entry.response
    
    def set(
        self,
        query: str,
        response: str,
        context_hash: Optional[str] = None,
        ttl: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> str:
        """
        Cache a response for a query.
        
        Args:
            query: The user's question
            response: The LLM response to cache
            context_hash: Optional hash of context
            ttl: Time-to-live in seconds (defaults to DEFAULT_TTL)
            metadata: Optional metadata to store with entry
            
        Returns:
            The cache key
        """
        key = self._generate_key(query, context_hash)
        ttl = ttl or self.default_ttl
        
        # Evict if at capacity
        while len(self._cache) >= self.max_size:
            oldest_key = next(iter(self._cache))
            del self._cache[oldest_key]
            self._stats["evictions"] += 1
        
        # Create entry
        now = time.time()
        entry = CacheEntry(
            key=key,
            response=response,
            created_at=now,
            expires_at=now + ttl,
            metadata=metadata or {},
        )
        
        self._cache[key] = entry
        logger.debug(f"Cached response for query: {query[:50]}...")
        
        return key
    
    def invalidate(self, query: str, context_hash: Optional[str] = None) -> bool:
        """Remove a specific entry from cache."""
        key = self._generate_key(query, context_hash)
        
        if key in self._cache:
            del self._cache[key]
            return True
        
        return False
    
    def clear(self) -> int:
        """Clear all cache entries. Returns number of entries cleared."""
        count = len(self._cache)
        self._cache.clear()
        return count
    
    def cleanup_expired(self) -> int:
        """Remove all expired entries. Returns number of entries removed."""
        now = time.time()
        expired_keys = [
            key for key, entry in self._cache.items()
            if now > entry.expires_at
        ]
        
        for key in expired_keys:
            del self._cache[key]
            self._stats["expirations"] += 1
        
        return len(expired_keys)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        total_requests = self._stats["hits"] + self._stats["misses"]
        hit_rate = self._stats["hits"] / total_requests if total_requests > 0 else 0
        
        return {
            "size": len(self._cache),
            "max_size": self.max_size,
            "hits": self._stats["hits"],
            "misses": self._stats["misses"],
            "hit_rate": f"{hit_rate:.1%}",
            "evictions": self._stats["evictions"],
            "expirations": self._stats["expirations"],
        }
    
    def get_entries(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent cache entries (for admin/debugging)."""
        entries = []
        
        for key, entry in list(self._cache.items())[-limit:]:
            entries.append({
                "key": key,
                "response_preview": entry.response[:100] + "..." if len(entry.response) > 100 else entry.response,
                "hit_count": entry.hit_count,
                "created_at": entry.created_at,
                "expires_in": max(0, entry.expires_at - time.time()),
            })
        
        return entries


# =============================================================================
# Global Cache Instance
# =============================================================================

# Singleton cache instance
_response_cache: Optional[ResponseCache] = None


def get_response_cache() -> ResponseCache:
    """Get or create the global response cache."""
    global _response_cache
    
    if _response_cache is None:
        _response_cache = ResponseCache()
        logger.info("Response cache initialized")
    
    return _response_cache


# =============================================================================
# Common Responses (Fallback Cache)
# =============================================================================

# Pre-cached responses for common questions (used as fallback)
COMMON_RESPONSES: Dict[str, str] = {
    "what projects": "I've worked on several exciting projects including an **Employee Management System** with real-time tracking, a **WhatsApp Funnel** for lead management, and **Clothie** - a custom e-commerce platform. Would you like to know more about any of these?",
    
    "tech stack": "I specialize in the modern JavaScript ecosystem - **Next.js**, **React**, and **TypeScript** on the frontend, with **Node.js**, **Express**, and **MongoDB** on the backend. I also work with **Redis** for caching and **Socket.IO** for real-time features.",
    
    "contact": "You can reach out via email or connect on LinkedIn. I'm available for freelance projects and full-time opportunities. Would you like me to share the contact details?",
    
    "skills": "My core skills include **Frontend** (React, Next.js, TypeScript), **Backend** (Node.js, Express, MongoDB), **Cloud** (AWS, Vercel, Docker), and **Real-time Systems** (Socket.IO, Redis). I also have experience with API integrations and performance optimization.",
    
    "hello": "Hi there! I'm NEXI, the AI assistant for this portfolio. I can tell you about projects, technical skills, and how to get in touch. What would you like to know?",
}


def get_fallback_response(query: str) -> Optional[str]:
    """
    Get a fallback response for common questions.
    Used when cache miss and API is unavailable.
    """
    query_lower = query.lower()
    
    for key, response in COMMON_RESPONSES.items():
        if key in query_lower:
            return response
    
    return None
