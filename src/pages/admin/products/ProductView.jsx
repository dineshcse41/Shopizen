import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link, useSearchParams } from "react-router-dom";
import { Tab, Nav } from "react-bootstrap";
import reviewsData from "../../../data/products/reviews.json"; // Local dummy reviews JSON
import "./ProductView.css";

export default function ProductView() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [product, setProduct] = useState(location.state?.product || null);
    const [mainImage, setMainImage] = useState(null);
    const [activeTab, setActiveTab] = useState("details");
    const [productReviews, setProductReviews] = useState([]);

    // Fetch product if state is missing
    useEffect(() => {
        if (!product) {
            const productId = searchParams.get("id");
            if (productId) {
                fetch(`http://127.0.0.1:8000/api/products/${productId}/`) // Django API
                    .then((res) => res.json())
                    .then((data) => {
                        setProduct(data);
                        setMainImage(data.images?.[0] || "/default-product.png");
                    })
                    .catch((err) => {
                        console.error("Error fetching product:", err);
                        navigate("/admin/products");
                    });
            } else {
                navigate("/admin/products");
            }
        } else {
            setMainImage(product.images?.[0] || "/default-product.png");
        }
    }, [product, searchParams, navigate]);

    // Fetch reviews for this product
    useEffect(() => {
        if (product) {
            const filteredReviews = reviewsData.filter(
                (review) => review.productId === product.id
            );
            setProductReviews(filteredReviews);
        }
    }, [product]);

    if (!product) {
        return (
            <div className="text-center mt-5">
                <h4>No product data found</h4>
                <button className="btn btn-secondary mt-3" onClick={() => navigate("/admin/products")}>
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="mt-4 mb-5 ">
            {/* ----------- PRODUCT CARD ----------- */}
            <div className="card shadow border-0 rounded-4 overflow-hidden mt-2">
                <div className="row g-0">
                    {/* Product Image + Gallery */}
                    <div className="col-md-5 bg-light d-flex flex-column align-items-center justify-content-center p-4">
                        {/* Main Image */}
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="img-fluid rounded-4 product-view-image mb-3"
                            style={{ maxHeight: "350px", objectFit: "contain", width: "100%" }}
                        />

                        {/* Related Images Gallery */}
                        {product.images && product.images.length > 1 && (
                            <div className="d-flex gap-2 overflow-auto w-100 mt-2">
                                {product.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Gallery ${idx + 1}`}
                                        className="rounded border related-image"
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            objectFit: "cover",
                                            cursor: "pointer",
                                            flex: "0 0 auto",
                                        }}
                                        onClick={() => setMainImage(img)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="col-md-7 p-4">
                        <h3 className="fw-bold text-primary mb-3">{product.name}</h3>
                        <div className="mb-2">
                            <span className="badge bg-secondary me-2">{product.brand}</span>
                            <span className="badge bg-info text-dark">{product.category}</span>
                        </div>
                        <h4 className="text-success mt-3 mb-3">₹{product.price}</h4>

                        <p className="text-muted mb-2">
                            <strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                        </p>
                        <p className="text-muted mb-4">
                            <strong>Product ID:</strong> #{product.id}
                        </p>

                        {/* Buttons */}
                        <div className="d-flex gap-3 mt-4">
                            <Link to={`/admin/products/edit/${product.id}`} state={{ product }} className="btn btn-warning px-4">
                                Edit Product
                            </Link>

                            <button className="btn btn-secondary px-4" onClick={() => navigate("/admin/products")}>
                                Back to Products
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ----------- TABS SECTION ----------- */}
            <div className="card shadow-sm mt-4 border-0 rounded-4">
                <div className="card-body p-4">
                    <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                        <Nav variant="tabs" className="mb-3">
                            <Nav.Item>
                                <Nav.Link eventKey="details">🧾 Details</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="specs">⚙️ Specifications</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="reviews">⭐ Reviews</Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Tab.Content>
                            {/* Details Tab */}
                            <Tab.Pane eventKey="details">
                                <p className="text-secondary">{product.description}</p>
                            </Tab.Pane>

                            {/* Specifications Tab */}
                            <Tab.Pane eventKey="specs">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><strong>Brand:</strong> {product.brand}</li>
                                    <li className="list-group-item"><strong>Category:</strong> {product.category}</li>
                                    <li className="list-group-item"><strong>Price:</strong> ₹{product.price}</li>
                                    <li className="list-group-item"><strong>Stock:</strong> {product.stock}</li>
                                    <li className="list-group-item"><strong>ID:</strong> {product.id}</li>
                                </ul>
                            </Tab.Pane>

                            {/* Reviews Tab */}
                            <Tab.Pane eventKey="reviews">
                                {productReviews.length > 0 ? (
                                    productReviews.map((r, i) => (
                                        <div key={i} className="border-bottom py-3 d-flex align-items-start gap-3">
                                            <img
                                                src={r.profilePic || "/default-user.png"}
                                                alt={r.user}
                                                className="rounded-circle"
                                                width="55"
                                                height="55"
                                                style={{ objectFit: "cover" }}
                                            />
                                            <div>
                                                <h6 className="fw-semibold mb-1">{r.user}</h6>
                                                <p className="text-warning mb-1">{"⭐".repeat(r.rating)}</p>
                                                <p className="text-secondary mb-0">{r.comment}</p>
                                                {r.date && <small className="text-muted">Reviewed on {r.date}</small>}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-secondary">No reviews available for this product.</p>
                                )}
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </div>
            </div>
        </div>
    );
}
