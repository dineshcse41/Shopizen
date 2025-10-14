import React, { useEffect, useState } from "react";
import ordersData from "../../../data/orders/orders.json";
import usersData from "../../../data/users/users.json";
import productsData from "../../../data/products/products.json";
import reviewsData from "../../../data/products/reviews.json";
import "./Dashboard.css";

function Dashboard() {
    const [filters, setFilters] = useState({
        orders: "month",
        users: "month",
        products: "month",
        reviews: "month",
    });

    const [stats, setStats] = useState({
        orders: 0,
        users: 0,
        products: 0,
        reviews: 0,
    });

    const [changes, setChanges] = useState({
        orders: 0,
        users: 0,
        products: 0,
        reviews: 0,
    });

    const filterByDate = (items, dateKey, timeframe, offset = 0) => {
        if (!Array.isArray(items)) return [];
        const now = new Date();
        if (offset) {
            // Offset: 1 = previous period
            if (timeframe === "day") now.setDate(now.getDate() - offset);
            if (timeframe === "week") now.setDate(now.getDate() - 7 * offset);
            if (timeframe === "month") now.setMonth(now.getMonth() - offset);
            if (timeframe === "year") now.setFullYear(now.getFullYear() - offset);
        }

        return items.filter((item) => {
            const itemDate = new Date(item[dateKey]);
            switch (timeframe) {
                case "day":
                    return itemDate.toDateString() === now.toDateString();
                case "week": {
                    const start = new Date(now);
                    start.setDate(now.getDate() - 7);
                    return itemDate >= start && itemDate <= now;
                }
                case "month":
                    return (
                        itemDate.getMonth() === now.getMonth() &&
                        itemDate.getFullYear() === now.getFullYear()
                    );
                case "year":
                    return itemDate.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });
    };

    const calculateStats = () => {
        const newStats = {
            orders: filterByDate(ordersData, "date", filters.orders).length,
            users: filterByDate(usersData, "date", filters.users).length,
            products: filterByDate(productsData, "date", filters.products).length,
            reviews: filterByDate(reviewsData, "date", filters.reviews).length,
        };

        const newChanges = {};
        Object.keys(filters).forEach((key) => {
            const current = newStats[key];
            const previous = filterByDate(
                key === "orders" ? ordersData :
                    key === "users" ? usersData :
                        key === "products" ? productsData : reviewsData,
                "date",
                filters[key],
                1 // offset to previous period
            ).length;

            const change = previous === 0 ? 0 : ((current - previous) / previous) * 100;
            newChanges[key] = Math.round(change);
        });

        setStats(newStats);
        setChanges(newChanges);
    };

    useEffect(() => {
        calculateStats();
    }, [filters]);

    const statItems = [
        { key: "orders", label: "Total Orders", value: stats.orders, icon: "bi-cart4" },
        { key: "users", label: "Total Users", value: stats.users, icon: "bi-people" },
        { key: "products", label: "Total Products", value: stats.products, icon: "bi-box-seam" },
        { key: "reviews", label: "Total Reviews", value: stats.reviews, icon: "bi-star" },
    ];
    return (
        <div className="mt-5 dashboard-container">
            <div className="row g-4">
                {statItems.map((stat) => (
                    <div className="col-md-3" key={stat.key}>
                        <div className={`card stat-card shadow-sm `}>
                            <div className="card-body d-flex flex-column justify-content-between p-3 rounded">

                                <div className="row justify-content-between align-items-center mb-2">
                                    <h6 className="stat-label">{stat.label}</h6>
                                    <h3 className="stat-value">{stat.value}</h3>

                                    <div className="d-flex align-items-center justify-content-between mt-2">
                                        <p
                                            className={`mb-0 stat-change ${changes[stat.key] > 0
                                                ? "text-success"
                                                : changes[stat.key] < 0

                                                    ? "text-grey"
                                                    : "text-black"
                                                }`}
                                        >
                                            {changes[stat.key] > 0 ? "+" : ""}
                                            {changes[stat.key]}% Last {filters[stat.key].charAt(0).toUpperCase() + filters[stat.key].slice(1)}
                                        </p>

                                        <div className="dropdown ms-2">
                                            <button
                                                className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                id={`dropdown-${stat.key}`}
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                                style={{ width: "28px", height: "28px", padding: "0" }}
                                            >
                                                <i className="bi bi-three-dots-vertical fs-6"></i>
                                            </button>

                                            <ul
                                                className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3"
                                                aria-labelledby={`dropdown-${stat.key}`}
                                                style={{ minWidth: "120px", fontSize: "0.85rem" }}
                                            >
                                                {["day", "week", "month", "year"].map((period) => (
                                                    <li key={period}>
                                                        <button
                                                            className="dropdown-item text-capitalize"
                                                            onClick={() =>
                                                                setFilters((prev) => ({ ...prev, [stat.key]: period }))
                                                            }
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
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
