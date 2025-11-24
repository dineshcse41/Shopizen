// src/pages/admin/products/AddEditProduct.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DarkModeContext } from "../../../components/context/DarkModeContext";
import { useToast } from "../../../components/context/ToastContext";
import "./AddEditProduct.css";

export default function AddEditProduct() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    //oldPrice: "",
    discount: 0,
    currency: "INR",
   // rating: 1,
    stock: 1,
    weight: "",
    category: "",
    subCategory: "",
    brand: "",
    tags: [],
    isAvailable: true,
    dealOfTheDay: false,
    isNewArrival: false,
    midSeasonSale: false,
    sizes: [],
    priceBySize: {},
    images: [],
    previews: [],
  });

  // Prefill form if editing
  useEffect(() => {
    if (location.state?.product) {
      const data = location.state.product;
      setProductData((prev) => ({
        ...prev,
        ...data,
        images: [],
        previews: data.images || [],
        sizes: data.sizes || prev.sizes,
        priceBySize: data.priceBySize || prev.priceBySize,
      }));
    } else if (id) {
      fetch(`http://127.0.0.1:8000/api/products/${id}/`)
        .then((res) => res.json())
        .then((data) => {
          setProductData((prev) => ({
            ...prev,
            ...data,
            images: [],
            previews: data.images || [],
            sizes: data.sizes || prev.sizes,
            priceBySize: data.priceBySize || prev.priceBySize,
          }));
        })
        .catch((err) => console.error("Error fetching product:", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "images") {
      const fileArray = Array.from(files);
      const previewArray = fileArray.map((file) => URL.createObjectURL(file));
      setProductData({
        ...productData,
        images: fileArray,
        previews: previewArray,
      });
    } else if (type === "checkbox") {
      setProductData({ ...productData, [name]: checked });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  // Tag management
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (!productData.tags.includes(tag)) {
        setProductData({ ...productData, tags: [...productData.tags, tag] });
      }
      e.target.value = "";
    }
  };

  const removeTag = (tag) => {
    setProductData({
      ...productData,
      tags: productData.tags.filter((t) => t !== tag),
    });
  };

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length) {
      const previewArray = files.map((file) => URL.createObjectURL(file));
      setProductData({ ...productData, images: files, previews: previewArray });
    }
  };
  const handleDragOver = (e) => e.preventDefault();

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, price, category, brand, stock } = productData;

    if (
      !name.trim() ||
      !description.trim() ||
      !price ||
      !category.trim() ||
      !brand.trim()
    ) {
      showToast(
        "Please fill all required fields (Name, Description, Price, Category, Brand).",
        "warning"
      );
      if (!name || !category || !brand || !price) setActiveTab("basic");
      else if (!description) setActiveTab("details");
      return;
    }

    if (Number(stock) === 0) productData.isAvailable = false;

    const formData = new FormData();

    // Append simple fields
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    //formData.append("oldPrice", productData.oldPrice || "");
    formData.append("discount", productData.discount);
    formData.append("currency", productData.currency);
   // formData.append("rating", productData.rating);
    formData.append("stock", productData.stock);
    formData.append("weight", productData.weight);
    formData.append("category", productData.category);
    formData.append("subCategory", productData.subCategory);
    formData.append("brand", productData.brand);
    formData.append("isAvailable", productData.isAvailable);
    formData.append("dealOfTheDay", productData.dealOfTheDay);
    formData.append("isNewArrival", productData.isNewArrival);
    formData.append("midSeasonSale", productData.midSeasonSale);

    // Arrays / objects as JSON
    formData.append("tags", JSON.stringify(productData.tags));
    formData.append("sizes", JSON.stringify(productData.sizes));
    formData.append("priceBySize", JSON.stringify(productData.priceBySize));

    // Images
    if (productData.images && productData.images.length) {
      productData.images.forEach((file) => formData.append("images", file));
    }

    try {
      const response = await fetch(
        id
          ? `http://127.0.0.1:8000/user/api/products/${id}/`
          : "http://127.0.0.1:8000/user/api/products/",
        { method: id ? "PUT" : "POST", body: formData }
      );

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      showToast(`Product ${id ? "updated" : "added"} successfully!`, "success");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      showToast("Failed to upload product.", "error");
    }
  };

  return (
    <div className={`${darkMode ? "bg-dark text-light" : ""}`}>
      <div className="mt-0 p-4">
        <div className=" card  p-4">
          <h2 className="text-center mb-4">
            {id ? "Edit Product" : "Add New Product"}
          </h2>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-4 justify-content-center">
            {["basic", "details", "image"].map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "basic"
                    ? "Basic Info"
                    : tab === "details"
                    ? "Details"
                    : "Media"}
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit}>
            {/* Tab Content */}
            <div className="tab-content">
              {/* Basic Info */}
              {activeTab === "basic" && (
                <div className="tab-pane fade show active">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={productData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        name="category"
                        className="form-control"
                        value={productData.category}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row g-3 mt-3">
                    <div className="col-md-6">
                      <label className="form-label">Brand</label>
                      <input
                        type="text"
                        name="brand"
                        className="form-control"
                        value={productData.brand}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Price (₹)</label>
                      <input
                        type="number"
                        name="price"
                        className="form-control"
                        value={productData.price}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Additional Basic Fields */}
                  <div className="row g-3 mt-3">
                    <div className="col-md-6">
                      <label className="form-label">Discount (%)</label>
                      <input
                        type="number"
                        name="discount"
                        className="form-control"
                        value={productData.discount}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Currency</label>
                      <input
                        type="text"
                        name="currency"
                        className="form-control"
                        value={productData.currency}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6 mt-3">
                      <label className="form-label">Sub Category</label>
                      <input
                        type="text"
                        name="subCategory"
                        className="form-control"
                        value={productData.subCategory}
                        onChange={handleChange}
                      />
                    </div>

                    {/* <div className="col-md-6 mt-3">
                      <label className="form-label">Rating (1–5)</label>
                      <input
                        type="number"
                        name="rating"
                        min="1"
                        max="5"
                        className="form-control"
                        value={productData.rating}
                        onChange={handleChange}
                      />
                    </div> */}
                  </div>
                </div>
              )}

              {/* Details */}
              {activeTab === "details" && (
                <div className="tab-pane fade show active">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        className="form-control"
                        value={productData.stock}
                        min="0"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Weight</label>
                      <input
                        type="text"
                        name="weight"
                        className="form-control"
                        value={productData.weight}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="description"
                      value={productData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  {/* Tags */}
                  <div className="mt-3">
                    <label className="form-label">Tags</label>
                    <input
                      type="text"
                      placeholder="Type tag and press Enter"
                      className="form-control"
                      onKeyDown={handleTagKeyDown}
                    />
                    <div className="tag-list mt-2">
                      {productData.tags.map((tag, idx) => (
                        <span key={idx} className="badge bg-primary me-1">
                          {tag}{" "}
                          <i
                            className="bi bi-x"
                            onClick={() => removeTag(tag)}
                          ></i>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Special Flags */}
                  <div className="mt-4">
                    <label className="form-label">Special Flags</label>
                    <div className="d-flex gap-3 flex-wrap mt-2">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="dealOfTheDay"
                          checked={productData.dealOfTheDay}
                          onChange={(e) =>
                            setProductData({
                              ...productData,
                              dealOfTheDay: e.target.checked,
                            })
                          }
                        />
                        <label className="form-check-label">
                          Deal of the Day
                        </label>
                      </div>

                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="isNewArrival"
                          checked={productData.isNewArrival}
                          onChange={(e) =>
                            setProductData({
                              ...productData,
                              isNewArrival: e.target.checked,
                            })
                          }
                        />
                        <label className="form-check-label">New Arrival</label>
                      </div>

                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="midSeasonSale"
                          checked={productData.midSeasonSale}
                          onChange={(e) =>
                            setProductData({
                              ...productData,
                              midSeasonSale: e.target.checked,
                            })
                          }
                        />
                        <label className="form-check-label">
                          Mid Season Sale
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Sizes input */}
                  <div className="mt-4">
                    <label className="form-label">Sizes</label>
                    <input
                      type="text"
                      placeholder="Type size and press Enter (e.g., S, M, L)"
                      className="form-control"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          e.preventDefault();
                          const size = e.target.value.trim().toUpperCase();
                          if (!productData.sizes.includes(size)) {
                            setProductData({
                              ...productData,
                              sizes: [...productData.sizes, size],
                              priceBySize: {
                                ...productData.priceBySize,
                                [size]: "",
                              },
                            });
                          }
                          e.target.value = "";
                        }
                      }}
                    />

                    <div className="tag-list mt-2">
                      {productData.sizes.map((size) => (
                        <span key={size} className="badge bg-success me-1">
                          {size}{" "}
                          <i
                            className="bi bi-x"
                            onClick={() =>
                              setProductData({
                                ...productData,
                                sizes: productData.sizes.filter(
                                  (s) => s !== size
                                ),
                                priceBySize: Object.fromEntries(
                                  Object.entries(
                                    productData.priceBySize
                                  ).filter(([key]) => key !== size)
                                ),
                              })
                            }
                          ></i>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price by size */}
                  {productData.sizes.length > 0 && (
                    <div className="mt-4">
                      <label className="form-label">Price By Size</label>

                      <div className="row g-3">
                        {productData.sizes.map((size) => (
                          <div key={size} className="col-md-4">
                            <label className="form-label">{size} Price</label>
                            <input
                              type="number"
                              className="form-control"
                              value={productData.priceBySize[size] || ""}
                              onChange={(e) =>
                                setProductData({
                                  ...productData,
                                  priceBySize: {
                                    ...productData.priceBySize,
                                    [size]: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Media */}
              {activeTab === "image" && (
                <div className="tab-pane fade show active">
                  <div
                    className={`card mb-4 p-4 border-0 ${
                      darkMode ? "bg-secondary text-light" : ""
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <h4 className="text-center mb-3">Media</h4>
                    <div className="image-upload-wrapper text-center">
                      <label
                        htmlFor="image-upload"
                        className="upload-area d-flex flex-column justify-content-center align-items-center p-4 mb-3"
                      >
                        <i className="bi bi-cloud-arrow-up fs-2 mb-2"></i>
                        <p className="mb-0">Click or drag images here</p>
                      </label>
                      <input
                        type="file"
                        id="image-upload"
                        name="images"
                        accept="image/*"
                        multiple
                        className="d-none"
                        onChange={handleChange}
                      />
                      <div className="preview-grid d-flex flex-wrap justify-content-center gap-3">
                        {productData.previews.map((src, idx) => (
                          <div
                            key={idx}
                            className="preview-box border rounded p-2 shadow-sm"
                            style={{
                              width: "180px",
                              height: "180px",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={src}
                              alt={`Preview ${idx}`}
                              className="w-100 h-100 object-fit-cover rounded"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between mt-4 flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate("/admin/products")}
              >
                Cancel
              </button>
              {activeTab !== "basic" && (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() =>
                    setActiveTab(activeTab === "details" ? "basic" : "details")
                  }
                >
                  ← Previous
                </button>
              )}
              {activeTab !== "image" && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    setActiveTab(activeTab === "basic" ? "details" : "image")
                  }
                >
                  Next →
                </button>
              )}
              {activeTab === "image" && (
                <button type="submit" className="btn btn-success">
                  {id ? "Update Product" : "Add Product"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
