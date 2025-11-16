import React, { useState, useMemo, useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import "./Table.css";

export default function Table({ columns, data, pageSize = 15 }) {
  const { theme } = useContext(DarkModeContext); // "light" | "dark"
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);

  // --- Sorting logic ---
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === "number" && typeof bVal === "number")
        return aVal - bVal;
      return String(aVal ?? "").localeCompare(String(bVal ?? ""));
    });
    if (sortConfig.direction === "desc") sorted.reverse();
    return sorted;
  }, [data, sortConfig]);

  // --- Pagination logic ---
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className={`table-container ${theme}-mode shadow-lg rounded-4 p-3`}>
      {/* Header Bar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-semibold mb-0 text-gradient">Data Overview</h5>
        <div className="d-flex align-items-center gap-2">
          <span className="small">Rows per page:</span>
          <select
            className={`form-select form-select-sm ${
              theme === "dark" ? "bg-dark text-light border-secondary" : ""
            }`}
            style={{ width: "70px" }}
            value={rowsPerPage}
            onChange={handleRowsChange}
          >
            {[10, 15, 20, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-responsive">
        <table className={`custom-table ${theme}`}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  onClick={
                    c.sortable !== false ? () => handleSort(c.key) : undefined
                  }
                  className={c.sortable !== false ? "sortable" : ""}
                >
                  {c.label || c.title || c.key}
                  {sortConfig.key === c.key && (
                    <span className="ms-1">
                      {sortConfig.direction === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr key={row.id ?? row.reviewId}>
                  {columns.map((c) => (
                    <td key={c.key}>
                      {c.render ? c.render(row) : row[c.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center text-muted p-4"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="small">
            Showing {(currentPage - 1) * rowsPerPage + 1}–
            {Math.min(currentPage * rowsPerPage, sortedData.length)} of{" "}
            {sortedData.length}
          </span>

          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  ◀ Prev
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                >
                  Next ▶
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
