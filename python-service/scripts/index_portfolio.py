"""
NEXI AI Chatbot - Portfolio Indexer

Script to generate embeddings for portfolio content and upload to Pinecone.
Run this once to set up the semantic search index.

Usage:
    python scripts/index_portfolio.py
    python scripts/index_portfolio.py --reset  # Clear and rebuild index
"""

import asyncio
import argparse
import json
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.settings import settings
from services.embeddings import (
    generate_embeddings_batch,
    upsert_vectors,
    delete_namespace,
    get_index_stats,
)

# =============================================================================
# Portfolio Chunking
# =============================================================================

def load_portfolio() -> dict:
    """Load portfolio data from JSON file."""
    data_path = Path(__file__).parent.parent / "data" / "portfolio.json"
    
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)


def create_chunks(portfolio: dict) -> list[dict]:
    """
    Create searchable chunks from portfolio data.
    
    Each chunk has:
    - id: Unique identifier
    - content: Text content for embedding
    - metadata: Additional info for filtering/display
    """
    chunks = []
    
    # 1. Owner bio chunk
    owner = portfolio["owner"]
    chunks.append({
        "id": "owner-bio",
        "content": f"""About {owner['name']}: {owner['bio']}
Title: {owner['title']}
Location: {owner['location']}""",
        "metadata": {
            "type": "bio",
            "source": "owner",
            "name": owner["name"],
        }
    })
    
    # 2. Project chunks (one per project with full details)
    for project in portfolio["projects"]:
        # Main project chunk
        highlights = "\n".join(f"- {h}" for h in project["highlights"])
        features = "\n".join(f"- {f}" for f in project["features"])
        tech_stack = ", ".join(project["techStack"])
        
        content = f"""Project: {project['name']}
Type: {project['type']}
Year: {project['year']}
Role: {project['role']}

Description: {project['description']}

Tech Stack: {tech_stack}

Key Highlights:
{highlights}

Features:
{features}"""
        
        chunks.append({
            "id": f"project-{project['slug']}",
            "content": content,
            "metadata": {
                "type": "project",
                "source": f"project:{project['slug']}",
                "name": project["name"],
                "slug": project["slug"],
                "year": project["year"],
                "tech_stack": tech_stack,
            }
        })
        
        # Tech stack specific chunk (for "what technologies" questions)
        chunks.append({
            "id": f"project-tech-{project['slug']}",
            "content": f"""Technologies used in {project['name']}:
{tech_stack}

This {project['type']} project was built using these technologies for {project['description'][:200]}""",
            "metadata": {
                "type": "tech_stack",
                "source": f"project:{project['slug']}",
                "name": project["name"],
                "slug": project["slug"],
            }
        })
    
    # 3. Skills chunks (by category)
    skills = portfolio["skills"]
    
    # Combined skills overview
    all_skills = []
    for category, skill_list in skills.items():
        all_skills.extend(skill_list)
    
    chunks.append({
        "id": "skills-overview",
        "content": f"""Technical Skills Overview:

Frontend: {', '.join(skills['frontend'])}
Backend: {', '.join(skills['backend'])}
Cloud & DevOps: {', '.join(skills['cloud'])}
Integrations: {', '.join(skills['integrations'])}
Best Practices: {', '.join(skills['practices'])}

Total skills: {len(all_skills)} technologies and practices.""",
        "metadata": {
            "type": "skills",
            "source": "skills:overview",
            "categories": list(skills.keys()),
        }
    })
    
    # Individual category chunks
    skill_descriptions = {
        "frontend": "Frontend development technologies including frameworks, libraries, and styling tools",
        "backend": "Backend development technologies including servers, databases, and real-time systems",
        "cloud": "Cloud platforms, deployment tools, and DevOps infrastructure",
        "integrations": "Third-party API integrations and external service connections",
        "practices": "Development practices, methodologies, and architectural approaches",
    }
    
    for category, skill_list in skills.items():
        chunks.append({
            "id": f"skills-{category}",
            "content": f"""{category.title()} Skills:
{', '.join(skill_list)}

{skill_descriptions.get(category, '')}""",
            "metadata": {
                "type": "skills",
                "source": f"skills:{category}",
                "category": category,
            }
        })
    
    # 4. Quick facts chunk
    quick_facts = portfolio["quickFacts"]
    facts_text = "\n".join(f"- {fact}" for fact in quick_facts)
    
    chunks.append({
        "id": "quick-facts",
        "content": f"""Quick Facts about {owner['name']}:
{facts_text}""",
        "metadata": {
            "type": "facts",
            "source": "quick_facts",
        }
    })
    
    # 5. Contact information chunk
    contact = portfolio["contact"]
    chunks.append({
        "id": "contact-info",
        "content": f"""Contact Information:
Email: {contact['email']}
GitHub: {contact['github']}
LinkedIn: {contact['linkedin']}

{contact['cta']}

For hiring inquiries, collaboration opportunities, or project discussions, 
please reach out via email or connect on LinkedIn.""",
        "metadata": {
            "type": "contact",
            "source": "contact",
            "email": contact["email"],
            "github": contact["github"],
            "linkedin": contact["linkedin"],
        }
    })
    
    return chunks


