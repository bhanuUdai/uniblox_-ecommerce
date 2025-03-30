// src/App.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect if you want to see count update immediately on add
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Offcanvas } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { addToCart, checkout } from './services/apiService';
import ProductList from './components/ProductList';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastMessage from './components/ToastMessage';
import Cart from './components/Cart';

const products = [
  { id: 1, name: 'Awesome T-Shirt', price: 25.99 },
  { id: 2, name: 'Cool Coffee Mug', price: 12.50 },
  { id: 3, name: 'Stylish Backpack', price: 49.99 },
  { id: 4, name: 'Gaming Mouse', price: 35.00 },
  { id: 5, name: 'Wireless Keyboard', price: 59.99 },
];

function App() {
  const [cart, setCart] = useState([]);
  const [discountCode, setDiscountCode] = useState('');
  const [checkoutToast, setCheckoutToast] = useState({ show: false, message: '', variant: 'success' });
  const [newCoupon, setNewCoupon] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [cartCount, setCartCount] = useState(0); // New state for cart count

  useEffect(() => {
    const totalItems = cart.reduce((count, item) => count + item.quantity, 0);
    setCartCount(totalItems);
  }, [cart]);

  const handleAddToCart = async (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, cartItemId: uuidv4(), quantity: 1 }]);
    }

    try {
      await addToCart({
        item_id: product.id,
        quantity: 1,
        name: product.name,
        price: product.price,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleRemoveFromCart = (cartItemId) => {
    setCart(cart.filter(item => item.cartItemId !== cartItemId));
  };

  const handleCheckout = async () => {
    console.log('Checkout initiated');
    try {
      const responseData = await checkout(discountCode);
      console.log('Checkout successful, response:', responseData);
      console.log('Before setCheckoutToast (success):', checkoutToast);
      setCheckoutToast({ show: true, message: `Checkout successful! Total: $${responseData.total_amount.toFixed(2)}`, variant: 'success' });
      console.log('After setCheckoutToast (success):', checkoutToast);
      setCart([]);
      setNewCoupon(responseData.new_discount_code || '');
      setDiscountCode('');
      setShowCart(false);
    } catch (error) {
      console.error('Checkout failed, error:', error);
      console.log('Before setCheckoutToast (error):', checkoutToast);
      setCheckoutToast({ show: true, message: `Checkout failed: ${error.response?.data?.detail || error.message || 'Something went wrong'}`, variant: 'danger' });
      console.log('After setCheckoutToast (error):', checkoutToast);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCloseCart = () => setShowCart(false);
  const handleShowCart = () => setShowCart(true);

  const headerHeight = '100px';
  const footerHeight = '75px';

  return (
    <div>
      <Header onCartClick={handleShowCart} cartCount={cartCount} /> {/* Pass cartCount prop */}
      <Container style={{ height: `calc(100vh - ${headerHeight} - ${footerHeight})` }}>
        <Row>
          <Col md={12}>
            <ProductList products={products} onAddToCart={handleAddToCart} />
          </Col>
        </Row>
      </Container>
        <ToastMessage
        show={checkoutToast.show}
        onClose={() => setCheckoutToast({ ...checkoutToast, show: false })}
        message={checkoutToast.message}
        variant={checkoutToast.variant}
      />
      <Footer />

      <Offcanvas show={showCart} onHide={handleCloseCart} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Cart
            cartItems={cart}
            onRemoveFromCart={handleRemoveFromCart}
            discountCode={discountCode}
            setDiscountCode={setDiscountCode}
            onCheckout={handleCheckout}
            total={calculateTotal()}
          />
          {newCoupon && (
            <div className="mt-3 alert alert-info">
              Your coupon code: <strong>{newCoupon}</strong>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <ToastMessage
        show={checkoutToast.show}
        onClose={() => setCheckoutToast({ ...checkoutToast, show: false })}
        message={checkoutToast.message}
        variant={checkoutToast.variant}
      />
    </div>
  );
}

export default App;