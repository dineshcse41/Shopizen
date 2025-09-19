import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../components/context/DataContext";
import "./AddEditProduct.css";

export default function AddEditProductsTable() {
    const { addProduct } = useData();
    const navigate = useNavigate();

    // Multiple rows of products
    const [rows, setRows] = useState([
        { name: "", price: "", brand: "", category: "", stock: "", image: "" }
    ]);

    // Handle input change for specific row
    function handleChange(index, field, value) {
        const updated = [...rows];
        updated[index][field] = value;
        setRows(updated);
    }

    // Add new empty row
    function addRow() {
        setRows([...rows, { name: "", price: "", brand: "", category: "", stock: "", image: "" }]);
    }

    // Remove row
    function removeRow(index) {
        setRows(rows.filter((_, i) => i !== index));
    }

    // Submit all rows
    function submit(e) {
        e.preventDefault();
        const validRows = rows.filter(
            r => r.name.trim() && r.price > 0 && r.stock >= 0
        );

        if (validRows.length === 0) {
            return alert("Please fill at least one valid product");
        }

        validRows.forEach(r =>
            addProduct({
                ...r,
                price: Number(r.price),
                stock: Number(r.stock)
            })
        );

        navigate("/admin/products");
    }

    return (
        <>
            <div className="product-form-container">
                <h2 className="form-title centered "> Add Multiple Products</h2>

                <form onSubmit={submit}>
                    <div className="table-responsive">
                        <table className="product-input-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price (₹)</th>
                                    <th>Brand</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Image URL</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="text"
                                                value={row.name}
                                                onChange={e =>
                                                    handleChange(index, "name", e.target.value)
                                                }
                                                placeholder="Product name"
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={row.price}
                                                onChange={e =>
                                                    handleChange(index, "price", e.target.value)
                                                }
                                                placeholder="0"
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={row.brand}
                                                onChange={e =>
                                                    handleChange(index, "brand", e.target.value)
                                                }
                                                placeholder="Brand"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={row.category}
                                                onChange={e =>
                                                    handleChange(index, "category", e.target.value)
                                                }
                                                placeholder="Category"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={row.stock}
                                                onChange={e =>
                                                    handleChange(index, "stock", e.target.value)
                                                }
                                                placeholder="0"
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="url"
                                                value={row.image}
                                                onChange={e =>
                                                    handleChange(index, "image", e.target.value)
                                                }
                                                placeholder="Image URL"
                                            />
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => removeRow(index)}
                                                disabled={rows.length === 1}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={addRow} className="btn btn-add btn-outline-primary">
                             Add Row
                        </button>
                        <button type="submit" className="btn btn-save ms-2">
                            Save All
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/products")}
                            className="btn btn-cancel ms-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
