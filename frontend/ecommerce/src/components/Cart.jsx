import React from 'react';
import { ListGroup, Button, Form } from 'react-bootstrap';
import CartItem from './CartItem';

function Cart({ cartItems, onRemoveFromCart, discountCode, setDiscountCode, onCheckout, total, availableCoupons }) {
  const calculateDiscountedTotal = () => {
    if (discountCode) {
      return (parseFloat(total) * 0.9).toFixed(2);
    }
    return total;
  };

  const discountedTotal = calculateDiscountedTotal();

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ListGroup className="mb-3">
          {cartItems.map(item => (
            <CartItem key={item.cartItemId} item={item} onRemoveFromCart={onRemoveFromCart} />
          ))}
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <strong>Total:</strong> ${total}
          </ListGroup.Item>
          {discountCode && (
            <>
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <strong className="text-success">Discount (10%):</strong> - ${(parseFloat(total) * 0.1).toFixed(2)}
            </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <strong>Discounted Total:</strong> ${discountedTotal}
          </ListGroup.Item>
          </>
          )}
        </ListGroup>
      )}
      {availableCoupons && availableCoupons?.length > 0 && <Form.Group className="mb-3">
        <Form.Label>Apply Coupon Code</Form.Label>
        <Form.Select
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
        >
          <option value="">Select a coupon code</option>
          {availableCoupons.map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </Form.Select>
      </Form.Group>}
      <Button variant="success" onClick={onCheckout} disabled={cartItems.length === 0} className="w-100 mb-2">
        Checkout
      </Button>
    </div>
  );
}

export default Cart;