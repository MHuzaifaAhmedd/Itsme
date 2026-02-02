# NEXI Python Service (FastAPI) - Production Dockerfile
# Platform: linux/amd64

FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.12-slim AS runner
WORKDIR /app
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
COPY . .
EXPOSE 8000
ENV PORT=8000
ENV HOST=0.0.0.0
# API keys, CORS_ORIGINS, etc. set at runtime
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
