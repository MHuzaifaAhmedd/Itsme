"""
NEXI AI Chatbot - Embeddings Service

Vector embeddings for semantic search using OpenAI and Pinecone.
"""

import logging
from typing import List, Optional, Dict, Any
from functools import lru_cache

from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec

from config.settings import settings

logger = logging.getLogger("nexi.embeddings")

# =============================================================================
# Client Initialization
# =============================================================================

_openai_client: Optional[OpenAI] = None
_pinecone_client: Optional[Pinecone] = None
_pinecone_index = None


def get_openai_client() -> OpenAI:
    """Get or create OpenAI client for embeddings."""
    global _openai_client
    
    if _openai_client is None:
        if not settings.openai_api_key:
            raise ValueError("OpenAI API key required for embeddings")
        
        _openai_client = OpenAI(api_key=settings.openai_api_key)
        logger.info("OpenAI client initialized for embeddings")
    
    return _openai_client


def get_pinecone_client() -> Pinecone:
    """Get or create Pinecone client."""
    global _pinecone_client
    
    if _pinecone_client is None:
        if not settings.pinecone_api_key:
            raise ValueError("Pinecone API key required for vector search")
        
        _pinecone_client = Pinecone(api_key=settings.pinecone_api_key)
        logger.info("Pinecone client initialized")
    
    return _pinecone_client


def get_pinecone_index():
    """Get or create Pinecone index."""
    global _pinecone_index
    
    if _pinecone_index is None:
        pc = get_pinecone_client()
        
        # Check if index exists
        existing_indexes = [idx.name for idx in pc.list_indexes()]
        
        if settings.pinecone_index_name not in existing_indexes:
            logger.info(f"Creating Pinecone index: {settings.pinecone_index_name}")
            pc.create_index(
                name=settings.pinecone_index_name,
                dimension=settings.embedding_dimensions,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud=settings.pinecone_cloud,
                    region=settings.pinecone_region,
                )
            )
            logger.info(f"Pinecone index created: {settings.pinecone_index_name}")
        
        _pinecone_index = pc.Index(settings.pinecone_index_name)
        logger.info(f"Connected to Pinecone index: {settings.pinecone_index_name}")
    
    return _pinecone_index


# =============================================================================
# Embedding Generation
# =============================================================================

async def generate_embedding(text: str) -> List[float]:
    """
    Generate embedding vector for text using OpenAI.
    
    Args:
        text: Text to embed.
        
    Returns:
        Embedding vector (list of floats).
    """
    if not settings.is_embedding_configured():
        raise ValueError("OpenAI API key required for embeddings")
    
    client = get_openai_client()
    
    # Clean and truncate text if needed (max ~8000 tokens for embedding model)
    clean_text = text.strip()
    if len(clean_text) > 8000:
        clean_text = clean_text[:8000]
    
    response = client.embeddings.create(
        model=settings.embedding_model,
        input=clean_text,
    )
    
    embedding = response.data[0].embedding
    logger.debug(f"Generated embedding for text ({len(clean_text)} chars)")
    
    return embedding


async def generate_embeddings_batch(texts: List[str]) -> List[List[float]]:
    """
    Generate embeddings for multiple texts.
    
    Args:
        texts: List of texts to embed.
        
    Returns:
        List of embedding vectors.
    """
    if not settings.is_embedding_configured():
        raise ValueError("OpenAI API key required for embeddings")
    
    if not texts:
        return []
    
    client = get_openai_client()
    
    # Clean texts
    clean_texts = [t.strip()[:8000] for t in texts]
    
    response = client.embeddings.create(
        model=settings.embedding_model,
        input=clean_texts,
    )
    
    # Sort by index to maintain order
    embeddings = [item.embedding for item in sorted(response.data, key=lambda x: x.index)]
    
    logger.info(f"Generated {len(embeddings)} embeddings in batch")
    
    return embeddings


# =============================================================================
# Vector Storage
# =============================================================================

