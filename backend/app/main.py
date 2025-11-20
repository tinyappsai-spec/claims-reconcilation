from fastapi import FastAPI
from app.routes import upload, reconciliation, summary
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.logger import get_logger


app = FastAPI(title="Claims Reconciliation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api")
app.include_router(reconciliation.router, prefix="/api")
app.include_router(summary.router, prefix="/api")

@app.get("/health", summary="Health check")
async def health():
    """
    Simple endpoint to verify the service is running.
    """
    return {"status": "ok"}