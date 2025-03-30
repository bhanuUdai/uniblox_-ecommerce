// src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const addToCart = async (item) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/add`, item);
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const checkout = async (discountCode) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/checkout`, { discount_code: discountCode });
    return response.data;
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
};