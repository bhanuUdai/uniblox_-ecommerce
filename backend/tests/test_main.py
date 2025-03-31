from fastapi.testclient import TestClient
from app.main import app
from app import store
from app.models import AddToCart  # Import AddToCart

client = TestClient(app)

def test_add_to_cart():
    store.cart.clear()
    response = client.post(
        "/cart/add",
        json={"item_id": 1, "quantity": 2, "name": "Test Item", "price": 10.0},
    )
    assert response.status_code == 200
    assert response.json() == {"message": "2 x Test Item added to cart"}
    assert store.cart[1].quantity == 2

def test_checkout_no_discount():
    store.cart.clear()
    store.purchase_history.clear()
    store.order_count = 0
    # Add an item to the cart first
    client.post(
        "/cart/add",
        json={"item_id": 1, "quantity": 1, "name": "Test Item", "price": 20.0},
    )
    response = client.post("/checkout")
    assert response.status_code == 200
    assert response.json()["total_amount"] == 20.0
    assert not response.json()["discount_applied"]
    assert len(store.cart) == 0
    assert len(store.purchase_history) == 1
    assert store.order_count == 1

def test_checkout_with_valid_discount():
    store.cart.clear()
    store.purchase_history.clear()
    store.discount_codes.clear()
    store.order_count = 0
    # Simulate generating a discount code
    store.discount_codes["TESTCODE"] = {"used": False}
    # Add an item to the cart
    client.post(
        "/cart/add",
        json={"item_id": 2, "quantity": 1, "name": "Another Item", "price": 50.0},
    )
    response = client.post("/checkout", json={"discount_code": "TESTCODE"})
    assert response.status_code == 200
    assert response.json()["total_amount"] == 45.0
    assert response.json()["discount_applied"]
    assert store.discount_codes["TESTCODE"]["used"] is True
    assert len(store.cart) == 0
    assert len(store.purchase_history) == 1
    assert store.order_count == 1

def test_checkout_with_invalid_discount():
    store.cart.clear()
    # Add an item to the cart
    client.post(
        "/cart/add",
        json={"item_id": 3, "quantity": 1, "name": "Yet Another Item", "price": 30.0},
    )
    response = client.post("/checkout", json={"discount_code": "INVALIDCODE"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid or used discount code"}
    store.cart.clear()  # Explicitly clear the cart after the checkout attempt
    assert len(store.cart) == 0

def test_generate_discount_on_nth_order():
    store.discount_codes.clear()
    store.order_count = store.n_for_discount - 1
    # Perform a checkout to trigger the nth order
    client.post(
        "/cart/add",
        json={"item_id": 4, "quantity": 1, "name": "Final Item", "price": 100.0},
    )
    response = client.post("/checkout")
    assert response.status_code == 200
    assert response.json().get("new_discount_code") is not None
    assert len(store.discount_codes) == 1
    assert store.order_count == store.n_for_discount

def test_get_stats():
    store.cart.clear()
    store.purchase_history.clear()
    store.discount_codes.clear()
    store.order_count = 0
    # Perform some orders to populate stats
    client.post(
        "/cart/add",
        json={"item_id": 5, "quantity": 1, "name": "Stat Item 1", "price": 10.0},
    )
    client.post("/checkout")
    client.post(
        "/cart/add",
        json={"item_id": 6, "quantity": 2, "name": "Stat Item 2", "price": 5.0},
    )
    # Simulate a discounted order
    store.discount_codes["STATCODE"] = {"used": True}
    store.purchase_history.append({
        "items": [AddToCart(item_id=6, quantity=2, name="Stat Item 2", price=5.0)], # Use AddToCart
        "total_amount": 10.0,
        "discount_applied": True,
        "discount_code": "STATCODE",
        "discount_amount": 1.0
    })
    response = client.get("/admin/stats")
    assert response.status_code == 200
    stats = response.json()
    assert stats["total_items_purchased"] >= 3
    assert stats["total_purchase_amount"] >= 20.0
    assert "STATCODE" in stats["discount_codes"]
    assert stats["total_discount_amount"] >= 1.0

def test_get_available_discount_codes_service():
    # Set up test data in the in-memory store
    store.discount_codes.clear()
    store.discount_codes["UNUSED1"] = {"used": False}
    store.discount_codes["USED1"] = {"used": True}
    store.discount_codes["UNUSED2"] = {"used": False}
    store.discount_codes["USED2"] = {"used": True}

    # Call the service function directly
    from app.service import get_available_discount_codes_service
    result = get_available_discount_codes_service()

    # Assert the expected output
    assert isinstance(result, dict)
    assert "available_discount_codes" in result
    assert isinstance(result["available_discount_codes"], list)
    assert "UNUSED1" in result["available_discount_codes"]
    assert "UNUSED2" in result["available_discount_codes"]
    assert "USED1" not in result["available_discount_codes"]
    assert "USED2" not in result["available_discount_codes"]
    assert len(result["available_discount_codes"]) == 2