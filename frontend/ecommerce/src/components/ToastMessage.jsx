// src/components/ToastMessage.jsx
import React from 'react';
import Toast from 'react-bootstrap/Toast';

function ToastMessage({ show, onClose, message, variant }) {
  return (
    <Toast show={show} onClose={onClose} delay={3000} autohide className="mt-3">
      <Toast.Header>
        <strong className="me-auto">Checkout Status</strong>
      </Toast.Header>
      <Toast.Body className={`bg-${variant} text-white`}>
        {message}
      </Toast.Body>
    </Toast>
  );
}

export default ToastMessage;