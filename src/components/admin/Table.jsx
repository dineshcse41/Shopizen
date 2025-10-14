import React from "react";

export default function Table({ columns, data }) {
    return (
        <div className="overflow-x-auto">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        {columns.map(c => (
                            <th key={c.key}>{c.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map(row => (
                            <tr key={row.id}>
                                {columns.map(c => (
                                    <td key={c.key}>
                                        {c.render ? c.render(row) : row[c.key]}
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
