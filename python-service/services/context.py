"""
NEXI AI Chatbot - Portfolio Context Loader

Loads and caches portfolio data from JSON file.
"""

import json
import logging
from pathlib import Path
from functools import lru_cache
from typing import Dict, Any

from models.schemas import PortfolioContext

logger = logging.getLogger("nexi.context")

# =============================================================================
# Portfolio Data Path
# =============================================================================

# Path relative to this file
DATA_PATH = Path(__file__).parent.parent / "data" / "portfolio.json"


# =============================================================================
# Data Loading Functions
# =============================================================================

def load_portfolio_data() -> Dict[str, Any]:
    """
    Load raw portfolio data from JSON file.
    
    Returns:
        Raw portfolio data dictionary.
        
    Raises:
        FileNotFoundError: If portfolio.json doesn't exist.
        json.JSONDecodeError: If JSON is invalid.
    """
    if not DATA_PATH.exists():
        logger.error(f"Portfolio data not found at: {DATA_PATH}")
        raise FileNotFoundError(f"Portfolio data not found: {DATA_PATH}")
    
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    logger.debug(f"Loaded portfolio data from: {DATA_PATH}")
    return data


@lru_cache(maxsize=1)
def get_portfolio_context() -> PortfolioContext:
    """
    Get cached portfolio context.
    
    Uses LRU cache to avoid reloading on every request.
    Call get_portfolio_context.cache_clear() to reload.
    
    Returns:
        Validated PortfolioContext model.
    """
    raw_data = load_portfolio_data()
    
    # Validate and create Pydantic model
    context = PortfolioContext(**raw_data)
    
    logger.info(f"Portfolio context loaded: {context.owner.name}")
    logger.info(f"  - Projects: {len(context.projects)}")
    logger.info(f"  - Skills categories: {len(context.skills.model_fields)}")
    
    return context


def reload_portfolio_context() -> PortfolioContext:
    """
    Force reload portfolio context from disk.
    
    Clears the cache and loads fresh data.
    
    Returns:
        Fresh PortfolioContext model.
    """
    get_portfolio_context.cache_clear()
    return get_portfolio_context()


# =============================================================================
# Utility Functions
# =============================================================================

def get_project_by_slug(slug: str) -> Dict[str, Any] | None:
    """
    Get a specific project by its slug.
    
    Args:
        slug: Project slug identifier.
        
    Returns:
        Project dict if found, None otherwise.
    """
    context = get_portfolio_context()
    
    for project in context.projects:
        if project.slug == slug:
            return project.model_dump()
    
    return None


def search_projects(query: str) -> list[Dict[str, Any]]:
    """
    Simple keyword search in projects.
    
    Args:
        query: Search query string.
        
    Returns:
        List of matching projects.
    """
    context = get_portfolio_context()
    query_lower = query.lower()
    matches = []
    
    for project in context.projects:
        # Search in name, description, tech stack
        searchable = " ".join([
            project.name.lower(),
            project.description.lower(),
            project.type.lower(),
            " ".join(project.techStack).lower(),
        ])
        
        if query_lower in searchable:
            matches.append(project.model_dump())
    
    return matches
