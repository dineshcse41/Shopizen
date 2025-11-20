import { USE_MOCK_DATA } from "./config";
import mockApi from "./mockApi";
import * as realApi from "../services/api";

const api = USE_MOCK_DATA ? mockApi : realApi;

// ---------- Admin ----------
export const getAdmins = api.getAdmins;
export const getRoles = api.getRoles;

// ---------- Users ----------
export const getUsers = api.getUsers;
export const getAddresses = api.getAddresses;

// ---------- Common ----------
export const getHome = api.getHome;
export const getContact = api.getContact;

// ---------- Products ----------
export const getProducts = api.getProducts;
export const getCategories = api.getCategories;
export const getBrands = api.getBrands;
export const getReviews = api.getReviews;

// ---------- Orders ----------
export const getOrders = api.getOrders;
export const getOrderItems = api.getOrderItems;
export const getPayments = api.getPayments;
export const getShipping = api.getShipping;

// ---------- Analytics ----------
export const getSales = api.getSales;

// ---------- Notifications ----------
export const getNotifications = api.getNotifications;
export const getMessages = api.getMessages;
export const getUserNotification = api.getUserNotification;
export const getGlobalNotification = api.getGlobalNotification;
export const getAdminNotification = api.getAdminNotification;
