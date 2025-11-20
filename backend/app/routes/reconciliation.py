from fastapi import APIRouter
from app.routes.upload import get_service

router = APIRouter()

@router.get("/reconciliation")
async def get_reconciliation():
    service = get_service()
    results = service.reconcile()
    return results
