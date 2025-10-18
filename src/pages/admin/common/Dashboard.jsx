import React, { useEffect, useMemo, useState, useContext } from "react";
import Table from "../../../components/admin/Table";
import { CSVLink } from "react-csv";
import { DarkModeContext } from "../../../components/context/DarkModeContext";
import { useToast } from "../../../components/context/ToastContext.jsx";

import "./Dashboard.css";

// Dummy JSON Data (will replace with API later)
import ordersData from "../../../data/orders/orders.json";
import usersData from "../../../data/users/users.json";
import productsData from "../../../data/products/products.json";
import reviewsData from "../../../data/products/reviews.json";

// Recharts for charts
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

function Dashboard() {
    const { theme } = useContext(DarkModeContext); // "light" | "dark"

    // --- Filters and live updating ---
    const [filters, setFilters] = useState({
        orders: "month",
        users: "month",
        products: "month",
        reviews: "month",
    });
    const [live, setLive] = useState(false);
    const { showToast } = useToast(); // use the toast context

    // --- Stats and percentage changes ---
    const [stats, setStats] = useState({
        orders: 0,
        users: 0,
        products: 0,
        reviews: 0,
        revenue: 0,
        avgOrderValue: 0,
    });
    const [changes, setChanges] = useState({
        orders: 0,
        users: 0,
        products: 0,
        reviews: 0,
        revenue: 0,
        avgOrderValue: 0,
    });

    // --- Chart metric selection ---
    const [chartMetric, setChartMetric] = useState("Revenue");

    // --- Fetch data from API (Commented for now, using dummy JSON) ---
    /*
    useEffect(() => {
      const fetchData = async () => {
        const ordersRes = await fetch("/api/orders"); 
        const orders = await ordersRes.json();
        const usersRes = await fetch("/api/users");
        const users = await usersRes.json();
        const productsRes = await fetch("/api/products");
        const products = await productsRes.json();
        const reviewsRes = await fetch("/api/reviews");
        const reviews = await reviewsRes.json();
  
        // Use fetched API data instead of dummy JSON
      };
      fetchData();
    }, []);
    */

    // --- Utility Functions ---
    const getOrderAmount = (order) => {
        if (!order) return 0;
        const direct = order.amount ?? order.totalAmount ?? order.grandTotal;
        if (typeof direct === "number") return direct;

        if (Array.isArray(order.items) && order.items.length) {
            return order.items.reduce((sum, it) => {
                const price =
                    it.price ??
                    productsData.find((p) => p.id === it.productId)?.price ??
                    0;
                const qty = it.quantity ?? 1;
                return sum + price * qty;
            }, 0);
        }
        return 0;
    };

    const filterByDate = (items, dateKey, timeframe, offset = 0) => {
        if (!Array.isArray(items)) return [];
        const now = new Date();
        const ref = new Date(now);
        if (offset) {
            if (timeframe === "day") ref.setDate(ref.getDate() - offset);
            if (timeframe === "week") ref.setDate(ref.getDate() - 7 * offset);
            if (timeframe === "month") ref.setMonth(ref.getMonth() - offset);
            if (timeframe === "year") ref.setFullYear(ref.getFullYear() - offset);
        }

        return items.filter((item) => {
            const raw = item[dateKey] ?? item.createdAt ?? item.date ?? item.registeredAt;
            if (!raw) return false;
            const itemDate = new Date(raw);
            switch (timeframe) {
                case "day":
                    return itemDate.toDateString() === ref.toDateString();
                case "week": {
                    const start = new Date(ref);
                    start.setDate(ref.getDate() - 6);
                    return itemDate >= start && itemDate <= ref;
                }
                case "month":
                    return itemDate.getMonth() === ref.getMonth() && itemDate.getFullYear() === ref.getFullYear();
                case "year":
                    return itemDate.getFullYear() === ref.getFullYear();
                default:
                    return true;
            }
        });
    };

    // --- Calculate Stats ---
    const calculateStats = () => {
        const filteredOrders = filterByDate(ordersData, "orderDate", filters.orders);
        const filteredUsers = filterByDate(usersData, "registeredAt", filters.users);
        const filteredProducts = filterByDate(productsData, "createdAt", filters.products);
        const filteredReviews = filterByDate(reviewsData, "createdAt", filters.reviews);

        const totalRevenue = filteredOrders.reduce((sum, o) => sum + getOrderAmount(o), 0);
        const avgOrderValue = filteredOrders.length ? totalRevenue / filteredOrders.length : 0;

        setStats({
            orders: filteredOrders.length,
            users: filteredUsers.length,
            products: filteredProducts.length,
            reviews: filteredReviews.length,
            revenue: totalRevenue,
            avgOrderValue: avgOrderValue,
        });

        // --- Calculate % changes vs previous period ---
        const previousOrders = filterByDate(ordersData, "orderDate", filters.orders, 1).length;
        const previousUsers = filterByDate(usersData, "registeredAt", filters.users, 1).length;
        const previousProducts = filterByDate(productsData, "createdAt", filters.products, 1).length;
        const previousReviews = filterByDate(reviewsData, "createdAt", filters.reviews, 1).length;
        const previousRevenue = filterByDate(ordersData, "orderDate", filters.orders, 1)
            .reduce((sum, o) => sum + getOrderAmount(o), 0);

        const calcChange = (current, previous) =>
            previous === 0 ? (current ? 100 : 0) : Math.round(((current - previous) / previous) * 100);

        setChanges({
            orders: calcChange(filteredOrders.length, previousOrders),
            users: calcChange(filteredUsers.length, previousUsers),
            products: calcChange(filteredProducts.length, previousProducts),
            reviews: calcChange(filteredReviews.length, previousReviews),
            revenue: calcChange(totalRevenue, previousRevenue),
            avgOrderValue: calcChange(avgOrderValue, previousRevenue / Math.max(1, previousOrders)),
        });
    };

    useEffect(() => {
        calculateStats();
    }, [filters]);

    useEffect(() => {
        if (!live) return;
        const interval = setInterval(() => {
            calculateStats();
        }, 5000);
        return () => clearInterval(interval);
    }, [live, filters]);

    // --- Sales Chart Series ---
    const salesSeries = useMemo(() => {
        const buckets = [];
        const now = new Date();
        for (let i = 0; i < 30; i++) {
            const d = new Date(now);
            d.setDate(now.getDate() - (29 - i));
            buckets.push({ label: d.toLocaleDateString(), amount: 0 });
        }

        ordersData.forEach((o) => {
            const d = new Date(o.orderDate ?? o.createdAt ?? o.timestamp);
            const bucket = buckets.find((b) => b.label === d.toLocaleDateString());
            if (!bucket) return;
            let value = 0;
            if (chartMetric === "Revenue") value = getOrderAmount(o);
            if (chartMetric === "Orders") value = 1;
            if (chartMetric === "AOV") value = getOrderAmount(o) / (o.items?.length ?? 1);
            bucket.amount += value;
        });

        return buckets.map((b) => ({ name: b.label, amount: Math.round(b.amount) }));
    }, [ordersData, chartMetric]);

    // --- Best Selling Products ---
    const bestSellingProducts = useMemo(() => {
        const tally = {};
        ordersData.forEach((o) => {
            const items = Array.isArray(o.items) ? o.items : [o];
            items.forEach((it) => {
                const pid = it.productId ?? it.id;
                if (!pid) return;
                const price = it.price ?? productsData.find((p) => p.id === pid)?.price ?? 0;
                const qty = it.quantity ?? 1;
                tally[pid] = tally[pid] || { qty: 0, revenue: 0 };
                tally[pid].qty += qty;
                tally[pid].revenue += price * qty;
            });
        });

        return Object.keys(tally).map((pid) => {
            const prod = productsData.find((p) => p.id === pid) ?? {};
            return {
                id: pid,
                name: prod.name ?? `Product ${pid}`,
                sku: prod.sku ?? pid,
                qtySold: tally[pid].qty,
                revenue: Math.round(tally[pid].revenue),
                image: prod.images?.[0] ?? null,
                category: prod.category ?? "N/A",
                brand: prod.brand ?? "N/A",
                stock: prod.stock ?? 0,
            };
        }).sort((a, b) => b.qtySold - a.qtySold);
    }, [ordersData]);

    // --- Recent Orders ---
    const recentOrders = useMemo(() => {
        return [...ordersData]
            .sort((a, b) => new Date(b.orderDate ?? b.createdAt ?? b.timestamp) - new Date(a.orderDate ?? a.createdAt ?? a.timestamp))
            .slice(0, 12)
            .map((o) => ({
                id: o.orderId ?? `#${Math.random().toString(36).slice(2, 8)}`,
                date: new Date(o.orderDate ?? o.createdAt ?? o.timestamp).toLocaleString(),
                customer: usersData.find(u => u.id === o.userId)?.name ?? "Guest",
                itemsCount: Array.isArray(o.items) ? o.items.reduce((s, it) => s + (it.quantity ?? 1), 0) : 1,
                amount: getOrderAmount(o),
                status: o.status ?? "Processing",
                paymentMethod: o.paymentMethod ?? "N/A",
                shippingMethod: o.shippingMethod ?? "N/A",
            }));
    }, [ordersData]);

    // --- Columns for Tables ---
    const bestSellingColumns = [
        { key: "image", label: "Image", render: (row) => <img src={row.image} alt={row.name} width={40} /> },
        { key: "name", label: "Product" },
        { key: "sku", label: "SKU" },
        { key: "qtySold", label: "Qty Sold", sortable: true },
        { key: "revenue", label: "Revenue", sortable: true },
        { key: "category", label: "Category" },
        { key: "brand", label: "Brand" },
        { key: "stock", label: "Stock" },
    ];

    const recentOrdersColumns = [
        { key: "id", label: "Order ID" },
        { key: "date", label: "Date" },
        { key: "customer", label: "Customer" },
        { key: "itemsCount", label: "Items" },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status" },
        { key: "paymentMethod", label: "Payment" },
        { key: "shippingMethod", label: "Shipping" },
    ];

    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <div className={`mt-4 dashboard-wrapper ${theme}`}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                    <h2 className="mb-0">Admin Dashboard</h2>
                    <button
                        className={`btn btn-sm ${live ? "btn-success" : "btn-outline-secondary"} mt-1`}
                        onClick={() => setLive(!live)}
                    >
                        {live ? "Live ON" : "Live OFF"}
                    </button>
                    <small
                        className="d-block mt-1"
                        style={{ color: theme === "dark" ? "#6c757d" : "#4b5563" }} // darker gray for light mode
                    >
                        Overview of store performance
                    </small>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: 'Store Dashboard Report',
                                    text: 'Check out the latest performance of our store!',
                                    url: window.location.href
                                })
                                    .then(() => showToast("Report shared successfully!", "success"))
                                    .catch((err) => showToast("Error sharing report.", "error"));
                            } else {
                                showToast("Sharing is not supported in your browser. Copied URL to clipboard!", "info");
                                navigator.clipboard.writeText(window.location.href);
                            }
                        }}
                    >
                        Share Report
                    </button>

                    <button className="btn btn-primary btn-sm">Generate Invoice</button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-3 mb-4">
                {[
                    { key: "orders", label: "Total Orders", icon: "bi-cart4" },
                    { key: "users", label: "Total Users", icon: "bi-people" },
                    { key: "products", label: "Total Products", icon: "bi-box-seam" },
                    { key: "reviews", label: "Total Reviews", icon: "bi-star" },
                    { key: "revenue", label: "Revenue", icon: "bi-currency-rupee" },
                    { key: "avgOrderValue", label: "Avg Order Value", icon: "bi-cash-stack" },
                ].map((stat) => (
                    <div className="col-md-4" key={stat.key}>
                        <div className={`card stat-card p-3 shadow-sm h-100 position-relative ${theme}`}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="mb-1 stat-label">{stat.label}</h6>
                                    <h3 className="stat-value">
                                        {stat.key === "revenue" || stat.key === "avgOrderValue" ? `₹ ${stats[stat.key].toLocaleString()}` : stats[stat.key]}
                                    </h3>
                                    <p className={`mb-0 stat-change small ${changes[stat.key] > 0 ? "text-success" : changes[stat.key] < 0 ? "text-danger" : "text-muted"}`}>
                                        {changes[stat.key] > 0 ? "+" : ""}{changes[stat.key]}% Last {cap(filters[stat.key] ?? "month")}
                                    </p>
                                </div>
                                <div className="ms-3">
                                    <div className="stat-icon bg-gradient d-flex justify-content-center align-items-center rounded-circle"
                                        style={{ width: "40px", height: "40px", color: theme === "dark" ? "#fff" : "#3b82f6" }}>
                                        <i className={`bi ${stat.icon} fs-4`}></i>
                                    </div>
                                </div>
                            </div>

                            {/* Timeframe dropdown */}
                            <div className="mt-3 d-flex justify-content-end">
                                <div className="dropdown">
                                    <button
                                        className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                        type="button"
                                        id={`dropdown-${stat.key}`}
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {cap(filters[stat.key] ?? "month")}
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdown-${stat.key}`}>
                                        {["day", "week", "month", "year"].map((period) => (
                                            <li key={period}>
                                                <button
                                                    className={`dropdown-item text-capitalize ${filters[stat.key] === period ? "active" : ""}`}
                                                    onClick={() => setFilters((prev) => ({ ...prev, [stat.key]: period }))}
                                                >
                                                    Last {period}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                ))}
            </div>

            {/* Bottom Tables */}
            <div className="row g-3 mt-3">
                <div className="">
                    <div className={`card p-3 shadow-sm ${theme}`}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6>Best Selling Products</h6>
                            <CSVLink data={bestSellingProducts} filename="best_selling_products.csv" className="btn btn-sm btn-outline-secondary">Export CSV</CSVLink>
                        </div>
                        <Table columns={bestSellingColumns} data={bestSellingProducts} />
                    </div>
                </div>
                <div className="">
                    <div className={`card p-3 shadow-sm ${theme}`}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6>Recent Orders</h6>
                            <CSVLink data={recentOrders} filename="recent_orders.csv" className="btn btn-sm btn-outline-secondary">Export CSV</CSVLink>
                        </div>
                        <Table columns={recentOrdersColumns} data={recentOrders} />
                    </div>
                </div>
            </div>

            {/* Chart Metric Buttons */}
            <div className="btn-group mb-3 flex-wrap mt-2">
                {["Revenue", "Orders", "AOV"].map((metric) => (
                    <button
                        key={metric}
                        className={`btn btn-sm ${chartMetric === metric ? "btn-primary" : "btn-outline-secondary"}`}
                        onClick={() => setChartMetric(metric)}
                    >
                        {metric}
                    </button>
                ))}
            </div>

            {/* Sales Overview Chart */}
            <div className="row g-3 mb-4">
                <div className="col-lg-8">
                    <div className={`card p-3 shadow-sm h-100 ${theme}`}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="mb-0">Sales Overview</h5>
                            <div className="small text-muted">Period: {cap(filters.orders)}</div>
                        </div>
                        <div style={{ width: "100%", height: 280 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesSeries}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#444" : "#ddd"} />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme === "dark" ? "#ccc" : "#333" }} />
                                    <YAxis tick={{ fill: theme === "dark" ? "#ccc" : "#333" }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column: Users & Reviews */}
                <div className="col-lg-4">
                    <div className={`card p-3 shadow-sm mb-3 overflow-auto ${theme}`} style={{ maxHeight: "220px" }}>
                        <h6 className="mb-2">New Users (Last 7 days)</h6>
                        <ul className="list-unstyled mb-0 new-users-list">
                            {usersData.slice(0, 8).map(u => (
                                <li key={u.id} className="d-flex align-items-center py-2 border-bottom">
                                    <div className="avatar me-2">{(u.name ?? u.email ?? "U").charAt(0)}</div>
                                    <div className="flex-grow-1 small">
                                        <strong>{u.name ?? u.email ?? "Unknown"}</strong>
                                        <div className="text-muted small">{new Date(u.registeredAt ?? u.date ?? u.createdAt).toLocaleString()}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={`card p-3 shadow-sm overflow-auto ${theme}`} style={{ maxHeight: "220px" }}>
                        <h6 className="mb-2">Recent Reviews</h6>
                        <div className="recent-reviews">
                            {reviewsData.slice(0, 6).map(r => (
                                <div key={r.reviewId} className="review-item mb-2">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <strong className="small">{productsData.find(p => p.id === r.productId)?.name ?? "Unknown Product"}</strong>
                                            <div className="small text-muted">{r.text.slice(0, 80)}{r.text.length > 80 ? "..." : ""}</div>
                                        </div>
                                        <div className="small text-warning">{r.rating}★</div>
                                    </div>
                                    <div className="small text-muted">{new Date(r.date ?? r.createdAt).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

           
        </div>
    );
}

export default Dashboard;
