import React, { useState, useMemo, useEffect } from "react";
import productsData from "../../data/products/products.json";
import "./FilterSidebar.css"; // Keep your existing styles

const FilterSidebar = ({ filters, setFilters, products }) => {
    const [brandSearch, setBrandSearch] = useState("");
    const [openCategory, setOpenCategory] = useState(null);
   /*  const [products, setProducts] = useState(productsData); */ // Default to local JSON

    // ===============================
    // API Fetch (commented for now)
    // ===============================
    /*
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch("http://localhost:8000/api/products/"); // Django API endpoint
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      fetchProducts();
    }, []);
    */

    // Toggle filter values
    const handleCheckbox = (name, value) => {
        setFilters((prev) => {
            if (name === "price") {
                const exists = prev.price.some(
                    (r) => r[0] === value[0] && r[1] === value[1]
                );
                return {
                    ...prev,
                    price: exists
                        ? prev.price.filter((r) => !(r[0] === value[0] && r[1] === value[1]))
                        : [...prev.price, value],
                };
            }

            const exists = prev[name].includes(value);
            return {
                ...prev,
                [name]: exists
                    ? prev[name].filter((v) => v !== value)
                    : [...prev[name], value],
            };
        });
    };

    // Category → Subcategory mapping
    const categoryMap = useMemo(() => {
        return products.reduce((acc, product) => {
            if (!acc[product.category]) acc[product.category] = new Set();
            if (product.subCategory) acc[product.category].add(product.subCategory);
            return acc;
        }, {});
    }, [products]);

    // Unique brands with search
    const brands = useMemo(() => {
        return [...new Set(products.map((p) => p.brand))].filter((b) =>
            b.toLowerCase().includes(brandSearch.toLowerCase())
        );
    }, [products, brandSearch]);

    // Unique ratings
    const ratings = useMemo(() => {
        return [...new Set(products.map((p) => p.rating))].sort((a, b) => b - a);
    }, [products]);

    // Stock options
    const stockOptions = useMemo(
        () => [
            { label: "In Stock", value: true },
            { label: "Out of Stock", value: false },
        ],
        []
    );

    return (
        <div className="filter-sidebar">
            <div className="filter-content">
                <h3>
                    Filters <i className="bi bi-funnel-fill"></i>
                </h3>

                {/* Category */}
                <div className="mb-4">
                    <h6>Category</h6>
                    {Object.entries(categoryMap).map(([cat, subcats]) => (
                        <div key={cat} className="mb-2">
                            <button
                                className="btn btn-light w-100 d-flex justify-content-between align-items-center"
                                type="button"
                                onClick={() =>
                                    setOpenCategory(openCategory === cat ? null : cat)
                                }
                            >
                                <span>
                                    <input
                                        type="checkbox"
                                        id={`category-${cat}`}
                                        name="category"
                                        className="form-check-input me-2"
                                        checked={filters.category.includes(cat)}
                                        onChange={() => handleCheckbox("category", cat)}
                                    />
                                    <label className="mt-0" htmlFor={`category-${cat}`}>
                                        {cat}
                                    </label>
                                </span>
                                <span>{openCategory === cat ? "▲" : "▼"}</span>
                            </button>

                            {openCategory === cat && (
                                <div className="ms-4 mt-2">
                                    {[...subcats].map((sub) => (
                                        <div className="form-check" key={sub}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`sub-${sub}`}
                                                name="subCategory"
                                                checked={filters.subCategory.includes(sub)}
                                                onChange={() => handleCheckbox("subCategory", sub)}
                                            />
                                            <label className="form-check-label mt-0" htmlFor={`sub-${sub}`}>
                                                {sub}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Brand */}
                <div className="mb-4">
                    <h6>Brand</h6>
                    <input
                        type="text"
                        className="form-control form-control-sm mb-2"
                        placeholder="Search Brand"
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                    />
                    <div className="brand-list">
                        {brands.map((brand) => (
                            <div className="form-check" key={brand}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`brand-${brand}`}
                                    name="brand"
                                    checked={filters.brand.includes(brand)}
                                    onChange={() => handleCheckbox("brand", brand)}
                                />
                                <label className="form-check-label mt-0" htmlFor={`brand-${brand}`}>
                                    {brand}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                    <h6>Price</h6>
                    {[
                        { label: "Under ₹1,000", range: [0, 1000] },
                        { label: "₹1,000 - ₹5,000", range: [1000, 5000] },
                        { label: "₹5,000 - ₹10,000", range: [5000, 10000] },
                        { label: "Over ₹10,000", range: [10000, Infinity] },
                    ].map((option, i) => (
                        <div className="form-check" key={i}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`price-${i}`}
                                checked={filters.price.some(
                                    (r) => r[0] === option.range[0] && r[1] === option.range[1]
                                )}
                                onChange={() => handleCheckbox("price", option.range)}
                            />
                            <label className="form-check-label mt-0" htmlFor={`price-${i}`}>
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>

                {/* Rating */}
                <div className="mb-4">
                    <h6>Customer Rating</h6>
                    {ratings.map((r) => (
                        <div className="form-check" key={r}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`rating-${r}`}
                                checked={filters.rating.includes(r)}
                                onChange={() => handleCheckbox("rating", r)}
                            />
                            <label className="form-check-label mt-0" htmlFor={`rating-${r}`}>
                                {r}★ & above
                            </label>
                        </div>
                    ))}
                </div>

                {/* Availability */}
                <div className="mb-4">
                    <h6>Availability</h6>
                    {stockOptions.map((opt) => (
                        <div className="form-check" key={opt.label}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`stock-${opt.label}`}
                                checked={filters.stock.includes(opt.value)}
                                onChange={() => handleCheckbox("stock", opt.value)}
                            />
                            <label className="form-check-label mt-0" htmlFor={`stock-${opt.label}`}>
                                {opt.label}
                            </label>
                        </div>
                    ))}
                </div>

                {/* Discount */}
                <div className="mb-4">
                    <h6>Discount</h6>
                    {[10, 25, 50, 70].map((d) => (
                        <div className="form-check" key={d}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`discount-${d}`}
                                checked={filters.discount.includes(d)}
                                onChange={() => handleCheckbox("discount", d)}
                            />
                            <label className="form-check-label mt-0" htmlFor={`discount-${d}`}>
                                {d}% or more
                            </label>
                        </div>
                    ))}
                </div>

                {/* Clear All */}
                <button
                    className="btn btn-danger w-100"
                    onClick={() =>
                        setFilters({
                            category: [],
                            subCategory: [],
                            brand: [],
                            price: [],
                            rating: [],
                            stock: [],
                            discount: [],
                        })
                    }
                >
                    Clear All Filters
                </button>
            </div>
        </div>
    );
};

export default FilterSidebar;
