// src/pages/home/general/Home.jsx
import React from "react";


// Components
import Slider from "../../../components/home/Slider";
import ProductSlider from "../../../components/home/ProductSlider";
import ProductSection from "../../../components/home/ProductSection";

// Data
import productsData from "../../../data/products/products.json";
import defaultImage from "../../../assets/product-default-image.png";
// CSS
import "../general/Home.css";
import { useNavigate } from "react-router-dom";

const getImage = (product) => {
  try {
    if (product?.images?.length && product.images[0]) {
      return product.images[0];
    }
    return defaultImage;
  } catch {
    return defaultImage;
  }
};


// Filtered product lists
const newArrivals = productsData.filter((p) => p.isNewArrival).slice(0, 15);
const fashionProducts = productsData
  .filter((p) => p.category === "Fashion")
  .slice(0, 15);
const electronicsProducts = productsData
  .filter((p) => p.category === "Electronics")
  .slice(0, 15);

const topSellingProducts = productsData
  .filter((p) => p.tags?.includes("bestseller") || p.rating >= 4.5)
  .slice(0, 15);

const bigDiscountProducts = productsData
  .filter((p) => p.discount >= 50)
  .slice(0, 15);

// Click handler to navigate
const handleProductClick = (id) => {
  navigate(`/product/${id}`);
};


const getCategoryLink = ({
  category,
  subcategory,
  isNewArrival = false,
  dealOfTheDay = false,
  midSeasonSale = false,
  tag,
  discount,
  brand,
}) => {
  const base = `/products/category/${category.toLowerCase()}`;
  const path = subcategory ? `${base}/${subcategory.toLowerCase().replace(/\s+/g, '-')}` : base;

  const params = new URLSearchParams();
  if (isNewArrival) params.set("isNewArrival", true);
  if (dealOfTheDay) params.set("dealOfTheDay", true);
  if (midSeasonSale) params.set("midSeasonSale", true);
  if (tag) params.set("tag", tag);
  if (discount) params.set("discount", discount);
  if (brand) params.set("brand", brand);

  return `${path}?${params.toString()}`;
};


function Home() {

  

  return (
    <>
      <Slider />
      {/* Section without Slider */}
      <ProductSection
        productsRows={[
          [
            {
              type: "ProductCards",
              category: "Fashion",
              subcategory: "Men’s Footwear",
              title: "Best Selling Men’s Footwear",
            },
            {
              type: "ProductCards",
              category: "Bags",
              subcategory: "Women’s Bags",
              title: "Trending Women’s Bags",
            },
            {
              type: "SingleProductCard",
              category: "Electronics",
              title: "Featured Smartphone",
            },
            {
              type: "SingleProductCard",
              category: "Bags",
              title: "Top Pick Bag",
            },
          ],
        ]}
      />
      {/* New Arrivals */}
      <ProductSlider
        title="New Arrivals"
        products={newArrivals}
        getImage={getImage}
        onProductClick={handleProductClick}
        viewLink={getCategoryLink({ category: "all", isNewArrival: true })}
      />
      <ProductSection
        productsRows={[
          [
            {
              type: "ProductCards",
              category: "Fashion",
              subcategory: "Men’s Footwear",
              title: "Best Selling Men’s Footwear",
            },
            {
              type: "SingleProductCard",
              brand: "boAt",
              title: "boAt Best Sellers",
            },
            {
              type: "ProductCards",
              category: "Bags",
              subcategory: "Women’s Bags",
              title: "Trending Women’s Bags",
            },
            {
              type: "SingleProductCard",
              category: "Bags",
              title: "Top Pick Bag",
            },
          ],
        ]}
      />
      {/* Fashion */}
      <ProductSlider
        title="Fashion"
        products={fashionProducts}
        getImage={getImage}
        onProductClick={handleProductClick}
      />
      {/* Electronics */}
      <ProductSlider
        title="Electronics"
        products={electronicsProducts}
        getImage={getImage}
        onProductClick={handleProductClick}
      />
      {/* Top Selling Products */}
      <ProductSlider
        title="Top Selling Products"
        products={topSellingProducts}
        getImage={getImage}
        onProductClick={handleProductClick}
        viewLink={getCategoryLink({
          category: "all",
          tag: "bestseller",
          topSelling: true,
        })}
      />
      {/*  Mega Discount 50%+  */}
      <ProductSlider
        title="Mega Discount 50%+"
        products={bigDiscountProducts}
        getImage={getImage}
        onProductClick={handleProductClick}
        viewLink={getCategoryLink({ category: "all", discount: 50 })}
      />
    </>
  );
}

export default Home;
