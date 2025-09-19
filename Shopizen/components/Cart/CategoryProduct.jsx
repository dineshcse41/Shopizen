import React from "react";
import { useParams } from "react-router-dom";
import productsData from "../../data/product_sample.json"; // your dataset file
import ProductCard from "../ProductCard/ProductCard"; // reusable product display

const CategoryProducts = () => {
    const { category } = useParams();

    //  Filter dataset
    const filteredProducts = productsData.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
    );

    return (
        <div className=" mt-4">
            <h3 className="m-2">Products in {category}</h3>
            {filteredProducts.length === 0 ? (
                <p>No products found in this category.</p>
            ) : (
                    <div className="d-flex col col-12 col-md-9 gap-3 m-2">
                    {filteredProducts.map((p) => (
                        
                        <ProductCard product={p} key={p.id} />
                        
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryProducts;
