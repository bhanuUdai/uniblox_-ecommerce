import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';

function CartItem({ item, onRemoveFromCart }) {
  return (
    <ListGroup.Item key={item.cartItemId} className="d-flex justify-content-between align-items-center">
      {item.name} ({item.quantity}) - ${item.price.toFixed(2)} each
      <Button variant="danger" size="sm" onClick={() => onRemoveFromCart(item.cartItemId)}>Remove</Button>
    </ListGroup.Item>
  );
}

export default CartItem;