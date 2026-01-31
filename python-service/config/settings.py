"""
NEXI AI Chatbot - Environment Settings

Pydantic-based settings management with environment variable support.
"""

from typing import Literal, Optional
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Server Configuration
    port: int = 8000
    host: str = "0.0.0.0"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    
    # AI Provider Configuration (for chat completions)
    ai_provider: Literal["openai", "groq"] = "groq"
    groq_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    ai_model: Optional[str] = None
    ai_max_tokens: int = 500
    ai_temperature: float = 0.7
    
    # Pinecone Configuration (Phase 2: Semantic Search)
    pinecone_api_key: Optional[str] = None
    pinecone_index_name: str = "nexi-portfolio"
    pinecone_cloud: str = "aws"
    pinecone_region: str = "us-east-1"
    
    # Embedding Configuration
    embedding_model: str = "text-embedding-3-small"
    embedding_dimensions: int = 1536
    semantic_search_top_k: int = 3
    semantic_search_threshold: float = 0.7
    
    # Feature flags
    use_semantic_search: bool = True
    
    # Error Tracking (Phase 4)
    sentry_dsn: Optional[str] = None
    environment: str = "development"
    
    # A/B Testing (Phase 4)
    ab_testing_enabled: bool = True
    ab_test_seed: Optional[str] = None  # For reproducible tests
    
    # Cost Monitoring (Phase 4)
    track_token_costs: bool = True
    openai_cost_per_1k_input: float = 0.0001  # $0.0001 per 1k input tokens (GPT-4o-mini)
    openai_cost_per_1k_output: float = 0.0002  # $0.0002 per 1k output tokens
    groq_cost_per_1k_tokens: float = 0.0  # Groq is free tier
    
    # Provider-specific defaults
    @property
    def model(self) -> str:
        """Get the model to use, with provider-specific defaults."""
        if self.ai_model:
            return self.ai_model
        
        defaults = {
            "openai": "gpt-4o-mini",
            "groq": "llama-3.1-8b-instant",
        }
        return defaults.get(self.ai_provider, "gpt-4o-mini")
    
    @property
    def api_key(self) -> Optional[str]:
        """Get the API key for the active provider."""
        if self.ai_provider == "openai":
            return self.openai_api_key
        return self.groq_api_key
    
    @property
    def base_url(self) -> str:
        """Get the base URL for the active provider."""
        urls = {
            "openai": "https://api.openai.com/v1",
            "groq": "https://api.groq.com/openai/v1",
        }
        return urls.get(self.ai_provider, urls["openai"])
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]
    
    def is_configured(self) -> bool:
        """Check if the AI provider is properly configured."""
        return bool(self.api_key)
    
    def is_pinecone_configured(self) -> bool:
        """Check if Pinecone is properly configured."""
        return bool(self.pinecone_api_key)
    
    def is_embedding_configured(self) -> bool:
        """Check if embedding generation is configured (requires OpenAI key)."""
        return bool(self.openai_api_key)
    
    def is_semantic_search_ready(self) -> bool:
        """Check if semantic search can be used."""
        return (
            self.use_semantic_search 
            and self.is_pinecone_configured() 
            and self.is_embedding_configured()
        )
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Singleton instance for easy import
settings = get_settings()
