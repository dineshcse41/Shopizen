import React, { useState, useEffect } from "react";
import { Button, Form, Table, Nav, Badge } from "react-bootstrap";
import { FiDownload, FiPlusCircle, FiArrowUpCircle, FiArrowDownCircle, FiCreditCard } from "react-icons/fi";
import userTransactions from "../../../data/users/transactions.json";
import { useToast } from "../../../components/context/ToastContext";
import "./WalletPage.css";

export default function UserWallet() {
    const [transactions, setTransactions] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const { showToast } = useToast();
    const itemsPerPage = 5;
    const walletBalance = 6250; // Replace later with backend/user context

    // Load Dummy Data or Fetch from API
    useEffect(() => {
        // ---------- USING DUMMY JSON NOW ----------
        setTransactions(userTransactions);
        setFiltered(userTransactions);

        /* ---------- DJANGO API (Uncomment Later) ----------
        fetch("http://localhost:8000/api/wallet/transactions/")
            .then((res) => res.json())
            .then((data) => {
                setTransactions(data);
                setFiltered(data);
            })
            .catch((err) => console.error("Error fetching transactions:", err));
        ----------------------------------------------------- */
    }, []);

    // Refilter on dependency change
    useEffect(() => {
        filterTransactions();
    }, [activeTab, searchTerm, startDate, endDate]);

    // Filtering logic
    const filterTransactions = () => {
        let filteredList = [...transactions];

        if (activeTab === "credit") filteredList = filteredList.filter((t) => t.amount > 0);
        if (activeTab === "debit") filteredList = filteredList.filter((t) => t.amount < 0);

        if (searchTerm)
            filteredList = filteredList.filter((t) =>
                t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
            );

        if (startDate && endDate) {
            filteredList = filteredList.filter((t) => {
                const txDate = new Date(t.date);
                return txDate >= new Date(startDate) && txDate <= new Date(endDate);
            });
        }

        setFiltered(filteredList);
        setCurrentPage(1);
    };

    // Download CSV
    const handleDownloadCSV = () => {
        const csvHeader = "Title,Date,Amount,Type,Status,Method,Order ID\n";
        const csvRows = filtered.map(
            (t) =>
                `${t.title},${t.date},${t.amount > 0 ? "+" : ""}${t.amount},${t.amount > 0 ? "Credit" : "Debit"},${t.status},${t.method},${t.orderId || "-"}`
        );
        const csvData = csvHeader + csvRows.join("\n");
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "wallet_transactions.csv";
        link.click();
    };

    // Stripe Add Money
    const handleAddMoney = async () => {
        try {
            const response = await fetch("http://localhost:5000/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 5000 }),
            });

            const session = await response.json();

            if (session.url) {
                showToast("Redirecting to Stripe Checkout...", "info");
                window.location.href = session.url;
            } else {
                showToast("Failed to initiate payment.", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Error connecting to Stripe", "error");
        }
    };

    // Stripe Withdraw (mock)
    const handleWithdraw = async () => {
        try {
            const response = await fetch("http://localhost:5000/withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 1000 }),
            });

            const data = await response.json();

            if (data.success) {
                showToast("Withdrawal successful!", "success");
            } else {
                showToast("Withdrawal failed!", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Error during withdrawal", "error");
        }
    };

    // Pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedData = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <div className="wallet-container py-4">
                {/* Wallet Header */}
                <div className="wallet-balance text-center text-white mb-4">
                    <h2>₹{walletBalance.toLocaleString()}</h2>
                    <p>My Wallet Balance</p>
                    <Button variant="light" size="sm" className="me-2" onClick={handleAddMoney}>
                        <FiPlusCircle className="me-1" /> Add Money
                    </Button>
                    <Button variant="outline-light" size="sm" onClick={handleWithdraw}>
                        Withdraw
                    </Button>
                </div>

                {/* Tabs */}
                <Nav variant="tabs" activeKey={activeTab} className="mb-3" onSelect={setActiveTab}>
                    <Nav.Item><Nav.Link eventKey="all">All</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="credit">Credits</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="debit">Debits</Nav.Link></Nav.Item>
                </Nav>

                {/* Filters */}
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                    <div className="d-flex flex-wrap gap-2">
                        <Form.Control
                            type="text"
                            placeholder="Search by title, method or order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "240px" }}
                        />
                        <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <Button variant="outline-primary" onClick={handleDownloadCSV}>
                        <FiDownload className="me-1" /> Download CSV
                    </Button>
                </div>

                {/* Transactions Table */}
                <Table hover responsive className="shadow-sm bg-white rounded">
                    <thead className="table-primary">
                        <tr>
                            <th>Title</th>
                            <th>Order ID</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th className="text-end">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((tx) => (
                                <tr key={tx.id}>
                                    <td>
                                        {tx.amount > 0 ? (
                                            <FiArrowDownCircle className="text-success me-1" />
                                        ) : (
                                            <FiArrowUpCircle className="text-danger me-1" />
                                        )}
                                        {tx.title}
                                    </td>
                                    <td>{tx.orderId || "-"}</td>
                                    <td><FiCreditCard className="me-1" />{tx.method}</td>
                                    <td>
                                        <Badge
                                            bg={
                                                tx.status === "Success"
                                                    ? "success"
                                                    : tx.status === "Pending"
                                                        ? "warning"
                                                        : "danger"
                                            }
                                        >
                                            {tx.status}
                                        </Badge>
                                    </td>
                                    <td>{new Date(tx.date).toLocaleString()}</td>
                                    <td
                                        className={`text-end fw-semibold ${tx.amount > 0 ? "text-success" : "text-danger"
                                            }`}
                                    >
                                        {tx.amount > 0 ? "+" : ""}₹{Math.abs(tx.amount)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-muted">
                                    No transactions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                {/* Pagination */}
                <div className="d-flex justify-content-center">
                    <ul className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li
                                key={i}
                                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                <button className="page-link">{i + 1}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
