// src/components/category/CategoryProducts.jsx
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import productsData from "../../data/products/products.json";
import ProductCard from "../ProductCard/ProductCard";

const CategoryProducts = () => {
  const { category, subcategory } = useParams();
  const [searchParams] = useSearchParams();

  // Special filters from query params
  const isNewArrival = searchParams.get("isNewArrival") === "true";
  const dealOfTheDay = searchParams.get("dealOfTheDay") === "true";
  const midSeasonSale = searchParams.get("midSeasonSale") === "true";
  const brand = searchParams.get("brand");
  const tagParam = searchParams.get("tag");
  const discount = parseInt(searchParams.get("discount") || "0");

  // Filter products based on category, subcategory, and query params
  const filteredProducts = productsData.filter((p) => {
    const categoryMatch =
      category === "all" ||
      p.category?.toLowerCase() === category.toLowerCase();

    const subCategoryMatch = subcategory
      ? p.subCategory?.toLowerCase() === subcategory.toLowerCase()
      : true;

    const brandMatch = brand
      ? p.brand?.toLowerCase() === brand.toLowerCase()
      : true;

    const tagMatch = tagParam
      ? p.tags?.map((t) => t.toLowerCase()).includes(tagParam.toLowerCase())
      : true;

    const isNewArrivalMatch = isNewArrival ? p.isNewArrival : true;
    const dealOfTheDayMatch = dealOfTheDay ? p.dealOfTheDay : true;
    const midSeasonSaleMatch = midSeasonSale ? p.midSeasonSale : true;
    const discountMatch = discount > 0 ? p.discount >= discount : true;

    return (
      categoryMatch &&
      subCategoryMatch &&
      brandMatch &&
      tagMatch &&
      isNewArrivalMatch &&
      dealOfTheDayMatch &&
      midSeasonSaleMatch &&
      discountMatch
    );
  });

  return (
    <div className="mt-4">
      <h5 className="ms-3">
        {category.charAt(0).toUpperCase() + category.slice(1)}
        {subcategory ? ` > ${subcategory}` : ""}
      </h5>

      {filteredProducts.length === 0 ? (
        <div className="m-4" style={{ height: "143px" }}>
          <p>No products found.</p>
        </div>
      ) : (
        <div className="row px-2 mx-2">
          {filteredProducts.map((p) => (
            <div className="col-lg-3 col-md-4 col-12 mb-4" key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
