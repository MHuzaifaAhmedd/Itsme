"""
NEXI AI Chatbot - LLM Service

Supports OpenAI and Groq providers with streaming responses.
"""

import logging
from typing import AsyncGenerator, List, Dict, Optional

import httpx

from config.settings import settings

logger = logging.getLogger("nexi.llm")

# =============================================================================
# Provider Configuration
# =============================================================================

def get_provider_config() -> Dict[str, str]:
    """
    Get the active provider configuration.
    
    Returns:
        Dict with provider, model, base_url, and api_key status.
    """
    return {
        "provider": settings.ai_provider,
        "model": settings.model,
        "base_url": settings.base_url,
        "configured": settings.is_configured(),
    }


def is_provider_configured() -> bool:
    """
    Check if the AI provider is properly configured.
    
    Returns:
        True if API key is set, False otherwise.
    """
    return settings.is_configured()


# =============================================================================
# Streaming Chat Completion
# =============================================================================

async def stream_chat_completion(
    messages: List[Dict[str, str]],
    system_prompt: str,
    max_tokens: Optional[int] = None,
    temperature: Optional[float] = None,
) -> AsyncGenerator[str, None]:
    """
    Stream chat completion tokens from the LLM provider.
    
    Args:
        messages: List of conversation messages.
        system_prompt: System prompt for the assistant.
        max_tokens: Maximum tokens in response.
        temperature: Response creativity (0-1).
        
    Yields:
        Token strings as they are generated.
        
    Raises:
        Exception: If API request fails.
    """
    if not settings.api_key:
        raise Exception(f"API key not configured for provider: {settings.ai_provider}")
    
    # Build messages with system prompt
    full_messages = [
        {"role": "system", "content": system_prompt},
        *messages,
    ]
    
    # Request body
    body = {
        "model": settings.model,
        "messages": full_messages,
        "max_tokens": max_tokens or settings.ai_max_tokens,
        "temperature": temperature or settings.ai_temperature,
        "stream": True,
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {settings.api_key}",
    }
    
    url = f"{settings.base_url}/chat/completions"
    
    logger.info(f"Streaming request to {settings.ai_provider} ({settings.model})")
    logger.debug(f"URL: {url}")
    logger.debug(f"Messages: {len(full_messages)}")
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        async with client.stream(
            "POST",
            url,
            json=body,
            headers=headers,
        ) as response:
            if response.status_code != 200:
                error_text = await response.aread()
                logger.error(f"API error ({response.status_code}): {error_text}")
                raise Exception(f"AI provider returned {response.status_code}: {response.reason_phrase}")
            
            # Process the streaming response
            buffer = ""
            async for chunk in response.aiter_text():
                buffer += chunk
                
                # Process complete lines
                while "\n" in buffer:
                    line, buffer = buffer.split("\n", 1)
                    line = line.strip()
                    
                    if not line:
                        continue
                    
                    if line == "data: [DONE]":
                        logger.debug("Stream completed")
                        return
                    
                    if line.startswith("data: "):
                        try:
                            import json
                            data = json.loads(line[6:])
                            
                            # Extract content from delta
                            content = data.get("choices", [{}])[0].get("delta", {}).get("content")
                            
                            if content:
                                yield content
                                
                        except json.JSONDecodeError:
                            logger.debug(f"Skipping malformed chunk: {line[:50]}...")
                            continue


# =============================================================================
# Non-Streaming Chat Completion (Fallback)
# =============================================================================

async def get_chat_completion(
    messages: List[Dict[str, str]],
    system_prompt: str,
    max_tokens: Optional[int] = None,
    temperature: Optional[float] = None,
) -> str:
    """
    Get a non-streaming chat completion.
    
    Args:
        messages: List of conversation messages.
        system_prompt: System prompt for the assistant.
        max_tokens: Maximum tokens in response.
        temperature: Response creativity (0-1).
        
    Returns:
        Complete response string.
        
    Raises:
        Exception: If API request fails.
    """
    if not settings.api_key:
        raise Exception(f"API key not configured for provider: {settings.ai_provider}")
    
    # Build messages with system prompt
    full_messages = [
        {"role": "system", "content": system_prompt},
        *messages,
    ]
    
    # Request body
    body = {
        "model": settings.model,
        "messages": full_messages,
        "max_tokens": max_tokens or settings.ai_max_tokens,
        "temperature": temperature or settings.ai_temperature,
        "stream": False,
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {settings.api_key}",
    }
    
    url = f"{settings.base_url}/chat/completions"
    
    logger.info(f"Non-streaming request to {settings.ai_provider} ({settings.model})")
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(url, json=body, headers=headers)
        
        if response.status_code != 200:
            logger.error(f"API error ({response.status_code}): {response.text}")
            raise Exception(f"AI provider returned {response.status_code}: {response.reason_phrase}")
        
        data = response.json()
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        
        return content
