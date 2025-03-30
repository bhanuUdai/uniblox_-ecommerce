from typing import Dict, List
from app.models import AddToCart

cart: Dict[int, AddToCart] = {}
order_count: int = 0
discount_codes: Dict[str, Dict[str, bool]] = {}
purchase_history: List[Dict] = []
n_for_discount: int = 5  # Every 5th order gets a discount