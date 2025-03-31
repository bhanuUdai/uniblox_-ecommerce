from fastapi import APIRouter, HTTPException
from app.models import AddToCart, CheckoutRequest, CheckoutResponse, DiscountCodeResponse, StatsResponse
from app.service import (
    add_item_to_cart_service,
    process_checkout_service,
    generate_discount_code_admin_service,
    get_store_stats_service,
    get_available_discount_codes_service,  # Import the new service function
)

router = APIRouter()

@router.post("/cart/add")
async def add_to_cart(item: AddToCart):
    return add_item_to_cart_service(item)

@router.post("/checkout")
async def checkout(checkout_request: CheckoutRequest = None):
    try:
        return process_checkout_service(checkout_request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/admin/discount/generate")
async def generate_discount():
    return generate_discount_code_admin_service()

@router.get("/admin/stats")
async def get_stats():
    return get_store_stats_service()

@router.get("/admin/discount/available")
async def get_available_discounts():
    return get_available_discount_codes_service()