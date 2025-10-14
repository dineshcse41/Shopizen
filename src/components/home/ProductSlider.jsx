import React from "react";
import homeData from "../../data/common/homeData.json";


const ProductSlider = ({ startId, endId, title }) => {
    const { productSlider } = homeData;

    const filteredProducts = productSlider.filter(
        (item) => item.id >= startId && item.id <= endId
    );

    return (
        <div className="sec-2 m-0 p-0">
            <div className="slide-sec">
                <div className="l-btn"><i className="bx bx-chevron-left"></i></div>
                <div className="r-btn"><i className="bx bx-chevron-right"></i></div>
                <h3>{title || "Popular Products"}</h3>

                <ul className="product-slide">
                    {filteredProducts.map((product) => (
                        <li key={product.id}>
                            <img src={product.image} alt={product.name} className="img-fluid" />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProductSlider;
