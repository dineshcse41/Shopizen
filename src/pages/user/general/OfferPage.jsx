import React, { useState, useEffect, useMemo, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import FilterSidebar from "../../../components/FilterSideBar/FilterSideBar";
import ProductCard from "../../../components/ProductCard/ProductCard";
import productsData from "../../../data/products/products.json";
import offersData from "../../../data/common/offers.json";
import Footer from "../../../components/Footer/Footer";
import { AuthContext } from "../../../components/context/AuthContext";
import { useComparison } from "../../../components/context/ComparisonContext";
import { useToast } from "../../../components/context/ToastContext";
import defaultImage from "../../../assets/product-default-image.png";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const OfferPage = () => {
    const { id } = useParams();
    const offer = offersData?.offers?.find((o) => o.id === Number(id));

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
    const { comparisonList, toggleCompare } = useComparison();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const query = useQuery();
    const searchQuery = query.get("query")?.toLowerCase() || "";

    const [products, setProducts] = useState([]);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        setProducts(productsData); // dummy JSON, can replace with API
    }, []);

    // Countdown timer effect

    useEffect(() => {
        if (!offer?.expiryDate) return;

        const expiry = new Date(offer.expiryDate).getTime();
        const now = new Date().getTime();
        const initialTime = Math.max(Math.floor((expiry - now) / 1000), 0);
        setTimeLeft(initialTime);

        const interval = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [offer?.expiryDate]);

    // Format time as HH:MM:SS
   const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
};


    // Filter products based on the offer
    const offerFilteredProducts = useMemo(() => {
        if (!offer) return [];
        return products.filter((p) => {
            switch (offer.filterType) {
                case "priceBelow":
                    return p.price <= offer.filterValue;
                case "category":
                    return p.category.toLowerCase() === offer.filterValue.toLowerCase();
                case "subCategory":
                    return p.subCategory?.toLowerCase() === offer.filterValue.toLowerCase();
                default:
                    return true;
            }
        });
    }, [offer, products]);

    // Apply additional Filters + Sorting + Search
    const filteredProducts = useMemo(() => {
        let result = [...offerFilteredProducts];

        if (searchQuery) {
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(searchQuery) ||
                    p.description.toLowerCase().includes(searchQuery) ||
                    p.brand.toLowerCase().includes(searchQuery) ||
                    (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery))
            );
        }

        if (filters.category.length) result = result.filter((p) => filters.category.includes(p.category));
        if (filters.subCategory.length) result = result.filter((p) => filters.subCategory.includes(p.subCategory));
        if (filters.brand.length) result = result.filter((p) => filters.brand.includes(p.brand));
        if (filters.price.length) result = result.filter((p) =>
            filters.price.some(([min, max]) => p.price >= min && p.price <= max)
        );
        if (filters.rating.length) result = result.filter((p) =>
            filters.rating.some((r) => p.rating >= r)
        );
        if (filters.stock.length) result = result.filter((p) =>
            filters.stock.some((s) => (s ? p.stock > 0 : p.stock === 0))
        );
        if (filters.discount.length) result = result.filter((p) =>
            filters.discount.some((d) => offer.discount >= d)
        );

        if (sortBy === "priceLowHigh") result.sort((a, b) => a.price - b.price);
        else if (sortBy === "priceHighLow") result.sort((a, b) => b.price - a.price);
        else if (sortBy === "popularity") result.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));

        return result;
    }, [offerFilteredProducts, filters, sortBy, searchQuery, offer]);

    const productsPerPage = 15;
    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (!offer) return <div className="text-center mt-5">Offer not found or expired.</div>;

    const totalTime = offer?.expiry ? Math.floor((new Date(offer.expiry) - new Date()) / 1000) + timeLeft : 1;

    return (
        <>
            {/* Countdown Timer with Animated Progress */}
            {offer?.expiryDate && (
                <OfferTimer expiryDate={offer.expiryDate} />
            )}
            <div className="content-wrapper">
                    {/* Sidebar */}
                    <div className="container-filter d-none d-md-block">
                        <FilterSidebar
                            filters={filters}
                            setFilters={setFilters}
                            products={offerFilteredProducts.map(p => ({
                                ...p,
                                price: p.price - (p.price * offer.discount) / 100,
                                discount: offer.discount
                            }))}
                        />
                    </div>

                    {/* Product Section */}
                    <div className="products-container">
                        <div className="d-flex justify-content-between align-items-center mb-3 mt-2 flex-wrap">
                            <button className="btn btn-outline-dark d-md-none" onClick={() => setShowFilter(true)}>
                                ☰ Filters
                            </button>

                            <span className="h4 mt-2">{offer.title}</span>

                            <div className="dropdown ms-auto">
                                <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    Sort By
                                </button>
                                <ul className="dropdown-menu">
                                    <li><button className="dropdown-item" onClick={() => setSortBy("priceLowHigh")}>Price ↑</button></li>
                                    <li><button className="dropdown-item" onClick={() => setSortBy("priceHighLow")}>Price ↓</button></li>
                                    <li><button className="dropdown-item" onClick={() => setSortBy("popularity")}>Popularity</button></li>
                                </ul>
                            </div>
                        </div>

                        <div className="row p-2 pe-md-4">
                            {currentProducts.map((p) => (
                                <div className="col-lg-4 col-md-6 col-6 mb-4" key={p.id}>
                                    <ProductCard product={{
                                        ...p,
                                        price: (p.price - (p.price * offer.discount) / 100).toFixed(2),
                                        discount: offer.discount
                                    }} />
                                </div>
                            ))}
                            {currentProducts.length === 0 && <p className="text-center mt-3">No products found for this offer.</p>}
                        </div>

                        {/* Pagination */}
                        <div className="mt-4 d-flex justify-content-center">
                            <nav>
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>&laquo;</button>
                                    </li>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>&raquo;</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>

                    {/* Mobile Filter */}
                    {showFilter && (
                        <div className="mobile-filter-overlay">
                            <div className="mobile-filter-content">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5>Filters</h5>
                                    <button className="btn btn-sm btn-danger" onClick={() => setShowFilter(false)}>✖</button>
                                </div>
                                <FilterSidebar
                                    filters={filters}
                                    setFilters={setFilters}
                                    products={offerFilteredProducts.map(p => ({
                                        ...p,
                                        price: p.price - (p.price * offer.discount) / 100,
                                        discount: offer.discount
                                    }))}
                                />
                            </div>
                        </div>
                    )}

                    {/* Mini Compare */}
                    {comparisonList.length > 0 && (
                        <div className="compare-mini-stack">
                            {comparisonList.map((item) => (
                                <div key={item.id} className="compare-mini-card">
                                    <img src={item.images?.[0] || defaultImage} alt={item.name} onError={(e) => (e.target.src = defaultImage)} />
                                    <button className="remove-btn" onClick={() => { toggleCompare(item); showToast(`${item.name} removed from comparison.`, "success"); }}>✖</button>
                                </div>
                            ))}
                            <button className="btn btn-primary btn-sm compare-now-btn" onClick={() => navigate("/compare", { state: { products: comparisonList } })}>
                                Compare Now ({comparisonList.length})
                            </button>
                        </div>
                    )}
               </div>

            <Footer />

            
        </>
    );
};

