from fastapi import APIRouter
from app.routes.upload import get_service

router = APIRouter()

@router.get("/reconciliation")
async def get_reconciliation(skip: int = 0, limit: int = 100):
    service = get_service()
    if not service.results_cache:
        # If cache is empty, try to reconcile (or return empty list if no data)
        if service.claims and service.invoices:
            service.reconcile()
        else:
            return []
    
    results = service.get_results(skip=skip, limit=limit)
    return {
        "data": results,
        "total": len(service.results_cache),
        "skip": skip,
        "limit": limit
    }
