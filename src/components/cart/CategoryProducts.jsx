import React from "react";
import { useParams } from "react-router-dom";
import productsData from "../../data/products/products.json"; // your dataset file
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
                <div className="row px-2 mx-2">
                    {filteredProducts.map((p) => (
                        <div className="col-lg-3 col-md-4 col-6 mb-4">
                            <ProductCard key={p.id} product={p} />
                        </div>

                    ))}
                </div>


            )}
        </div>
    );
};

export default CategoryProducts;

