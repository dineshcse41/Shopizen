import React from "react";
import defaultImage from "../../assets/product-default-image.png";

const SingleProductCard = ({ products}) => {


  return (
    <div className="single-product-grid">
      {products.map((product) => (
        <div className="single-product-item" key={product.id}>
          <div className="box box-c">
            <a href={`/product/${product.id}`}>
              <img
                src={product.image || product.images?.[0] || defaultImage}
                alt={product.name || product.title}
                onError={(e) => (e.target.src = defaultImage)}
              />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SingleProductCard;
