import React from "react";
import defaultImage from "../../assets/product-default-image.png";

const ProductCards = ({ products }) => {
  const limitedProducts = products.slice(0, 4); // max 4 products

  return (
    <>
      <div className="product-card-row">
        {limitedProducts.slice(0, 4).map((product) => (
          <div className="col-6" key={product.id}>
            <div className="box text-center">
              <div className="box-a">
                <a href={`/product/${product.id}`}>
                  <img
                    src={product.image || product.images?.[0] || defaultImage}
                    alt={product.name || product.title}
                    onError={(e) => (e.target.src = defaultImage)}
                    className="img-fluid"
                  />
                </a>
                <span className="d-block mt-2">
                  {product.name || product.title}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductCards;
