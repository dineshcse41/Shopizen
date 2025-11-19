import React, { createContext, useState, useEffect } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchHistory, setSearchHistory] = useState([]);

    // Load history from localStorage
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("searchHistory")) || [];
        setSearchHistory(stored);
    }, []);

    // Save to history (latest on top, unique)
    const addToHistory = (query) => {
        if (!query.trim()) return;
        const updated = [query, ...searchHistory.filter((q) => q !== query)];
        setSearchHistory(updated.slice(0, 10)); // keep max 10
        localStorage.setItem("searchHistory", JSON.stringify(updated.slice(0, 10)));
    };

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery, searchHistory, addToHistory }}>
            {children}
        </SearchContext.Provider>
    );
};
