import React, { useState } from "react";
import productsData from "../../../data/product_sample_data.json";
import "./FilterSidebar.css"; //  we’ll add scroll CSS here

const FilterSidebar = ({ filters, setFilters }) => {
  const [brandSearch, setBrandSearch] = useState("");
  const [openCategory, setOpenCategory] = useState(null);

  //  Toggle helper
  const handleCheckbox = (name, value) => {
    setFilters((prev) => {
      if (name === "price") {
        const exists = prev.price.some(
          (r) => r[0] === value[0] && r[1] === value[1]
        );
        return {
          ...prev,
          price: exists
            ? prev.price.filter(
              (r) => !(r[0] === value[0] && r[1] === value[1])
            )
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

  // Build Category → Subcategory map
  const categoryMap = productsData.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = new Set();
    if (product.subCategory) acc[product.category].add(product.subCategory);
    return acc;
  }, {});

  // Unique brands (with search)
  const brands = [...new Set(productsData.map((p) => p.brand))].filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <div className="filter-sidebar">
      {/* ✅ Scrollable filter content */}
      <div className="filter-content">
        <h3>Filters<i class="bi bi-funnel-fill"></i></h3>
        {/* Category + Subcategory Dropdown */}
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
                    className="form-check-input me-2"
                    checked={filters.category.includes(cat)}
                    onChange={() => handleCheckbox("category", cat)}
                  />
                  {cat}
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
                        id={sub}
                        checked={filters.subCategory.includes(sub)}
                        onChange={() => handleCheckbox("subCategory", sub)}
                      />
                      <label className="form-check-label mt-0" htmlFor={sub}>
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
        <div className="mb-4 brand-list">
          <h6>Brand</h6>
          <input
            type="text"
            className="form-control form-control-sm mb-2"
            placeholder="Search Brand"
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
          />
          {brands.map((brand) => (
            <div className="form-check" key={brand}>
              <input
                className="form-check-input"
                type="checkbox"
                id={brand}
                checked={filters.brand.includes(brand)}
                onChange={() => handleCheckbox("brand", brand)}
              />
              <label className="form-check-label mt-0" htmlFor={brand}>
                {brand}
              </label>
            </div>
          ))}
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
                checked={filters.price.some(
                  (r) => r[0] === option.range[0] && r[1] === option.range[1]
                )}
                onChange={() => handleCheckbox("price", option.range)}
              />
              <label className="form-check-label mt-0">{option.label}</label>
            </div>
          ))}
        </div>

        {/* Rating */}
        <div className="mb-4">
          <h6>Customer Rating</h6>
          {[4, 3, 2].map((r) => (
            <div className="form-check" key={r}>
              <input
                className="form-check-input"
                type="checkbox"
                checked={filters.rating.includes(r)}
                onChange={() => handleCheckbox("rating", r)}
              />
              <label className="form-check-label mt-0">{r}★ & above</label>
            </div>
          ))}
        </div>

        {/* Availability */}
        <div className="mb-4">
          <h6>Availability</h6>
          {[
            { label: "In Stock", value: true },
            { label: "Out of Stock", value: false },
          ].map((opt) => (
            <div className="form-check" key={opt.label}>
              <input
                className="form-check-input"
                type="checkbox"
                checked={filters.stock.includes(opt.value)}
                onChange={() => handleCheckbox("stock", opt.value)}
              />
              <label className="form-check-label mt-0">{opt.label}</label>
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
                checked={filters.discount.includes(d)}
                onChange={() => handleCheckbox("discount", d)}
              />
              <label className="form-check-label mt-0">{d}% or more</label>
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
