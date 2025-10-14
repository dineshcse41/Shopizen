// src/pages/admin/products/AddEditProduct.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DarkModeContext } from "../../../components/context/DarkModeContext"; // optional
import "./AddEditProduct.css";

export default function AddEditProduct() {
    const location = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { darkMode } = useContext(DarkModeContext);

    const [activeTab, setActiveTab] = useState("basic");
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: "",
        oldPrice: "",
        stock: 1,
        weight: "",
        category: "",
        brand: "",
        tags: [],
        isAvailable: true,
        images: [],        // File objects
        previews: [],      // Local preview URLs
    });

    // Prefill form if editing
    useEffect(() => {
        if (location.state?.product) {
            // Prefill from passed state
            const data = location.state.product;
            setProductData({
                name: data.name || "",
                description: data.description || "",
                price: data.price || "",
                oldPrice: data.oldPrice || "",
                stock: data.stock || 1,
                weight: data.weight || "",
                category: data.category || "",
                brand: data.brand || "",
                tags: data.tags || [],
                isAvailable: data.isAvailable,
                images: [], // Files empty
                previews: data.images || [],
            });
        } else if (id) {
            fetch(`http://127.0.0.1:8000/api/products/${id}/`)
                .then((res) => res.json())
                .then((data) => {
                    setProductData({
                        name: data.name || "",
                        description: data.description || "",
                        price: data.price || "",
                        oldPrice: data.oldPrice || "",
                        stock: data.stock || 1,
                        weight: data.weight || "",
                        category: data.category || "",
                        brand: data.brand || "",
                        tags: data.tags || [],
                        isAvailable: data.isAvailable,
                        images: [],
                        previews: data.images || [], // existing images URLs
                    });
                })
                .catch((err) => console.error("Error fetching product:", err));
        }
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "images") {
            const fileArray = Array.from(files);
            const previewArray = fileArray.map((file) => URL.createObjectURL(file));
            setProductData({
                ...productData,
                images: fileArray,
                previews: previewArray,
            });
        } else {
            setProductData({ ...productData, [name]: value });
        }
    };

    // Handle tag addition
    const handleTagKeyDown = (e) => {
        if (e.key === "Enter" && e.target.value.trim()) {
            e.preventDefault();
            if (!productData.tags.includes(e.target.value.trim())) {
                setProductData({
                    ...productData,
                    tags: [...productData.tags, e.target.value.trim()],
                });
            }
            e.target.value = "";
        }
    };

    // Handle tag removal
    const removeTag = (tag) => {
        setProductData({
            ...productData,
            tags: productData.tags.filter((t) => t !== tag),
        });
    };

    // Drag and drop image upload
    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
        if (files.length) {
            const previewArray = files.map((file) => URL.createObjectURL(file));
            setProductData({
                ...productData,
                images: files,
                previews: previewArray,
            });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const { name, description, price, category, brand, stock, images } = productData;
        if (!name.trim() || !description.trim() || !price || !category.trim() || !brand.trim()) {
            alert("Please fill all required fields (Name, Description, Price, Category, Brand).");
            // Switch to first tab with missing field
            if (!name.trim() || !category.trim() || !brand.trim() || !price) setActiveTab("basic");
            else if (!description.trim()) setActiveTab("details");
            return;
        }

        if (stock === 0) productData.isAvailable = false;

        const formData = new FormData();
        Object.keys(productData).forEach((key) => {
            if (key === "previews") return;
            if (key === "images") {
                productData.images.forEach((file) => formData.append("images", file));
            } else if (key === "tags") {
                formData.append("tags", JSON.stringify(productData.tags));
            } else {
                formData.append(key, productData[key]);
            }
        });

        try {
            const response = await fetch(
                id
                    ? `http://127.0.0.1:8000/api/products/${id}/`
                    : "http://127.0.0.1:8000/api/products/",
                {
                    method: id ? "PUT" : "POST",
                    body: formData,
                }
            );

            if (!response.ok) throw new Error("Upload failed");
            const data = await response.json();
            console.log("Product saved via API:", data);
            navigate("/admin/products");
        } catch (err) {
            console.error("Error uploading product:", err);
            alert("Failed to upload product. Check console for details.");
        }
    };


    return (
        <div className={`container mt-4 mb-5 ${darkMode ? "bg-dark text-light" : ""}`}>
            <div className="card p-4">
                <h4 className="text-center mb-4">{id ? "Edit Product" : "Add New Product"}</h4>

                {/* Tabs Navigation */}
                <ul className="nav nav-tabs mb-3 justify-content-center" role="tablist">
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === "basic" ? "active" : ""}`} onClick={() => setActiveTab("basic")}>Basic Info</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === "details" ? "active" : ""}`} onClick={() => setActiveTab("details")}>Details</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === "image" ? "active" : ""}`} onClick={() => setActiveTab("image")}>Media</button>
                    </li>
                </ul>

                <form onSubmit={handleSubmit}>
                    <div className="tab-content">

                        {/* Basic Info */}
                        {activeTab === "basic" && (
                            <div className="tab-pane fade show active">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Product Name</label>
                                        <input type="text" name="name" className="form-control" value={productData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Category</label>
                                        <input type="text" name="category" className="form-control" value={productData.category} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row g-3 mt-2">
                                    <div className="col-md-6">
                                        <label className="form-label">Brand</label>
                                        <input type="text" name="brand" className="form-control" value={productData.brand} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Price (₹)</label>
                                        <input type="number" name="price" className="form-control" value={productData.price} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Details */}
                        {activeTab === "details" && (
                            <div className="tab-pane fade show active">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Stock</label>
                                        <input type="number" name="stock" className="form-control" value={productData.stock} onChange={handleChange} min="0" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Weight</label>
                                        <input type="text" name="weight" className="form-control" value={productData.weight} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-control" rows="3" name="description" value={productData.description} onChange={handleChange}></textarea>
                                </div>

                                {/* Tags */}
                                <div className="mt-3">
                                    <label className="form-label">Tags</label>
                                    <input
                                        type="text"
                                        placeholder="Type tag and press Enter"
                                        onKeyDown={handleTagKeyDown}
                                        className="form-control"
                                    />
                                    <div className="tag-list mt-2">
                                        {productData.tags.map((tag, idx) => (
                                            <span key={idx} className="badge bg-primary me-1">
                                                {tag} <i className="bi bi-x" style={{ cursor: "pointer" }} onClick={() => removeTag(tag)}></i>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Media / Images */}
                        {activeTab === "image" && (
                            <div className={`tab-pane fade show active`}>
                                <div
                                    className={`card mb-4 p-3 border-0 ${darkMode ? "bg-secondary text-light" : ""}`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    <h4 className="text-center mb-3">Media</h4>
                                    <div className="image-upload-wrapper d-flex justify-content-center flex-wrap">
                                        {productData.previews.length > 0 ? (
                                            productData.previews.map((src, idx) => (
                                                <img key={idx} src={src} alt={`Preview ${idx}`} className="img-preview m-2" style={{ maxWidth: "150px" }} />
                                            ))
                                        ) : (
                                            <div className="upload-placeholder text-center p-4" style={{ border: "2px dashed #ccc" }}>
                                                <i className="bi bi-cloud-arrow-up fs-3 mb-2"></i>
                                                <p>Click or drag images here</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id="image-upload"
                                            name="images"
                                            accept="image/*"
                                            multiple
                                            onChange={handleChange}
                                            className="d-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-between mt-4">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/admin/products")}>Cancel</button>
                        {activeTab !== "basic" && (
                            <button type="button" className="btn btn-outline-primary" onClick={() => setActiveTab(activeTab === "details" ? "basic" : "details")}>← Previous</button>
                        )}
                        {activeTab !== "image" && (
                            <button type="button" className="btn btn-primary" onClick={() => setActiveTab(activeTab === "basic" ? "details" : "image")}>Next →</button>
                        )}
                        {activeTab === "image" && (
                            <button type="submit" className="btn btn-success">{id ? "Update Product" : "Add Product"}</button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
