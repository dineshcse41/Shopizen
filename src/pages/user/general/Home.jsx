import React from 'react';
import ProductSection from '../../../components/home/ProductSection';
import ProductSlider from "../../../components/home/ProductSlider";
import "../general/Home.css";

function Home() {
    return (
        <>
           
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
