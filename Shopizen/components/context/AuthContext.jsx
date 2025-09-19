import React, { createContext, useState, useEffect, useContext } from "react";
import { useToast } from "./ToastContext"; // 👈 import toast

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const { showToast } = useToast(); // 👈 use toast

    // Load from localStorage
    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (loggedUser) setUser(loggedUser);
    }, []);

    //  Successful login
     const login = (userData) => {
        if (!userData || !userData.name) {
            //  Handle invalid credentials
            showToast("Invalid username or password. Please try again.", "error");
            return false;
        }

        setUser(userData);
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        showToast(`Welcome back, ${userData.name}! 🎉`, "success");
        return true;
    }; 

    //  Logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem("loggedInUser");
        showToast("You have been logged out.", "info");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
