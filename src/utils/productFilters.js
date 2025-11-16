import productsData from "../data/products/products.json";

export const getProductsByTag = (tag, limit = 8) => {
    return productsData.filter(p => p.tags?.includes(tag)).slice(0, limit);
};

export const getDealsOfTheDay = (limit = 8) => {
    return productsData.filter(p => p.dealOfTheDay).slice(0, limit);
};

export const getNewArrivals = (limit = 8) => {
    return productsData.filter(p => p.isNewArrival).slice(0, limit);
};

export const getBestSellers = (limit = 8) => {
    return productsData.filter(p => p.tags?.includes("bestseller")).slice(0, limit);
};
