import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link for navigation
import ProductCards from "./ProductCards";
import SingleProductCard from "./SingleProductCard";
import productsData from "../../data/products/products.json";

const ProductSection = ({ productsRows }) => {
  const [activeFilters, setActiveFilters] = useState(
    productsRows.map(() => ({ category: null, subCategory: null }))
  );

  const handleFilterClick = (rowIndex, category, subCategory = null) => {
    const newFilters = [...activeFilters];
    newFilters[rowIndex] = { category, subCategory };
    setActiveFilters(newFilters);
  };

  return (
    <div className="mb-3">
      <div className="container-fluid p-0">
        {productsRows.map((row, rowIndex) => (
          <div className="product-row me-4" key={rowIndex}>
            {/* Product Sections */}
            <div className="product-sec">
              {row.map((section, i) => {
                const key = `${section.type}-${section.category || "all"}-${
                  section.subCategory || "all"
                }-${i}`;

                const filter = activeFilters[rowIndex];

               let filteredProducts = productsData.filter((p) => {
                 const matchCategory = section.category
                   ? p.category === section.category
                   : true;

                 const matchSubCategory = section.subcategory
                   ? p.subCategory === section.subcategory
                   : true;

                 const matchBrand = section.brand
                   ? p.brand?.toLowerCase() === section.brand.toLowerCase()
                   : true;

                 const matchTag = section.tag
                   ? p.tags
                       ?.map((t) => t.toLowerCase())
                       .includes(section.tag.toLowerCase())
                   : true;

                 return (
                   matchCategory && matchSubCategory && matchBrand && matchTag
                 );
               });


                // ✅ Dynamic navigation path for this section
                /* const categoryPath = section.subCategory
                  ? `/products/category/${section.category}/${section.subCategory}`
                  : `/products/category/${section.category}`; */

                let categoryPath;

                if (section.brand) {
                  categoryPath = `/products/category/${
                    section.category || "all"
                  }?brand=${section.brand}`;
                } else if (section.tag) {
                  categoryPath = `/products/category/${
                    section.category || "all"
                  }?tag=${section.tag}`;
                } else if (section.subcategory) {
                  categoryPath = `/products/category/${section.category}/${section.subcategory}`;
                } else {
                  categoryPath = `/products/category/${
                    section.category || "all"
                  }`;
                }
  

                if (section.type === "ProductCards") {
                  filteredProducts = filteredProducts.slice(0, 4); // Max 4 products

                  return (
                    <div key={key} className="product-card mb-3">
                      {section.title && (
                        <h3 className=" mt-2 ms-2">{section.title}</h3>
                      )}
                      <ProductCards products={filteredProducts} />
                      <Link
                        to={categoryPath}
                        className="view-link text-decoration-none text-primary  fw-semibold small"
                        
                      >
                        See More →
                      </Link>
                    </div>
                  );
                }

                // ✅ Single Product Card section
                else if (section.type === "SingleProductCard") {
                  const singleProduct = filteredProducts.slice(0, 1);

                  return (
                    <div
                      key={key}
                      className=" product-card  single-card mb-3"
                    >
                      {section.title && (
                        <h3 className=" mt-2 ms-2">{section.title}</h3>
                      )}
                      <SingleProductCard
                        products={singleProduct}
                        
                      />
                      <Link
                        to={categoryPath}
                        className=" view-link text-decoration-none text-primary  fw-semibold small"
                        
                      >
                        See More →
                      </Link>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
