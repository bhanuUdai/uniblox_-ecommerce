import React from 'react';
import { Card, Button } from 'react-bootstrap';

function ProductCard({ product, onAddToCart }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">${product.price.toFixed(2)}</Card.Subtitle>
        <Button variant="primary" onClick={() => onAddToCart(product)}>Add to Cart</Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;