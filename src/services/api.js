// import axios from "axios";

// const BASE_URL = "http://127.0.0.1:8000/"; // Django backend URL

// export const getOrders = async () => {
//     const res = await axios.get(`${BASE_URL}/orders/`);
//     return res.data;
// };

// export const getUsers = async () => {
//     const res = await axios.get(`${BASE_URL}/users/`);
//     return res.data;
// };

// export const getProducts = async () => {
//     const res = await axios.get(`${BASE_URL}/products/`);
//     return res.data;
// };

// export const getReviews = async () => {
//     const res = await axios.get(`${BASE_URL}/reviews/`);
//     return res.data;
// };
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/",
});

// Include JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// GET product details
export const getProductDetail = (id) =>
  API.get(`user/api/product/${id}/`);

// Add to cart
export const addToCartAPI = (data) =>
  API.post("user/api/cart/", data);

// Toggle wishlist
export const toggleWishlistAPI = (productId) =>
  API.post("user/wishlist/toggle/", { product_id: productId });

// Get + Add Review
export const getReviews = (productId) =>
  API.get(`user/api/reviews/${productId}/`);

export const addReview = (productId, data) =>
  API.post(`user/reviews/${productId}/`, data);

export default API;
