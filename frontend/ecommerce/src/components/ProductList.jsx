// src/components/ProductList.jsx
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';

function ProductList({ products, onAddToCart }) {
  return (
    <div>
      <h2>Products</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {products.map(product => (
          <Col key={product.id}>
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ProductList;