function OfferTimer({ expiryDate }) {
    const [timeLeft, setTimeLeft] = React.useState(0);
    const totalRef = React.useRef(0);

    React.useEffect(() => {
        if (!expiryDate) return;
        const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(expiryDate);
        const expiry = new Date(isDateOnly ? `${expiryDate}T23:59:59` : expiryDate).getTime();
        const now = Date.now();
        const initial = Math.max(Math.floor((expiry - now) / 1000), 0);
        setTimeLeft(initial);
        totalRef.current = initial || 1;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [expiryDate]);

    const format = (sec) => {
        const h = Math.floor(sec / 3600).toString().padStart(2, "0");
        const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return { h, m, s };
    };

    const { h, m, s } = format(timeLeft);
    const percent = Math.max(0, (timeLeft / Math.max(totalRef.current, 1)) * 100);

    return (
        <>
            <div className="offer-timer-wrapper">
                <div className="offer-timer-box justify-content-center">
                    <div className="timer-unit">
                        <div className="time-value">{h}</div>
                        <div className="time-label">HR</div>
                    </div>

                    <div className="timer-colon">:</div>

                    <div className="timer-unit">
                        <div className="time-value">{m}</div>
                        <div className="time-label">MIN</div>
                    </div>

                    <div className="timer-colon">:</div>

                    <div className="timer-unit">
                        <div className="time-value">{s}</div>
                        <div className="time-label">SEC</div>
                    </div>
                </div>

               
            </div>
            <style>{`
.offer-timer-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 28px; /* compact height */
  background-color: rgba(255,255,255,0.08);
  padding: 2px 6px; /* minimal padding */
  position: sticky;
  top: 0; /* stick to top */
  z-index: 1050;
}

.offer-timer-box {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
  backdrop-filter: blur(6px);
  border-radius: 6px;
  padding: 2px 6px; /* compact padding */
  max-width: 400px;
  width: min(90%, 400px);
}

.timer-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  padding: 2px 4px;
  border-radius: 4px;
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.06);
}

.time-value {
  font-weight: 700;
  font-size: 0.8rem; /* small font */
  background: linear-gradient(90deg, #ff8a00, #ff3d00, #ffb347);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 6px rgba(255,100,20,0.2);
}

.time-label {
  margin-top: 0;
  font-size: 0.55rem;
  color: rgba(255,255,255,0.8);
  font-weight: 500;
}

.timer-colon {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.95);
  font-weight: 600;
  margin: 0 1px;
}

@media (max-width: 480px) {
  .timer-unit { min-width: 36px; padding: 1px 3px; }
  .time-value { font-size: 0.7rem; }
  .timer-colon { font-size: 0.7rem; }
}
`}</style>


        </>
    );
}

export default OfferPage;
