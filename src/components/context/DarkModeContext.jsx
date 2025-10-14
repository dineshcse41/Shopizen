import React, { createContext, useState, useContext } from "react";

export const DarkModeContext = createContext(); // <-- named export

export const DarkModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
        document.body.classList.toggle("bg-dark", !darkMode);
        document.body.classList.toggle("text-light", !darkMode);
    };

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => useContext(DarkModeContext);
