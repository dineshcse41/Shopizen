import React, { createContext, useState, useEffect, useContext } from "react";

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Check localStorage on load
    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (loggedUser) setUser(loggedUser);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("loggedInUser");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);