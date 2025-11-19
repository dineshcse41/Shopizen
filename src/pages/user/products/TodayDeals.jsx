// src/pages/products/TodayDeals.jsx
import React, { useMemo, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import FilterSidebar from "../../../components/FilterSideBar/FilterSideBar";
import ProductCard from "../../../components/ProductCard/ProductCard";
import productsData from "../../../data/products/products.json";

import { useComparison } from "../../../components/context/ComparisonContext";
import { useToast } from "../../../components/context/ToastContext";


const TodayDeals = () => {
  const [filters, setFilters] = useState({
    category: [],
    subCategory: [],
    brand: [],
    price: [],
    rating: [],
    stock: [],
    discount: [],
  });
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  const [products, setProducts] = useState([]);
  const { comparisonList, toggleCompare } = useComparison();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setProducts(productsData); // Load from JSON
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.dealOfTheDay); // ✅ Only dealOfTheDay products

    // Apply filters
    if (filters.category.length)
      result = result.filter((p) => filters.category.includes(p.category));
    if (filters.subCategory.length)
      result = result.filter((p) =>
        filters.subCategory.includes(p.subCategory)
      );
    if (filters.brand.length)
      result = result.filter((p) => filters.brand.includes(p.brand));
    if (filters.price.length)
      result = result.filter((p) =>
        filters.price.some(([min, max]) => p.price >= min && p.price <= max)
      );
    if (filters.rating.length)
      result = result.filter((p) => filters.rating.some((r) => p.rating >= r));
    if (filters.stock.length)
      result = result.filter((p) =>
        filters.stock.some((s) => (s ? p.stock > 0 : p.stock === 0))
      );

    // Sorting
    if (sortBy === "priceLowHigh") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "priceHighLow")
      result.sort((a, b) => b.price - a.price);
    else if (sortBy === "popularity")
      result.sort(
        (a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0)
      );
    else if (sortBy === "discountHighLow")
      result.sort((a, b) => b.discount - a.discount);

    return result;
  }, [filters, sortBy, products]);

  // Pagination
  const productsPerPage = 15;
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <>
      <div className="content-wrapper">
        <div className="container-filter d-none d-md-block">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            products={products}
          />
        </div>

        <div className="products-container">
          <div className="d-flex justify-content-between align-items-center mb-3 mt-2 flex-wrap">
            <button
              className="btn btn-outline-dark d-lg-none me-3 " /* d-md-none */
              onClick={() => setShowFilter(true)}
            >
              <i className="bi bi-funnel-fill"></i>
            </button>

            <span className="h4 mt-2">Today's Deals </span>

            <div className="dropdown ms-auto">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                Sort By
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setSortBy("priceLowHigh")}
                  >
                    Price ↑
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setSortBy("priceHighLow")}
                  >
                    Price ↓
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setSortBy("popularity")}
                  >
                    Popularity
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setSortBy("discountHighLow")}
                  >
                    Discount % ↓
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="row p-2 pe-md-4">
            {currentProducts.map((p) => (
              <div className="col-lg-4 col-md-6 col-12 mb-4" key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
            {currentProducts.length === 0 && (
              <p className="text-center mt-3">No deals available today.</p>
            )}
          </div>

          <div className="mt-4 d-flex justify-content-center">
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  &laquo;
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
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {showFilter && (
        <div className="mobile-filter-overlay">
          <div className="mobile-filter-content">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Filters</h5>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => setShowFilter(false)}
              >
                ✖
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              products={products}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TodayDeals;
