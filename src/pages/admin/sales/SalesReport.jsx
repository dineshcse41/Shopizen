import React, { useState, useRef } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { Button } from "react-bootstrap";
import { FiDownload, FiPrinter } from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import salesData from "../../../data/analytics/sales.json";
import "./SalesReport.css";

const COLORS = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"];

function SalesReport() {
    const [selectedMonth, setSelectedMonth] = useState(salesData[0].month);
    const currentData = salesData.find((d) => d.month === selectedMonth);
    const reportRef = useRef(null);

    // 🧾 Function to download as PDF
    const handleDownloadPDF = async () => {
        const element = reportRef.current;
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff"
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`SalesReport_${selectedMonth}.pdf`);
    };

    // 🖨️ Function to print report
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="sales-report-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary fw-bold">📊 Sales Dashboard</h2>
                <div>
                    <Button
                        variant="success"
                        className="me-2"
                        onClick={handleDownloadPDF}
                    >
                        <FiDownload className="me-1" /> Download PDF
                    </Button>
                    <Button variant="secondary" onClick={handlePrint}>
                        <FiPrinter className="me-1" /> Print
                    </Button>
                </div>
            </div>

            {/* Month Selector */}
            <div className="d-flex justify-content-center mb-4">
                <select
                    className="form-select w-auto"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    {salesData.map((d) => (
                        <option key={d.month} value={d.month}>
                            {d.month}
                        </option>
                    ))}
                </select>
            </div>

            {/* REPORT CONTENT */}
            <div ref={reportRef} className="sales-report p-3 bg-white rounded shadow-sm">
                {/* KPI CARDS */}
                <div className="row text-center mb-4">
                    <div className="col-md-2 col-6 mb-3">
                        <div className="card shadow-sm p-3 bg-light">
                            <h6>Total Orders</h6>
                            <h4 className="text-primary">{currentData.totalOrders}</h4>
                        </div>
                    </div>
                    <div className="col-md-2 col-6 mb-3">
                        <div className="card shadow-sm p-3 bg-light">
                            <h6>Total Revenue</h6>
                            <h4 className="text-success">
                                {currentData.currency}{" "}
                                {currentData.totalRevenue.toLocaleString()}
                            </h4>
                        </div>
                    </div>
                    <div className="col-md-2 col-6 mb-3">
                        <div className="card shadow-sm p-3 bg-light">
                            <h6>Avg Order Value</h6>
                            <h4 className="text-info">{currentData.averageOrderValue}</h4>
                        </div>
                    </div>
                    <div className="col-md-2 col-6 mb-3">
                        <div className="card shadow-sm p-3 bg-light">
                            <h6>Return Rate</h6>
                            <h4 className="text-danger">{currentData.returnRate}%</h4>
                        </div>
                    </div>
                    <div className="col-md-2 col-6 mb-3">
                        <div className="card shadow-sm p-3 bg-light">
                            <h6>Customers</h6>
                            <h4 className="text-warning">{currentData.uniqueCustomers}</h4>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Revenue Trend (Line Chart) */}
                    <div className="col-lg-6 mb-4">
                        <div className="card shadow-sm p-3">
                            <h5 className="text-center text-secondary">Revenue Trend</h5>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="totalRevenue"
                                        stroke="#4e73df"
                                        strokeWidth={3}
                                        name="Revenue"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="totalOrders"
                                        stroke="#1cc88a"
                                        strokeWidth={3}
                                        name="Orders"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Sales by Category (Bar Chart) */}
                    <div className="col-lg-6 mb-4">
                        <div className="card shadow-sm p-3">
                            <h5 className="text-center text-secondary">Sales by Category</h5>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={currentData.salesByCategory}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="category" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="revenue" fill="#36b9cc" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Payment Methods (Pie Chart) */}
                    <div className="col-lg-6 mb-4">
                        <div className="card shadow-sm p-3">
                            <h5 className="text-center text-secondary">Payment Methods</h5>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={Object.entries(currentData.paymentMethods).map(
                                            ([key, value]) => ({
                                                name: key,
                                                value
                                            })
                                        )}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >
                                        {Object.keys(currentData.paymentMethods).map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Products (Bar Chart) */}
                    <div className="col-lg-6 mb-4">
                        <div className="card shadow-sm p-3">
                            <h5 className="text-center text-secondary">Top Selling Products</h5>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={currentData.topSellingProducts}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="unitsSold" fill="#f6c23e" />
                                    <Bar dataKey="revenue" fill="#4e73df" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Shipping Performance */}
                <div className="row">
                    <div className="col-lg-12 mb-4">
                        <div className="card shadow-sm p-3">
                            <h5 className="text-center text-secondary">Shipping Performance</h5>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={[
                                        {
                                            type: "On Time",
                                            value: currentData.shippingPerformance.onTimeDeliveries
                                        },
                                        {
                                            type: "Late",
                                            value: currentData.shippingPerformance.lateDeliveries
                                        }
                                    ]}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="type" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#1cc88a" />
                                </BarChart>
                            </ResponsiveContainer>
                            <p className="text-center mt-2 text-muted">
                                Avg Delivery Time:{" "}
                                <strong>
                                    {currentData.shippingPerformance.avgDeliveryTimeDays} days
                                </strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SalesReport;
