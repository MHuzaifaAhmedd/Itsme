"""
NEXI AI Chatbot - Configuration Module

Environment settings and prompt templates.
"""

from .settings import settings
from .prompts import build_system_prompt, build_semantic_prompt, get_welcome_message, ERROR_MESSAGES

__all__ = [
    "settings",
    "build_system_prompt",
    "build_semantic_prompt",
    "get_welcome_message",
    "ERROR_MESSAGES",
]
