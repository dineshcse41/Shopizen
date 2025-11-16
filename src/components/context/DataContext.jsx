import React, { createContext, useContext, useEffect, useState } from "react";
import orderData from "../../data/orders/orders.json";
import productData from "../../data/products/products.json";
import usersData from "../../data/users/users.json"; // <-- import users.json

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export function DataProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(productData.products || productData);

    const normalizedOrders = orderData.map((o) => {
      const items = o.items.map((it) => {
        const product = (productData.products || productData).find(
          (p) => p.productId === it.productId
        );
        return {
          productId: it.productId,
          name: product?.name || `Product ${it.productId}`,
          qty: it.quantity,
          price: it.price || 0,
        };
      });

      // Find user name from usersData
      const user = usersData.find((u) => u.id === o.userId);

      return {
        id: o.orderId,
        orderId: o.orderId,
        customer: user ? user.name : `User ${o.userId}`, // <-- use actual name
        createdAt: o.orderDate,
        currency: o.currency,
        total: o.amount,
        status: o.status,
        paymentType: o.paymentMethod,
        items,
        raw: o,
      };
    });

    setOrders(normalizedOrders);
  }, []);

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId ? { ...o, status, raw: { ...o.raw, status } } : o
      )
    );
  };

  return (
    <DataContext.Provider value={{ orders, updateOrderStatus, products }}>
      {children}
    </DataContext.Provider>
  );
}
