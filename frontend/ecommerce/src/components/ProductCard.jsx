import React from 'react';
import { Card, Button } from 'react-bootstrap';

function ProductCard({ product, onAddToCart }) {
  return (
    <Card className="mb-4">
      <Card.Img
        variant="top"
        src={product?.url}
        alt="product"
        style={{ objectFit: 'cover', height: '200px', width: '100%' }}
      />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">${product.price.toFixed(2)}</Card.Subtitle>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between align-items-center">
        <Button
          variant="primary"
          onClick={() => onAddToCart(product)}
          style={{ width: '100%' }}
        >
          Add to Cart
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default ProductCard;
