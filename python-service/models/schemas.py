"""
NEXI AI Chatbot - Pydantic Schemas

Request/response models for the API.
"""

from typing import Literal, Optional, List
from pydantic import BaseModel, Field


# =============================================================================
# Request Models
# =============================================================================

class Message(BaseModel):
    """A single message in the conversation."""
    role: Literal["user", "assistant"] = Field(
        ..., 
        description="The role of the message sender"
    )
    content: str = Field(
        ..., 
        min_length=1, 
        max_length=500,
        description="The message content"
    )


class ChatRequest(BaseModel):
    """Request body for chat completion."""
    messages: List[Message] = Field(
        ..., 
        min_length=1, 
        max_length=6,
        description="Conversation history (last 6 messages max)"
    )
    session_id: Optional[str] = Field(
        None, 
        description="Optional session identifier for tracking"
    )


# =============================================================================
# Response Models
# =============================================================================

class ChatResponse(BaseModel):
    """Non-streaming chat response."""
    success: bool = True
    content: str = Field(..., description="The assistant's response")
    tokens_used: Optional[int] = Field(None, description="Tokens used in response")


class StreamChunk(BaseModel):
    """A single chunk in the SSE stream."""
    type: Literal["content", "done", "error"] = Field(
        ..., 
        description="Type of stream chunk"
    )
    content: Optional[str] = Field(None, description="Token content (for type=content)")
    error: Optional[str] = Field(None, description="Error message (for type=error)")


class HealthResponse(BaseModel):
    """Health check response."""
    status: Literal["ok", "not_configured", "error"] = Field(
        ..., 
        description="Service status"
    )
    version: str = Field("1.0.0", description="Service version")
    provider: str = Field(..., description="Active AI provider")
    model: str = Field(..., description="Model being used")
    configured: bool = Field(..., description="Whether API key is configured")


class ErrorResponse(BaseModel):
    """Error response."""
    success: bool = False
    error: str = Field(..., description="Error message")
    code: Optional[str] = Field(None, description="Error code")


# =============================================================================
# Portfolio Context Types (for internal use)
# =============================================================================

class OwnerInfo(BaseModel):
    """Portfolio owner information."""
    name: str
    title: str
    bio: str
    location: str


class ProjectInfo(BaseModel):
    """Project information."""
    name: str
    slug: str
    type: str
    description: str
    techStack: List[str]
    highlights: List[str]
    features: List[str]
    year: str
    role: str
    liveUrl: Optional[str] = None


class SkillsInfo(BaseModel):
    """Skills organized by category."""
    frontend: List[str]
    backend: List[str]
    cloud: List[str]
    integrations: List[str]
    practices: List[str]


class ContactInfo(BaseModel):
    """Contact information."""
    email: str
    github: str
    linkedin: str
    cta: str


class PortfolioContext(BaseModel):
    """Full portfolio context."""
    owner: OwnerInfo
    projects: List[ProjectInfo]
    skills: SkillsInfo
    contact: ContactInfo
    quickFacts: List[str]
