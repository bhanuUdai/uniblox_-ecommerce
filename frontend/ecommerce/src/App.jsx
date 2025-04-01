import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Offcanvas } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { addToCart, checkout, getAvailableDiscounts } from './services/apiService';
import ProductList from './components/ProductList';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastMessage from './components/ToastMessage';
import Cart from './components/Cart';

const products = [
  { id: 1, name: 'Awesome T-Shirt', price: 25.99, url : "https://images.unsplash.com/photo-1630643003427-c45e438acbe3?q=80&w=2018&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 2, name: 'Cool Coffee Mug', price: 12.50, url : "https://images.unsplash.com/photo-1680337673561-531bca1cf5b7?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 3, name: 'Stylish Backpack', price: 49.99, url : "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 4, name: 'Gaming Mouse', price: 35.00, url : "https://images.unsplash.com/photo-1613141412501-9012977f1969?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 5, name: 'Wireless Keyboard', price: 59.99,  url : "https://images.unsplash.com/photo-1679533662330-457ca8447e7d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

function App() {
  const [cart, setCart] = useState([]);
  const [discountCode, setDiscountCode] = useState('');
  const [checkoutToast, setCheckoutToast] = useState({ show: false, message: '', variant: 'success' });
  const [showCart, setShowCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {
    const totalItems = cart.reduce((count, item) => count + item.quantity, 0);
    setCartCount(totalItems);
  }, [cart]);

  const fetchAvailableCoupons = async () => {
    try {
      const data = await getAvailableDiscounts();
      setAvailableCoupons(data.available_discount_codes);
    } catch (error) {
      console.error('Error fetching available coupons:', error);
    }
  };

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
    try {
      const responseData = await checkout(discountCode);
      setCheckoutToast({ show: true, message: `Checkout successful! Total: $${responseData.total_amount.toFixed(2)}`, variant: 'success' });
      setCart([]);
      setDiscountCode('');
      setShowCart(false);
      fetchAvailableCoupons(); // Refresh the coupon list after checkout
    } catch (error) {
      setCheckoutToast({ show: true, message: `Checkout failed: ${error.response?.data?.detail || error.message || 'Something went wrong'}`, variant: 'danger' });
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCloseCart = () => setShowCart(false);
  const handleShowCart = () => {
    setShowCart(true);
    fetchAvailableCoupons(); // Fetch coupons when cart is opened
  };

  const headerHeight = '56px';
  const footerHeight = '110px';

  return (
    <div>
      <Header onCartClick={handleShowCart} cartCount={cartCount} />
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
            availableCoupons={availableCoupons} // Pass available coupons to Cart
          />
          {/* No need to show new coupon separately here */}
        </Offcanvas.Body>
      </Offcanvas>

   
    </div>
  );
}

export default App;