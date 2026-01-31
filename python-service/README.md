# NEXI AI Chatbot - Python Service

FastAPI-based AI service for the NEXI portfolio chatbot with SSE streaming support.

## Features

- **SSE Streaming**: Real-time token-by-token responses
- **Multi-Provider**: Supports OpenAI and Groq APIs
- **Portfolio Context**: Loads portfolio data for contextual responses
- **CORS Enabled**: Ready for frontend integration

## Quick Start

### 1. Create Virtual Environment

```bash
cd python-service
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 4. Run Development Server

```bash
uvicorn main:app --reload --port 8000
```

The service will be available at `http://localhost:8000`

## API Endpoints

### Health Check

```
GET /health
```

Returns service status and provider configuration.

### Chat Completion (Streaming)

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

Returns Server-Sent Events stream with tokens.

### API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AI_PROVIDER` | Yes | `groq` | AI provider (`openai` or `groq`) |
| `GROQ_API_KEY` | If using Groq | - | Groq API key |
| `OPENAI_API_KEY` | If using OpenAI | - | OpenAI API key |
| `AI_MODEL` | No | Provider default | Model to use |
| `AI_MAX_TOKENS` | No | `500` | Max response tokens |
| `AI_TEMPERATURE` | No | `0.7` | Response creativity |
| `PORT` | No | `8000` | Server port |
| `CORS_ORIGINS` | No | `http://localhost:3000` | Allowed origins |

## Development

### Running with Auto-Reload

```bash
uvicorn main:app --reload --port 8000
```

### Running Tests

```bash
pytest
```

## Architecture

```
python-service/
├── main.py           # FastAPI application
├── services/
│   ├── llm.py        # LLM provider integration
│   ├── context.py    # Portfolio context loader
│   └── embeddings.py # Future: vector operations
├── models/
│   └── schemas.py    # Pydantic models
├── config/
│   ├── settings.py   # Environment config
│   └── prompts.py    # System prompts
└── data/
    └── portfolio.json # Portfolio context
```

## Integration with Frontend

The Next.js frontend proxies chat requests to this service:

```
Frontend -> /api/chat (Next.js) -> /chat (Python) -> OpenAI/Groq
```

## License

MIT
