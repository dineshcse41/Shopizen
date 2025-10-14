
import React from "react";
import { useComparison } from "../../../components/context/ComparisonContext";
import Footer from "../../../components/Footer/Footer";
import defaultImage from "../../../../src/assets/product-default-image.png";

const ComparisonPage = () => {
    const { comparisonList, toggleCompare } = useComparison();

    if (comparisonList.length === 0) {
        return (
            <>
                <Navbar />
                <div className="text-center m-0"
                    style={{ height: "200px", maxHeight: "800px" }}>
                    <h3 className="mt-5">No products to compare.</h3>
                    <p>Please add products using the "Compare" button.</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
           
            <div className="container mt-4 mb-4">
                <h2 className="mb-4">Compare Products</h2>
                <div className="table-responsive">
                    <table className="table table-bordered align-middle text-center">
                        <thead className="table-light">
                            <tr>
                                <th>Feature</th>
                                {comparisonList.map((p) => (
                                    <th key={p.id}>
                                        <div className="d-flex flex-column align-items-center">
                                            <img
                                                src={Array.isArray(p.image) ? p.image[0] : p.image}
                                                alt={p.name}
                                                style={{ width: "120px", height: "120px", objectFit: "contain" }}
                                                onError={(e) => (e.target.src = defaultImage)}
                                            />
                                            <h6 className="mt-2">{p.name}</h6>
                                            <button
                                                className="btn btn-sm btn-outline-danger mt-1"
                                                onClick={() => toggleCompare(p)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Brand</strong></td>
                                {comparisonList.map((p) => (
                                    <td key={p.id}>{p.brand || "-"}</td>
                                ))}
                            </tr>
                            <tr>
                                <td><strong>Price</strong></td>
                                {comparisonList.map((p) => (
                                    <td key={p.id}>₹{p.price}</td>
                                ))}
                            </tr>
                            <tr>
                                <td><strong>Rating</strong></td>
                                {comparisonList.map((p) => (
                                    <td key={p.id}>
                                        {p.rating} ★
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td><strong>Sizes</strong></td>
                                {comparisonList.map((p) => (
                                    <td key={p.id}>{p.sizes ? p.sizes.join(", ") : "-"}</td>
                                ))}
                            </tr>
                            <tr>
                                <td><strong>Description</strong></td>
                                {comparisonList.map((p) => (
                                    <td key={p.id}>{p.description || "No description"}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ComparisonPage;
