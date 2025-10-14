import React, { createContext, useContext, useState, useEffect } from "react";

const ComparisonContext = createContext();

export const ComparisonProvider = ({ children }) => {
    const [comparisonList, setComparisonList] = useState(() => {
        const saved = localStorage.getItem("comparisonList");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("comparisonList", JSON.stringify(comparisonList));
    }, [comparisonList]);

    const addToComparison = (product) => {
        setComparisonList((prev) => {
            if (prev.find((p) => p.id === product.id)) return prev;
            return [...prev, product];
        });
    };

    const removeFromComparison = (id) => {
        setComparisonList((prev) => prev.filter((p) => p.id !== id));
    };

    const toggleCompare = (product) => {
        setComparisonList((prev) => {
            if (prev.find((p) => p.id === product.id)) {
                return prev.filter((p) => p.id !== product.id);
            } else {
                if (prev.length >= 3) {
                    alert("You can compare up to 3 products only!");
                    return prev;
                }
                return [...prev, product];
            }
        });
    };


    const clearComparison = () => {
        setComparisonList([]);
        localStorage.removeItem("comparisonList");
    };

    return (
        <ComparisonContext.Provider
            value={{
                comparisonList,
                addToComparison,
                removeFromComparison,
                toggleCompare,
                clearComparison,
            }}
        >
            {children}
        </ComparisonContext.Provider>
    );
};

export const useComparison = () => useContext(ComparisonContext);
