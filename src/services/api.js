import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/"; // Django backend URL

export const getOrders = async () => {
    const res = await axios.get(`${BASE_URL}/orders/`);
    return res.data;
};

export const getUsers = async () => {
    const res = await axios.get(`${BASE_URL}/users/`);
    return res.data;
};

export const getProducts = async () => {
    const res = await axios.get(`${BASE_URL}/products/`);
    return res.data;
};

export const getReviews = async () => {
    const res = await axios.get(`${BASE_URL}/reviews/`);
    return res.data;
};
