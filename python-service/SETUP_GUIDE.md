# NEXI AI Chatbot - Python Service Setup Guide

A comprehensive guide to set up and run the NEXI AI Python service with semantic search, caching, A/B testing, and cost monitoring.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running the Service](#running-the-service)
6. [Semantic Search Setup](#semantic-search-setup)
7. [API Endpoints](#api-endpoints)
8. [Admin Endpoints](#admin-endpoints)
9. [Troubleshooting](#troubleshooting)
10. [Architecture](#architecture)

---

## Overview

The Python service is a **FastAPI application** that provides:

- **SSE Streaming**: Real-time token-by-token chat responses
- **Multi-Provider AI**: Supports OpenAI and Groq for chat completions
- **Semantic Search**: Pinecone vector database for context-aware responses
- **Response Caching**: In-memory caching for frequent queries
- **A/B Testing**: Experiment with different prompt variations
- **Cost Monitoring**: Track LLM token usage and costs
- **Error Tracking**: Optional Sentry integration

### Version

Current version: **4.0.0** (Phase 4 Complete)

---

## Prerequisites

### Required Software

| Software | Minimum Version | Check Command |
|----------|-----------------|---------------|
| Python | 3.10+ | `python --version` |
| pip | Latest | `pip --version` |

### Required API Keys

| Service | Required | Purpose | Get Key |
|---------|----------|---------|---------|
| **Groq** | Yes (if using Groq) | Chat completions (FREE) | [console.groq.com/keys](https://console.groq.com/keys) |
| **OpenAI** | Yes (for embeddings) | Embeddings + Chat (optional) | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| **Pinecone** | Optional | Semantic search | [app.pinecone.io](https://app.pinecone.io/) |
| **Sentry** | Optional | Error tracking | [sentry.io](https://sentry.io/) |

> **Note**: Even if using Groq for chat, you need an OpenAI API key for generating embeddings (semantic search).

---

## Installation

### Step 1: Navigate to Python Service Directory

```bash
cd python-service
```

### Step 2: Create Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
python -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Verify Installation

```bash
python -c "import fastapi; import uvicorn; print('Dependencies OK!')"
```

---

## Configuration

### Step 1: Create Environment File

```bash
cp .env.example .env
```

### Step 2: Configure Required Variables

Open `.env` and set the following:

#### Minimal Configuration (Basic Chat)

```env
# Use Groq for FREE chat completions
AI_PROVIDER=groq
GROQ_API_KEY=gsk_your_groq_api_key_here

# Server settings
PORT=8000
HOST=0.0.0.0

# CORS (add your frontend URL)
CORS_ORIGINS=http://localhost:3000,http://localhost:3003
```

#### Full Configuration (With Semantic Search)

```env
# ===========================================
# AI Provider (Chat Completions)
# ===========================================
AI_PROVIDER=groq
GROQ_API_KEY=gsk_your_groq_api_key_here

# OpenAI key (REQUIRED for embeddings)
OPENAI_API_KEY=sk-your_openai_api_key_here

# ===========================================
# Server Configuration
# ===========================================
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:3000,http://localhost:3003

# ===========================================
# Pinecone (Semantic Search)
# ===========================================
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=nexi-portfolio
PINECONE_CLOUD=aws
PINECONE_REGION=us-east-1

# Enable semantic search
USE_SEMANTIC_SEARCH=true
SEMANTIC_SEARCH_TOP_K=3
SEMANTIC_SEARCH_THRESHOLD=0.7

# ===========================================
# Optional: Error Tracking
# ===========================================
SENTRY_DSN=https://your_sentry_dsn_here
ENVIRONMENT=development

# ===========================================
# Optional: A/B Testing & Cost Monitoring
# ===========================================
AB_TESTING_ENABLED=true
TRACK_TOKEN_COSTS=true
```

### Environment Variables Reference

#### Server Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8000` | Server port |
| `HOST` | `0.0.0.0` | Server host |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated allowed origins |

#### AI Provider Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_PROVIDER` | `groq` | `openai` or `groq` |
| `GROQ_API_KEY` | - | Groq API key (required if using Groq) |
| `OPENAI_API_KEY` | - | OpenAI API key (required for embeddings) |
| `AI_MODEL` | Provider default | Model override |
| `AI_MAX_TOKENS` | `500` | Max response tokens |
| `AI_TEMPERATURE` | `0.7` | Response creativity (0.0-1.0) |

**Default Models:**
- Groq: `llama-3.1-8b-instant`
- OpenAI: `gpt-4o-mini`

#### Semantic Search Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `PINECONE_API_KEY` | - | Pinecone API key |
| `PINECONE_INDEX_NAME` | `nexi-portfolio` | Index name |
| `PINECONE_CLOUD` | `aws` | Cloud provider |
| `PINECONE_REGION` | `us-east-1` | Region |
| `USE_SEMANTIC_SEARCH` | `true` | Enable/disable semantic search |
| `SEMANTIC_SEARCH_TOP_K` | `3` | Number of results to retrieve |
| `SEMANTIC_SEARCH_THRESHOLD` | `0.7` | Similarity threshold (0.0-1.0) |
| `EMBEDDING_MODEL` | `text-embedding-3-small` | OpenAI embedding model |

#### Monitoring Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `SENTRY_DSN` | - | Sentry DSN for error tracking |
| `ENVIRONMENT` | `development` | Environment name |
| `AB_TESTING_ENABLED` | `true` | Enable A/B testing |
| `TRACK_TOKEN_COSTS` | `true` | Enable cost monitoring |

---

## Running the Service

### Development Mode (with auto-reload)

```bash
# Make sure virtual environment is activated
uvicorn main:app --reload --port 8000
```

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Alternative: Run with Python

```bash
python main.py
```

### Verify Service is Running

Open browser or use curl:

```bash
# Health check
curl http://localhost:8000/health

# API docs
open http://localhost:8000/docs
```

### Expected Startup Logs

```
==================================================
NEXI AI Service Starting...
Provider: groq
Model: llama-3.1-8b-instant
Configured: True
==================================================
--------------------------------------------------
Semantic Search Status:
  Pinecone configured: True
  Embeddings configured: True
  Semantic search enabled: True
  Ready: True
  Index vectors: 15
--------------------------------------------------
Response Cache Status:
  Cache initialized: max_size=100
  Caching enabled: True
--------------------------------------------------
Error Tracking Status:
  Sentry configured: False
  Sentry initialized: False
  Environment: development
--------------------------------------------------
A/B Testing Status:
  A/B testing enabled: True
  Active tests: 1
    - response_style: 2 variants
--------------------------------------------------
Cost Monitoring Status:
  Token cost tracking: True
  Daily budget: $10.00
==================================================
```

---

## Semantic Search Setup

Semantic search improves response quality by finding relevant context for each query.

### Step 1: Ensure Configuration

Make sure these are set in `.env`:

```env
OPENAI_API_KEY=sk-your_key_here
PINECONE_API_KEY=your_pinecone_key_here
PINECONE_INDEX_NAME=nexi-portfolio
USE_SEMANTIC_SEARCH=true
```

### Step 2: Create Pinecone Index

1. Go to [app.pinecone.io](https://app.pinecone.io/)
2. Create a new index with:
   - **Name**: `nexi-portfolio`
   - **Dimensions**: `1536`
   - **Metric**: `cosine`
   - **Cloud**: AWS
   - **Region**: us-east-1

### Step 3: Update Portfolio Data

Edit `data/portfolio.json` with your information:

```json
{
  "owner": {
    "name": "Your Name",
    "title": "Your Title",
    "bio": "Your bio...",
    "location": "Your location"
  },
  "projects": [...],
  "skills": {...},
  "contact": {...},
  "quickFacts": [...]
}
```

### Step 4: Index Portfolio

Run the indexer script:

```bash
# First time or update
python scripts/index_portfolio.py

# Reset and rebuild (clears existing data)
python scripts/index_portfolio.py --reset
```

**Expected Output:**

```
============================================================
NEXI Portfolio Indexer
============================================================
Embedding model: text-embedding-3-small
Pinecone index: nexi-portfolio

Loading portfolio data...
  Owner: Your Name
  Projects: 3
  Skill categories: 5

Creating chunks...
  Created 15 chunks

Chunk types:
  - bio: 1
  - contact: 1
  - facts: 1
  - project: 3
  - skills: 6
  - tech_stack: 3

Generating embeddings...
  Generated 15 embeddings
  Embedding dimension: 1536

Uploading to Pinecone...
  Uploaded 15 vectors

Index statistics:
  Total vectors: 15
  Namespace 'portfolio': 15 vectors

============================================================
Portfolio indexing complete!
============================================================
```

### Step 5: Verify Semantic Search

```bash
curl http://localhost:8000/health | jq '.semantic_search'
```

Should return:
```json
{
  "enabled": true,
  "ready": true,
  "pinecone_configured": true,
  "embedding_configured": true,
  "index_name": "nexi-portfolio",
  "index_stats": {
    "total_vector_count": 15
  }
}
```

---

## API Endpoints

### Health Check

```
GET /health
```

Returns service status, provider config, and all subsystem statuses.

### Chat Completion (SSE Streaming)

```
POST /chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Tell me about your projects" }
  ],
  "session_id": "optional-session-id"
}
```

**Response:** Server-Sent Events stream

```
event: message
data: {"type": "content", "content": "I've "}

event: message
data: {"type": "content", "content": "built "}

...

event: message
data: {"type": "done"}
```

### Service Metrics

```
GET /metrics
```

Returns detailed service metrics including request counts, response times, and cache stats.

### API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Admin Endpoints

### Chat Logs

```
GET /admin/logs?limit=50
```

Returns recent chat interactions for review.

### Cache Management

```
GET /admin/cache         # View cache stats and entries
POST /admin/cache/clear  # Clear all cached responses
```

### A/B Testing

```
GET /admin/ab-tests                              # Get test configuration
POST /admin/ab-tests/feedback?session_id=...    # Record feedback
```

### Cost Monitoring

```
GET /admin/costs               # Detailed cost metrics
GET /admin/costs/summary?hours=24  # Cost summary for period
```

### Error Tracking

```
GET /admin/errors              # Error tracking status
```

---

## Troubleshooting

### Issue: "AI provider not configured"

**Solution:** Check your API key in `.env`:

```bash
# For Groq
echo $GROQ_API_KEY  # Should not be empty

# For OpenAI
echo $OPENAI_API_KEY  # Should not be empty
```

### Issue: "Semantic search not ready"

**Solutions:**

1. Ensure OpenAI API key is set (even when using Groq for chat)
2. Ensure Pinecone API key is set
3. Run the indexer: `python scripts/index_portfolio.py`
4. Check index has vectors: `curl http://localhost:8000/health | jq '.semantic_search.index_stats'`

### Issue: "Index is empty"

**Solution:** Run the portfolio indexer:

```bash
python scripts/index_portfolio.py --reset
```

### Issue: CORS Errors

**Solution:** Add your frontend URL to CORS_ORIGINS:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3003,https://your-domain.com
```

### Issue: Module not found errors

**Solution:** Ensure virtual environment is activated and dependencies installed:

```bash
# Activate venv
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate      # macOS/Linux

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: Port already in use

**Solution:** Either stop the other process or use a different port:

```bash
uvicorn main:app --reload --port 8001
```

### View Logs

The service logs to stdout. Look for:

```
INFO:nexi:Chat request: 1 messages, session=...
INFO:nexi:Semantic search: 3 docs retrieved for '...'
INFO:nexi:Cache hit for query: ...
```

---

## Architecture

```
python-service/
├── main.py                 # FastAPI application & endpoints
├── requirements.txt        # Python dependencies
├── .env.example           # Environment template
├── .env                   # Your configuration (gitignored)
│
├── config/
│   ├── __init__.py
│   ├── settings.py        # Pydantic settings management
│   └── prompts.py         # System prompts & templates
│
├── models/
│   ├── __init__.py
│   └── schemas.py         # Pydantic request/response models
│
├── services/
│   ├── __init__.py
│   ├── llm.py             # LLM provider (OpenAI/Groq)
│   ├── context.py         # Portfolio context loader
│   ├── embeddings.py      # Vector embeddings & Pinecone
│   ├── cache.py           # Response caching
│   ├── ab_testing.py      # A/B test management
│   ├── cost_monitor.py    # Token cost tracking
│   └── error_tracking.py  # Sentry integration
│
├── scripts/
│   ├── __init__.py
│   └── index_portfolio.py # Portfolio indexer script
│
└── data/
    └── portfolio.json     # Portfolio knowledge base
```

### Request Flow

```
Frontend Request
       ↓
POST /chat
       ↓
┌──────────────────────────────────────┐
│ 1. Validate request                  │
│ 2. Check cache for response          │
│    ├── HIT: Stream cached response   │
│    └── MISS: Continue                │
│ 3. Semantic search (if enabled)      │
│    └── Find relevant portfolio chunks│
│ 4. Build system prompt               │
│    └── Include retrieved context     │
│ 5. Apply A/B test variations         │
│ 6. Stream LLM response               │
│ 7. Cache response                    │
│ 8. Record metrics & costs            │
└──────────────────────────────────────┘
       ↓
SSE Stream to Frontend
```

---

## Quick Reference Commands

```bash
# Navigate to service
cd python-service

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activate virtual environment (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --port 8000

# Run production server
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# Index portfolio (first time)
python scripts/index_portfolio.py

# Reset and reindex portfolio
python scripts/index_portfolio.py --reset

# Check health
curl http://localhost:8000/health

# View API docs
open http://localhost:8000/docs
```

---

## Next Steps

1. **Customize Portfolio**: Edit `data/portfolio.json` with your information
2. **Index Portfolio**: Run `python scripts/index_portfolio.py`
3. **Connect Frontend**: Update frontend `.env.local` to point to this service
4. **Set Up Monitoring**: Configure Sentry DSN for production error tracking
5. **Deploy**: Use Docker or deploy to cloud platform

---

## License

MIT
