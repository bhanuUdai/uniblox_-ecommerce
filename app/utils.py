import uuid

def generate_discount_code():
    return f"CODE-{uuid.uuid4().hex[:8].upper()}"