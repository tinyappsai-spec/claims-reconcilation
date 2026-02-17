from fastapi import APIRouter
from app.routes.upload import get_service

router = APIRouter()

@router.get("/summary")
async def get_summary():
    service = get_service()
    analytics = service.get_analytics()
    return analytics if analytics else {"detail": "No results cached. Please upload data first."}