async def upsert_vectors(
    vectors: List[Dict[str, Any]],
    namespace: str = "portfolio",
) -> int:
    """
    Upsert vectors to Pinecone index.
    
    Args:
        vectors: List of dicts with 'id', 'values', and 'metadata'.
        namespace: Pinecone namespace.
        
    Returns:
        Number of vectors upserted.
    """
    if not settings.is_pinecone_configured():
        raise ValueError("Pinecone API key required")
    
    index = get_pinecone_index()
    
    # Pinecone accepts batches of up to 100 vectors
    batch_size = 100
    total_upserted = 0
    
    for i in range(0, len(vectors), batch_size):
        batch = vectors[i:i + batch_size]
        index.upsert(vectors=batch, namespace=namespace)
        total_upserted += len(batch)
        logger.debug(f"Upserted batch {i // batch_size + 1}: {len(batch)} vectors")
    
    logger.info(f"Upserted {total_upserted} vectors to namespace '{namespace}'")
    
    return total_upserted


async def delete_namespace(namespace: str = "portfolio") -> bool:
    """
    Delete all vectors in a namespace.
    
    Args:
        namespace: Pinecone namespace to delete.
        
    Returns:
        True if successful.
    """
    if not settings.is_pinecone_configured():
        raise ValueError("Pinecone API key required")
    
    index = get_pinecone_index()
    index.delete(delete_all=True, namespace=namespace)
    
    logger.info(f"Deleted all vectors in namespace '{namespace}'")
    return True


# =============================================================================
# Semantic Search
# =============================================================================

async def search_similar(
    query: str,
    top_k: Optional[int] = None,
    threshold: Optional[float] = None,
    namespace: str = "portfolio",
) -> List[Dict[str, Any]]:
    """
    Search for similar documents using vector similarity.
    
    Args:
        query: Search query text.
        top_k: Number of results to return.
        threshold: Minimum similarity score (0-1).
        namespace: Pinecone namespace to search.
        
    Returns:
        List of matching documents with scores and metadata.
    """
    if not settings.is_semantic_search_ready():
        logger.warning("Semantic search not configured, returning empty results")
        return []
    
    top_k = top_k or settings.semantic_search_top_k
    threshold = threshold or settings.semantic_search_threshold
    
    # Generate query embedding
    query_embedding = await generate_embedding(query)
    
    # Search Pinecone
    index = get_pinecone_index()
    
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True,
        namespace=namespace,
    )
    
    # Filter by threshold and format results
    matches = []
    for match in results.matches:
        if match.score >= threshold:
            matches.append({
                "id": match.id,
                "score": match.score,
                "content": match.metadata.get("content", ""),
                "source": match.metadata.get("source", ""),
                "type": match.metadata.get("type", ""),
                "metadata": match.metadata,
            })
    
    logger.info(f"Semantic search: '{query[:50]}...' -> {len(matches)} results (threshold: {threshold})")
    
    return matches


async def search_by_embedding(
    embedding: List[float],
    top_k: Optional[int] = None,
    threshold: Optional[float] = None,
    namespace: str = "portfolio",
) -> List[Dict[str, Any]]:
    """
    Search using a pre-computed embedding.
    
    Args:
        embedding: Pre-computed embedding vector.
        top_k: Number of results to return.
        threshold: Minimum similarity score.
        namespace: Pinecone namespace to search.
        
    Returns:
        List of matching documents with scores.
    """
    if not settings.is_pinecone_configured():
        return []
    
    top_k = top_k or settings.semantic_search_top_k
    threshold = threshold or settings.semantic_search_threshold
    
    index = get_pinecone_index()
    
    results = index.query(
        vector=embedding,
        top_k=top_k,
        include_metadata=True,
        namespace=namespace,
    )
    
    matches = []
    for match in results.matches:
        if match.score >= threshold:
            matches.append({
                "id": match.id,
                "score": match.score,
                "content": match.metadata.get("content", ""),
                "source": match.metadata.get("source", ""),
                "type": match.metadata.get("type", ""),
                "metadata": match.metadata,
            })
    
    return matches


# =============================================================================
# Index Statistics
# =============================================================================

async def get_index_stats() -> Dict[str, Any]:
    """
    Get Pinecone index statistics.
    
    Returns:
        Index statistics including vector counts.
    """
    if not settings.is_pinecone_configured():
        return {"error": "Pinecone not configured"}
    
    index = get_pinecone_index()
    stats = index.describe_index_stats()
    
    return {
        "dimension": stats.dimension,
        "total_vector_count": stats.total_vector_count,
        "namespaces": {
            ns: {"vector_count": data.vector_count}
            for ns, data in stats.namespaces.items()
        }
    }
