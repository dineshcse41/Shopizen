import React, { useMemo, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // for query params
import FilterSidebar from "../../../components/FilterSideBar/FilterSideBar";
import ProductCard from "../../../components/ProductCard/ProductCard";
import productsData from "../../../data/products/products.json"; // dummy JSON
import Footer from "../../../components/Footer/Footer";
import { AuthContext } from "../../../components/context/AuthContext";
import { useComparison } from "../../../components/context/ComparisonContext";
import { useToast } from "../../../components/context/ToastContext"; // adjust path
import defaultImage from "../../../assets/product-default-image.png";

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

    const [products, setProducts] = useState([]); // final products state
    const { user } = useContext(AuthContext);
    const query = useQuery();
    const searchQuery = query.get("query")?.toLowerCase() || "";
    const selectedCategory = query.get("category") || "All";
    const { comparisonList, toggleCompare } = useComparison();
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        // ✅ Using Dummy JSON
        setProducts(productsData);

        // 🔽 Uncomment below code to fetch from Django API later
        /*
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/products/"); // replace with your Django endpoint
                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]); // fallback empty
            }
        };
        fetchProducts();
        */
    }, []);

    // 🔎 Apply Filters + Sorting + Search
    const filteredProducts = useMemo(() => {
        let result = [...products];

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
    }, [filters, sortBy, searchQuery, selectedCategory, products]);

    // Pagination
    const productsPerPage = 15;
    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
        <>
                <div className="content-wrapper">
                    {/* Sidebar */}
                    <div className="container-filter d-none d-md-block">
                        <FilterSidebar 
                            filters={filters} 
                            setFilters={setFilters} 
                            products={products}
                        />
                    </div>

                    {/* Product Section */}
                    <div className="products-container">
                        <div className="d-flex justify-content-between align-items-center mb-3 mt-2 flex-wrap">
                            <button
                                className="btn btn-outline-dark d-md-none"
                                onClick={() => setShowFilter(true)}
                            >
                                ☰ Filters
                            </button>

                            <span className="h4 mt-2">Let's Shop</span>

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
                                </ul>
                            </div>
                        </div>

                        <div className="row p-2 pe-md-4">
                        
                            {currentProducts.map((p) => (
                                <div className="col-lg-4 col-md-6 col-6 mb-4">
                                    <ProductCard key={p.id} product={p} />
                                </div>
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

                {/* Mini Compare Stack (like Amazon) */}
                {comparisonList.length > 0 && (
                    <div className="compare-mini-stack">
                        {comparisonList.map((item) => (
                            <div key={item.id} className="compare-mini-card">
                                <img
                                    src={
                                        item.images && item.images.length > 0
                                            ? item.images[0]
                                            : defaultImage
                                    }
                                    className="rounded"
                                    alt={item.name}

                                    onError={(e) => (e.target.src = defaultImage)}
                                />

                                <button
                                    className="remove-btn"
                                    onClick={() => {
                                        toggleCompare(item); // remove item
                                        showToast(`${item.name} removed from comparison.`, "success");
                                    }}
                                >
                                    ✖
                                </button>
                            </div>
                        ))}
                        <button
                            className="btn btn-primary btn-sm compare-now-btn"
                            onClick={() =>
                                navigate("/compare", { state: { products: comparisonList } })
                            }
                        >
                            Compare Now ({comparisonList.length})
                        </button>
                    </div>
                )}


                <Footer />
        
        </>
    );
};

export default Products;
