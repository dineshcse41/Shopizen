import React, { useMemo, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // for query params
import FilterSidebar from "../../../components/FilterSideBar/FilterSideBar";
import ProductCard from "../../../components/ProductCard/ProductCard";
import productsData from "../../../data/product_sample_data.json";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { AuthContext } from "../../../components/context/AuthContext";
import { useComparison } from "../../../components/context/ComparisonContext";

import "./Products.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Products = () => {
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
  
  const { user } = useContext(AuthContext);
  const query = useQuery();
  const searchQuery = query.get("query")?.toLowerCase() || "";
  const selectedCategory = query.get("category") || "All";
  const { comparisonList, clearComparison } = useComparison();
  const navigate = useNavigate();


  // 🔎 Apply Filters + Sorting + Search
  const filteredProducts = useMemo(() => {
    let result = [...productsData];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.description.toLowerCase().includes(searchQuery) ||
          p.brand.toLowerCase().includes(searchQuery) ||
          (p.subCategory &&
            p.subCategory.toLowerCase().includes(searchQuery))
      );
    }

    // Category filter (from Navbar)
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Existing filter logic
    if (filters.category.length) {
      result = result.filter((p) => filters.category.includes(p.category));
    }
    if (filters.subCategory.length) {
      result = result.filter((p) => filters.subCategory.includes(p.subCategory));
    }
    if (filters.brand.length) {
      result = result.filter((p) => filters.brand.includes(p.brand));
    }
    if (filters.price.length) {
      result = result.filter((p) =>
        filters.price.some(([min, max]) => p.price >= min && p.price <= max)
      );
    }
    if (filters.rating.length) {
      result = result.filter((p) => filters.rating.some((r) => p.rating >= r));
    }
    if (filters.stock.length) {
      result = result.filter((p) =>
        filters.stock.some((s) => (s ? p.stock > 0 : p.stock === 0))
      );
    }
    if (filters.discount.length) {
      result = result.filter((p) =>
        filters.discount.some((d) => p.discount >= d)
      );
    }

    if (sortBy === "priceLowHigh") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "priceHighLow")
      result.sort((a, b) => b.price - a.price);
    else if (sortBy === "popularity")
      result.sort(
        (a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0)
      );

    return result;
  }, [filters, sortBy, searchQuery, selectedCategory]);

  //  Pagination
  const productsPerPage = 15;
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <>
      <Navbar />

       <div className="content-wrapper mx-0 my-0">
        <div className="row">
          {/* Sidebar (visible on md+ OR as drawer on mobile) */}
          <div className="container-filter col-md-3 mb-3 mb-md-0 px-1 py-3 d-none d-md-block">
            <div className="filter-wrapper rounded text-wrap">
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </div>
          </div>

          {/* Products */}
          <div className="col-12 col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3 mt-2 p-1 flex-wrap">
          {/* Mobile Filter Toggle Button */}
              <button
                className="btn btn-outline-dark d-md-none p-2 m-2"
                onClick={() => setShowFilter(true)}
              >
                ☰ Filters
              </button>

              <span className="h4 mt-2">Let's Shop</span>

              {/* Sort dropdown */}
              <div className="dropdown ms-auto">
                <button
                  className="btn btn-secondary dropdown-toggle"
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
                </ul>
              </div>
            </div>

            {/* Product Grid */}
            <div className="row p-2 pe-2 pe-md-4">
              {currentProducts.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                   />
              ))}
              {currentProducts.length === 0 && (
                <p className="text-center mt-3">No products found.</p>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-4 d-flex justify-content-center">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
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
                      className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""
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
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
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
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
        </div>
      )}

      {/* 🔽 Sticky Compare Bar */}
      {comparisonList.length > 0 && (
        <div className="compare-bar shadow-lg p-3 bg-light d-flex align-items-center justify-content-between">
          {/* Selected Products Preview */}
          <div className="d-flex flex-wrap align-items-center">
            {comparisonList.map((item) => (
              <div key={item.id} className="mx-2 text-center">
                <img
                  src={item.image}
                  alt={item.name}
                  width="60"
                  height="60"
                  className="rounded border"
                />
                <p className="small mt-1 mb-0 text-truncate" style={{ maxWidth: "70px" }}>
                  {item.name}
                </p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={clearComparison}
            >
              Clear All
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                navigate("/compare", {
                  state: { products: comparisonList },
                })
              }
            >
              Compare Now ({comparisonList.length})
            </button>
          </div>
        </div>
      )}

     

      <Footer />
    </>
  );
};

export default Products;
