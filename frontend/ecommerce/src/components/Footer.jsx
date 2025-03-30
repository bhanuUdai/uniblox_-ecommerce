// src/components/Footer.jsx
import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-light py-3 mt-4 text-center position-relative " style={{ bottom: 0, width: '100%' }}>
      <Container>
        <p>&copy; {new Date().getFullYear()} E-commerce Store. All rights reserved.</p>
      </Container>
    </footer>
  );
}

export default Footer;