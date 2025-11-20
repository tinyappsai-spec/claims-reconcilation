from fastapi import APIRouter
from app.routes.upload import get_service

router = APIRouter()

@router.get("/summary")
async def get_summary():
    service = get_service()
    results = service.reconcile()
    return service.summary(results)
