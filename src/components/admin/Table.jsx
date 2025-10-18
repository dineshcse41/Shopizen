import React, { useState, useContext, useMemo } from "react";
import {  DarkModeContext } from "../../components/context/DarkModeContext";// make sure ThemeContext exists
import "./Table.css";

export default function Table({ columns, data }) {
    const { theme } = useContext(DarkModeContext); // "light" or "dark"
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return data;

        const sorted = [...data].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            if (typeof aVal === "number" && typeof bVal === "number") {
                return aVal - bVal;
            }
            return String(aVal).localeCompare(String(bVal));
        });

        if (sortConfig.direction === "desc") sorted.reverse();
        return sorted;
    }, [data, sortConfig]);

    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    };

    return (
        <div className={`table-responsive ${theme}`}>
            <table className={`table table-striped table-hover align-middle ${theme}`}>
                <thead className={`thead-${theme}`}>
                    <tr>
                        {columns.map((c) => (
                            <th
                                key={c.key}
                                onClick={c.sortable !== false ? () => handleSort(c.key) : undefined}
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
                    {sortedData.length > 0 ? (
                        sortedData.map((row) => (
                            <tr key={row.id || Math.random().toString(36).slice(2, 9)}>
                                {columns.map((c) => (
                                    <td key={c.key}>
                                        {c.render ? c.render(row) : row[c.key] ?? "-"}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="text-center text-muted p-4">
                                No records found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
