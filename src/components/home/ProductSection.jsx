import React from 'react';
import Slider from '../home/Slider';
import ProductCards from '../home/ProductCards';
import SingleProductCard from '../home/SingleProductCard';

const ProductSection = ({ showSlider = true, sliderStartId, sliderEndId, productsRows }) => {
    return (
        <div className=" mb-3">
            <div className="container-fluid p-0">
                <div className="m-0 p-0">

                    {/* Optional Slider */}
                    {showSlider && sliderStartId && sliderEndId && (
                        <Slider startId={sliderStartId} endId={sliderEndId} />
                    )}

                    {/* Product Rows */}
                    {productsRows.map((row, index) => (
                        <div className="product-comp m-0 p-0 ms-2" key={index}>
                            {row.map((section, i) => {
                                if (section.type === 'ProductCards') {
                                    return <ProductCards key={i} startId={section.startId} endId={section.endId} />;
                                } else if (section.type === 'SingleProductCard') {
                                    return <SingleProductCard key={i} startId={section.startId} endId={section.endId} />;
                                } else return null;
                            })}
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default ProductSection;
