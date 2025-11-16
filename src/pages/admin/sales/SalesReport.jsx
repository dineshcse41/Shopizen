// src/pages/admin/analytics/SalesReport.jsx
import React, { useState, useRef, useContext, useMemo } from "react";
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
  ResponsiveContainer,
} from "recharts";
import {
  FiPackage,
  FiDollarSign,
  FiBarChart2,
  FiRotateCcw,
  FiUsers,
} from "react-icons/fi";
import { Button } from "react-bootstrap";
import { FiDownload, FiPrinter } from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import salesData from "../../../data/analytics/sales.json";
import { DarkModeContext } from "../../../components/context/DarkModeContext";
import "./SalesReport.css";

const COLORS = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"];

function SalesReport() {
  const { theme } = useContext(DarkModeContext);
  const [viewType, setViewType] = useState("Month");
  const [selectedMonth, setSelectedMonth] = useState(salesData[0]?.month || "");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const reportRef = useRef(null);

  const isDark = theme === "dark";
  const cardClass = isDark ? "bg-dark-card text-light" : "bg-light text-dark";
  const chartGridColor = isDark ? "#2d3748" : "#e5e7eb";
  const chartTextColor = isDark ? "#e2e8f0" : "#2d3748";
  const bgClass = isDark ? "sales-report-dark" : "sales-report-light";

  // ✅ Normalize sales data for flexibility (convert string month to date if missing)
  const normalizedData = useMemo(() => {
    return salesData.map((d) => ({
      ...d,
      date: d.date ? new Date(d.date) : new Date(`${d.month || "Jan"} 1, 2025`),
    }));
  }, []);

  // ✅ Filter data safely based on view type
  const filteredData = useMemo(() => {
    if (viewType === "Custom Range" && startDate && endDate) {
      return normalizedData.filter(
        (d) => d.date >= startDate && d.date <= endDate
      );
    }
    return normalizedData;
  }, [viewType, startDate, endDate, normalizedData]);

  const currentData =
    viewType === "Month"
      ? normalizedData.find((d) => d.month === selectedMonth)
      : filteredData[filteredData.length - 1] || normalizedData[0];

  // 🧾 PDF Export
  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(
      `SalesReport_${viewType}${
        startDate && endDate
          ? `_${startDate.toLocaleDateString()}-${endDate.toLocaleDateString()}`
          : ""
      }.pdf`
    );
  };

  const handlePrint = () => window.print();

  const csvData = filteredData.map((d) => ({
    Date: d.date?.toLocaleDateString() || d.month,
    Orders: d.totalOrders,
    Revenue: d.totalRevenue,
    "Avg Order Value": d.averageOrderValue,
    Returns: d.returnRate,
    Customers: d.uniqueCustomers,
  }));

  return (
    <div className={`sales-report-container ${bgClass}`}>
      <div className="p-4">
        {/* Header and Actions */}
        <div>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-3 mb-md-0 ms-2">
                Sales Analytics Report
              </h2>
            </div>
            <div>
              <CSVLink
                data={csvData}
                filename={`SalesReport_${viewType}.csv`}
                className={`btn btn-${
                  isDark ? "outline-light" : "success"
                } me-2`}
              >
                <FiDownload className="me-1" /> Download CSV
              </CSVLink>
              <Button
                variant={isDark ? "outline-light" : "primary"}
                className="me-2"
                onClick={handleDownloadPDF}
              >
                <FiDownload className="me-1" /> Download PDF
              </Button>
              <Button
                variant={isDark ? "outline-light" : "dark"}
                onClick={handlePrint}
              >
                <FiPrinter className="me-1" /> Print
              </Button>
            </div>
          </div>
        </div>

        {/* View Type Selection */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
          {["Day", "Week", "Month", "Year", "Custom Range"].map((type) => (
            <Button
              key={type}
              variant={
                viewType === type
                  ? "success"
                  : isDark
                  ? "outline-light"
                  : "outline-dark"
              }
              onClick={() => setViewType(type)}
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Date Pickers */}
        {viewType === "Month" && (
          <div className="d-flex justify-content-center mb-4">
            <select
              className={`form-select w-auto ${
                isDark ? "bg-dark text-light" : ""
              }`}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {normalizedData.map((d) => (
                <option key={d.month} value={d.month}>
                  {d.month}
                </option>
              ))}
            </select>
          </div>
        )}

        {viewType === "Custom Range" && (
          <div className="d-flex justify-content-center mb-4 gap-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="form-control w-auto"
              placeholderText="Start Date"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              className="form-control w-auto"
              placeholderText="End Date"
            />
          </div>
        )}

        {/* Main Report */}
        <div
          ref={reportRef}
          className={`sales-report p-3 mb-4 rounded shadow-sm ${cardClass}`}
        >
          {/* KPI Cards */}  
        <div className="row text-center mb-4 g-3">
  {[
    {
      label: "Total Orders",
      value: currentData.totalOrders,
      color: "text-primary",
      icon: <FiPackage size={24} />,
    },
    {
      label: "Total Revenue",
      value: `${currentData.currency} ${currentData.totalRevenue?.toLocaleString()}`,
      color: "text-success",
      icon: <FiDollarSign size={24} />,
    },
    {
      label: "Avg Order Value",
      value: currentData.averageOrderValue,
      color: "text-info",
      icon: <FiBarChart2 size={24} />,
    },
    {
      label: "Return Rate",
      value: `${currentData.returnRate}%`,
      color: "text-danger",
      icon: <FiRotateCcw size={24} />,
    },
    {
      label: "Customers",
      value: currentData.uniqueCustomers,
      color: "text-warning",
      icon: <FiUsers size={24} />,
    },
  ].map((kpi, i) => (
    <div className="col-md-2 col-6" key={i}>
      <div
        className={`card shadow-sm border-0 h-100 p-3 d-flex flex-column justify-content-center align-items-center ${
          isDark ? "bg-dark-card text-light" : "bg-white text-dark"
        }`}
        style={{
          borderRadius: "12px",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          wordWrap: "break-word",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.05)";
        }}
      >
        <div className="mb-2">{kpi.icon}</div>
        <h6
          className="fw-semibold text-uppercase mb-1"
          style={{ fontSize: "0.85rem", lineHeight: "1.2" }}
        >
          {kpi.label}
        </h6>
        <h4 className={`${kpi.color} fw-bold`} style={{ fontSize: "1.25rem" }}>
          {kpi.value}
        </h4>
      </div>
    </div>
  ))}
        </div>

          {/* Charts */}
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className={`card shadow-sm p-3 ${cardClass}`}>
                <h5 className="text-center text-secondary">Revenue Trend</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filteredData}>
                    <CartesianGrid stroke={chartGridColor} />
                    <XAxis dataKey="month" stroke={chartTextColor} />
                    <YAxis stroke={chartTextColor} />
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

            <div className="col-lg-6 mb-4">
              <div className={`card shadow-sm p-3 ${cardClass}`}>
                <h5 className="text-center text-secondary">
                  Sales by Category
                </h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={currentData.salesByCategory}>
                    <CartesianGrid stroke={chartGridColor} />
                    <XAxis dataKey="category" stroke={chartTextColor} />
                    <YAxis stroke={chartTextColor} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#36b9cc" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

         <div className="row">
            {/* Payment Methods */}
            <div className="col-lg-6 mb-4">
              <div className={`card shadow-sm p-3 ${cardClass}`}>
                <h5 className="text-center text-secondary">Payment Methods</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(currentData.paymentMethods).map(
                        ([k, v]) => ({
                          name: k,
                          value: v,
                        })
                      )}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {Object.keys(currentData.paymentMethods).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div className="col-lg-6 mb-4">
              <div className={`card shadow-sm p-3 ${cardClass}`}>
                <h5 className="text-center text-secondary">
                  Top Selling Products
                </h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={currentData.topSellingProducts}>
                    <CartesianGrid stroke={chartGridColor} />
                    <XAxis dataKey="name" stroke={chartTextColor} />
                    <YAxis stroke={chartTextColor} />
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
              <div className={`card shadow-sm p-3 ${cardClass}`}>
                <h5 className="text-center text-secondary">
                  Shipping Performance
                </h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      {
                        type: "On Time",
                        value: currentData.shippingPerformance.onTimeDeliveries,
                      },
                      {
                        type: "Late",
                        value: currentData.shippingPerformance.lateDeliveries,
                      },
                    ]}
                  >
                    <CartesianGrid stroke={chartGridColor} />
                    <XAxis dataKey="type" stroke={chartTextColor} />
                    <YAxis stroke={chartTextColor} />
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
