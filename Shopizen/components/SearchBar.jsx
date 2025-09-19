import React, { useState, useEffect, useRef } from "react";
/* import "./SearchBar.css"; */

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Load search history from localStorage
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(storedHistory);
  }, []);

  // Save history to localStorage
  const saveSearchHistory = (term) => {
    let updatedHistory = [...searchHistory];
    const existingIndex = updatedHistory.findIndex(item => item.term === term);

    if (existingIndex > -1) {
      // increase frequency + move to top (recent)
      updatedHistory[existingIndex].count += 1;
      const [existing] = updatedHistory.splice(existingIndex, 1);
      updatedHistory.unshift(existing);
    } else {
      // new term at top
      updatedHistory.unshift({ term, count: 1 });
    }

    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === "") {
      // show recent searches when empty
      setFilteredSuggestions(searchHistory);
    } else {
      const filtered = searchHistory.filter(item =>
        item.term.toLowerCase().includes(value)
      );

      // put exact match first, then others (keeping recency/frequency order)
      const exact = filtered.filter(item => item.term.toLowerCase() === value);
      const others = filtered.filter(item => item.term.toLowerCase() !== value);

      setFilteredSuggestions([...exact, ...others]);

    }

    setShowSuggestions(true);
  };

  // Show recent searches when user clicks
  const handleFocus = () => {
    if (searchTerm === "") {
      setFilteredSuggestions(searchHistory);
      setShowSuggestions(true);
    }
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      saveSearchHistory(searchTerm);
      setSearchTerm("");
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // allow click
        />
        <button type="submit">Search</button>
      </form>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="suggestions-list">
          {filteredSuggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                setSearchTerm(item.term);
                saveSearchHistory(item.term);
                setShowSuggestions(false);
              }}
            >
              {item.term}{" "}
              <span className="badge">{item.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
