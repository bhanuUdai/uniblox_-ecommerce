// src/components/Cart.jsx
import React from 'react';
import { ListGroup, Button, Form } from 'react-bootstrap';
import CartItem from './CartItem';
function Cart({ cartItems, onRemoveFromCart, discountCode, setDiscountCode, onCheckout, total }) {
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
        </ListGroup>
      )}
      <Form.Control
        type="text"
        placeholder="Enter Discount Code"
        value={discountCode}
        onChange={(e) => setDiscountCode(e.target.value)}
        className="mb-2"
      />
      <Button variant="success" onClick={onCheckout} disabled={cartItems.length === 0} className="w-100 mb-2">
        Checkout
      </Button>
    </div>
  );
}

export default Cart;