// -------------------- Import Mock Data --------------------
import adminsData from "../data/admin/admin.json";
import rolesData from "../data/admin/roles.json";

import contactData from "../data/common/contact.json";
import homeData from "../data/common/homeData.json";

import usersData from "../data/users/users.json";
import addressesData from "../data/users/addresses.json";

import productsData from "../data/products/products.json";
import categoriesData from "../data/products/categories.json";
import brandsData from "../data/products/brands.json";
import reviewsData from "../data/products/reviews.json";

import ordersData from "../data/orders/orders.json";
import orderItemsData from "../data/orders/order_items.json";
import paymentsData from "../data/orders/payments.json";
import shippingData from "../data/orders/shipping.json";

import salesData from "../data/analytics/sales.json";

import adminNotificationData from "../data/notifications/adminNotifications.json";
import globalNotificationData from "../data/notifications/globalNotifications.json";
import userNotificationData from "../data/notifications/userNotifications.json";
import notificationsData from "../data/notifications/notifications.json";
import messagesData from "../data/notifications/messages.json";

// -------------------- Mock API Definition --------------------
const mockApi = {
    // ---------- Admin ----------
    getAdmins: () => Promise.resolve(adminsData),
    getRoles: () => Promise.resolve(rolesData),

    // ---------- Users ----------
    getUsers: () => Promise.resolve(usersData),
    getAddresses: () => Promise.resolve(addressesData),

    // ---------- Common ----------
    getHome: () => Promise.resolve(homeData),
    getContact: () => Promise.resolve(contactData),

    // ---------- Products ----------
    getProducts: () => Promise.resolve(productsData),
    getCategories: () => Promise.resolve(categoriesData),
    getBrands: () => Promise.resolve(brandsData),
    getReviews: () => Promise.resolve(reviewsData),

    // ---------- Orders ----------
    getOrders: () => Promise.resolve(ordersData),
    getOrderItems: () => Promise.resolve(orderItemsData),
    getPayments: () => Promise.resolve(paymentsData),
    getShipping: () => Promise.resolve(shippingData),

    // ---------- Analytics ----------
    getSales: () => Promise.resolve(salesData),

    // ---------- Notifications ----------
    getNotifications: () => Promise.resolve(notificationsData),
    getMessages: () => Promise.resolve(messagesData),
    getUserNotification: () => Promise.resolve(userNotificationData),
    getGlobalNotification: () => Promise.resolve(globalNotificationData),
    getAdminNotification: () => Promise.resolve(adminNotificationData),
};

// ✅ Simulated network delay for realism
export const fetchMockData = (fn) =>
    new Promise((resolve) => setTimeout(() => resolve(fn()), 300));

export default mockApi;
