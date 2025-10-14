import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api"; // Django backend URL

export const getOrders = async () => {
    const res = await axios.get(`${API_BASE}/orders/`);
    return res.data;
};

export const getUsers = async () => {
    const res = await axios.get(`${API_BASE}/users/`);
    return res.data;
};

export const getProducts = async () => {
    const res = await axios.get(`${API_BASE}/products/`);
    return res.data;
};

export const getReviews = async () => {
    const res = await axios.get(`${API_BASE}/reviews/`);
    return res.data;
};
