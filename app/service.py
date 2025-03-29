from typing import Dict, List
from app.models import AddToCart, CheckoutRequest, CheckoutResponse, DiscountCodeResponse, StatsResponse
from app.utils import generate_discount_code
from app import store

def add_item_to_cart_service(item: AddToCart):
    if item.item_id in store.cart:
        store.cart[item.item_id].quantity += item.quantity
    else:
        store.cart[item.item_id] = item
    return {"message": f"{item.quantity} x {item.name} added to cart"}

def process_checkout_service(checkout_request: CheckoutRequest = None):
    total_amount = sum(item.price * item.quantity for item in store.cart.values())
    discount_applied = False
    new_discount_code = None
    discount_amount = 0.0

    if checkout_request and checkout_request.discount_code:
        discount_code = checkout_request.discount_code.upper()
        if discount_code in store.discount_codes and not store.discount_codes[discount_code]["used"]:
            discount_amount = total_amount * 0.1
            total_amount -= discount_amount
            store.discount_codes[discount_code]["used"] = True
            discount_applied = True
        else:
            raise ValueError("Invalid or used discount code")

    store.order_count += 1
    store.purchase_history.append({
        "items": list(store.cart.values()),
        "total_amount": total_amount + discount_amount,  # Store original total before discount
        "discount_applied": discount_applied,
        "discount_code": checkout_request.discount_code if checkout_request else None,
        "discount_amount": discount_amount
    })

    if store.order_count % store.n_for_discount == 0:
        new_code = generate_discount_code()
        store.discount_codes[new_code] = {"used": False}
        new_discount_code = new_code

    store.cart.clear()
    return CheckoutResponse(total_amount=total_amount, discount_applied=discount_applied, new_discount_code=new_discount_code)

def generate_discount_code_admin_service():
    if store.order_count % store.n_for_discount == 0:
        new_code = generate_discount_code()
        store.discount_codes[new_code] = {"used": False}
        return DiscountCodeResponse(code=new_code)
    else:
        return {"message": f"No discount code generated. Next discount available after {store.n_for_discount - (store.order_count % store.n_for_discount)} more orders."}

def get_store_stats_service():
    total_items_purchased = sum(item.quantity for order in store.purchase_history for item in order["items"])
    total_purchase_amount = sum(order["total_amount"] for order in store.purchase_history)
    active_discount_codes = [code for code, status in store.discount_codes.items()]
    total_discount_amount = sum(order["discount_amount"] for order in store.purchase_history)
    return StatsResponse(
        total_items_purchased=total_items_purchased,
        total_purchase_amount=total_purchase_amount,
        discount_codes=active_discount_codes,
        total_discount_amount=total_discount_amount
    )