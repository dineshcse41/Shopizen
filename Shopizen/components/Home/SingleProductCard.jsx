import React from "react";
import homeData from "../../data/homeData.json";

const SingleProductCard = ({ startId, endId }) => {
    const { singleProducts } = homeData;

    // ✅ filter based on range
    const filteredProducts = singleProducts.filter(
        (p) => p.id >= startId && p.id <= endId
    );

    return (
        <>
            {filteredProducts.map((product) => (
                <div className="col-12 col-sm-6 col-md-3 " key={product.id}>
                    <div className="box box-c">
                        <h3>{product.title}</h3>
                        <div>
                            <img src={product.image} alt={product.title} />
                        </div>
                        <a href={product.link}>{product.linkText || "See more"}</a>
                    </div>
                </div>
            ))}
        </>
    );
};

export default SingleProductCard;
