import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import ProductSection from '../../components/Home/ProductSection';
import ProductSlider from "../../components/Home/ProductSlider";
import "../../pages/General/HomePage.css";

function Home() {
  return (
    <>
      <Navbar />

      {/* Section with Slider */}
      <ProductSection
        showSlider={true}
        sliderStartId={1}
        sliderEndId={5}

        productsRows={[
          [
            { type: 'ProductCards', startId: 1, endId: 2 },
            { type: 'SingleProductCard', startId: 3, endId: 4 },
          ],
          [
            { type: 'ProductCards', startId: 3, endId: 6 },
          ],
        ]}
      />

      <ProductSlider startId={1} endId={12} title="Popular Products" />
      
      {/* Section without Slider */}
      <ProductSection
        showSlider={false}
        productsRows={[
          [
            { type: 'ProductCards', startId: 1, endId: 2 },
            { type: 'SingleProductCard', startId: 3, endId: 4 },
          ],
          [
            { type: 'ProductCards', startId: 3, endId: 6 },
          ],
        ]}
      />

      {/* Popular Slider */}
      <ProductSlider startId={1} endId={12} title="Popular Products" />
    </>
  );
}

export default Home;