# =============================================================================
# Main Indexing Function
# =============================================================================

async def index_portfolio(reset: bool = False):
    """
    Index portfolio content into Pinecone.
    
    Args:
        reset: If True, delete existing index before rebuilding.
    """
    print("=" * 60)
    print("NEXI Portfolio Indexer")
    print("=" * 60)
    
    # Check configuration
    if not settings.is_embedding_configured():
        print("ERROR: OpenAI API key not configured")
        print("Please set OPENAI_API_KEY in .env file")
        return False
    
    if not settings.is_pinecone_configured():
        print("ERROR: Pinecone API key not configured")
        print("Please set PINECONE_API_KEY in .env file")
        return False
    
    print(f"Embedding model: {settings.embedding_model}")
    print(f"Pinecone index: {settings.pinecone_index_name}")
    print()
    
    # Reset if requested
    if reset:
        print("Resetting index (deleting existing vectors)...")
        try:
            await delete_namespace("portfolio")
            print("Index cleared.")
        except Exception as e:
            print(f"Warning: Could not clear index: {e}")
    
    # Load portfolio
    print("Loading portfolio data...")
    portfolio = load_portfolio()
    print(f"  Owner: {portfolio['owner']['name']}")
    print(f"  Projects: {len(portfolio['projects'])}")
    print(f"  Skill categories: {len(portfolio['skills'])}")
    print()
    
    # Create chunks
    print("Creating chunks...")
    chunks = create_chunks(portfolio)
    print(f"  Created {len(chunks)} chunks")
    print()
    
    # Display chunks summary
    print("Chunk types:")
    chunk_types = {}
    for chunk in chunks:
        chunk_type = chunk["metadata"]["type"]
        chunk_types[chunk_type] = chunk_types.get(chunk_type, 0) + 1
    for chunk_type, count in sorted(chunk_types.items()):
        print(f"  - {chunk_type}: {count}")
    print()
    
    # Generate embeddings
    print("Generating embeddings...")
    texts = [chunk["content"] for chunk in chunks]
    embeddings = await generate_embeddings_batch(texts)
    print(f"  Generated {len(embeddings)} embeddings")
    print(f"  Embedding dimension: {len(embeddings[0])}")
    print()
    
    # Prepare vectors for Pinecone
    vectors = []
    for chunk, embedding in zip(chunks, embeddings):
        vectors.append({
            "id": chunk["id"],
            "values": embedding,
            "metadata": {
                **chunk["metadata"],
                "content": chunk["content"][:1000],  # Store truncated content in metadata
            }
        })
    
    # Upsert to Pinecone
    print("Uploading to Pinecone...")
    count = await upsert_vectors(vectors, namespace="portfolio")
    print(f"  Uploaded {count} vectors")
    print()
    
    # Get final stats
    print("Index statistics:")
    stats = await get_index_stats()
    print(f"  Total vectors: {stats.get('total_vector_count', 'N/A')}")
    if "namespaces" in stats:
        for ns, ns_stats in stats["namespaces"].items():
            print(f"  Namespace '{ns}': {ns_stats.get('vector_count', 'N/A')} vectors")
    
    print()
    print("=" * 60)
    print("Portfolio indexing complete!")
    print("=" * 60)
    
    return True


# =============================================================================
# CLI Entry Point
# =============================================================================

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Index portfolio content for semantic search"
    )
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Clear existing index before rebuilding"
    )
    
    args = parser.parse_args()
    
    asyncio.run(index_portfolio(reset=args.reset))
