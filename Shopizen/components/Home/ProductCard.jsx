import React from "react";
import homeData from "../../data/homeData.json";

const ProductCards = ({ startId, endId }) => {
    const { products } = homeData;

    // ✅ filter products by given ID range
    const filteredProducts = products.filter(
        (product) => product.id >= startId && product.id <= endId
    );

    // ✅ only take max 4 products
    const limitedProducts = filteredProducts.slice(0, 4);

    return (
        <>
            {limitedProducts.map((product) => (
                <div className="col-12 col-sm-6 col-md-3 " key={product.id}>
                    <div className="box">
                        <h3 className="pt-2">{product.title}</h3>
                        <div className="box-a">
                            {product.items.map((item, index) => (
                                <div key={index}>
                                    <img src={item.image} alt={item.name} />
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                        <a href={product.link}>{product.linkText}</a>
                    </div>
                </div>
            ))}
        </>
    );
};

export default ProductCards;
