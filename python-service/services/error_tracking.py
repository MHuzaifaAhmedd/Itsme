"""
NEXI AI Chatbot - Error Tracking Service

Integrates Sentry for error tracking and performance monitoring.
"""

import logging
from typing import Optional, Dict, Any
from functools import wraps

logger = logging.getLogger("nexi.errors")

# Sentry SDK (imported conditionally)
_sentry_initialized = False
_sentry_sdk = None


def init_sentry(dsn: Optional[str], environment: str = "development") -> bool:
    """
    Initialize Sentry error tracking.
    
    Args:
        dsn: Sentry DSN (Data Source Name)
        environment: Environment name (development, staging, production)
        
    Returns:
        True if Sentry was initialized, False otherwise
    """
    global _sentry_initialized, _sentry_sdk
    
    if not dsn:
        logger.info("Sentry DSN not configured - error tracking disabled")
        return False
    
    try:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration
        from sentry_sdk.integrations.starlette import StarletteIntegration
        from sentry_sdk.integrations.logging import LoggingIntegration
        
        sentry_sdk.init(
            dsn=dsn,
            environment=environment,
            
            # Performance monitoring
            traces_sample_rate=0.1 if environment == "production" else 1.0,
            profiles_sample_rate=0.1 if environment == "production" else 1.0,
            
            # Integrations
            integrations=[
                FastApiIntegration(transaction_style="endpoint"),
                StarletteIntegration(transaction_style="endpoint"),
                LoggingIntegration(
                    level=logging.INFO,
                    event_level=logging.ERROR,
                ),
            ],
            
            # Release tracking
            release=f"nexi-python@4.0.0",
            
            # Filter sensitive data
            send_default_pii=False,
            
            # Before send hook
            before_send=_before_send,
        )
        
        _sentry_sdk = sentry_sdk
        _sentry_initialized = True
        logger.info(f"Sentry initialized (environment: {environment})")
        return True
        
    except ImportError:
        logger.warning("sentry-sdk not installed - error tracking disabled")
        return False
    except Exception as e:
        logger.error(f"Failed to initialize Sentry: {e}")
        return False


def _before_send(event: Dict[str, Any], hint: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Filter and enhance events before sending to Sentry."""
    
    # Add custom tags
    if "tags" not in event:
        event["tags"] = {}
    event["tags"]["service"] = "nexi-python"
    
    # Filter out expected errors
    if "exception" in event:
        exception_values = event.get("exception", {}).get("values", [])
        for exc in exception_values:
            exc_type = exc.get("type", "")
            exc_value = exc.get("value", "")
            
            # Skip rate limit errors (expected)
            if "RateLimitError" in exc_type:
                return None
            
            # Skip connection errors during dev
            if "ConnectionRefusedError" in exc_type:
                return None
    
    return event


def capture_exception(error: Exception, **context: Any) -> Optional[str]:
    """
    Capture and report an exception to Sentry.
    
    Args:
        error: The exception to report
        **context: Additional context to attach
        
    Returns:
        Sentry event ID if reported, None otherwise
    """
    if not _sentry_initialized or not _sentry_sdk:
        logger.error(f"Exception (not reported): {error}", exc_info=error)
        return None
    
    with _sentry_sdk.push_scope() as scope:
        for key, value in context.items():
            scope.set_extra(key, value)
        
        event_id = _sentry_sdk.capture_exception(error)
        logger.debug(f"Exception reported to Sentry: {event_id}")
        return event_id


def capture_message(message: str, level: str = "info", **context: Any) -> Optional[str]:
    """
    Capture and report a message to Sentry.
    
    Args:
        message: The message to report
        level: Log level (debug, info, warning, error, fatal)
        **context: Additional context to attach
        
    Returns:
        Sentry event ID if reported, None otherwise
    """
    if not _sentry_initialized or not _sentry_sdk:
        logger.info(f"Message (not reported): {message}")
        return None
    
    with _sentry_sdk.push_scope() as scope:
        for key, value in context.items():
            scope.set_extra(key, value)
        
        event_id = _sentry_sdk.capture_message(message, level=level)
        return event_id


def set_user(user_id: Optional[str] = None, session_id: Optional[str] = None):
    """Set the current user context for error reports."""
    if not _sentry_initialized or not _sentry_sdk:
        return
    
    _sentry_sdk.set_user({
        "id": user_id or session_id,
        "session_id": session_id,
    })


def add_breadcrumb(message: str, category: str = "default", **data: Any):
    """Add a breadcrumb for debugging context."""
    if not _sentry_initialized or not _sentry_sdk:
        return
    
    _sentry_sdk.add_breadcrumb(
        category=category,
        message=message,
        data=data,
        level="info",
    )


def track_chat_error(func):
    """Decorator to track chat-related errors with extra context."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            capture_exception(
                e,
                function=func.__name__,
                args_count=len(args),
                kwargs_keys=list(kwargs.keys()),
            )
            raise
    return wrapper


def is_initialized() -> bool:
    """Check if Sentry is initialized."""
    return _sentry_initialized
