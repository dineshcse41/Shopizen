import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

function AuthButton() {
    const { user, logout } = useContext(AuthContext);

    return (
        <>
            {user ? (
                <button
                    onClick={logout}
                    className="btn btn-outline-light btn-sm"
                >
                    Logout
                </button>
            ) : (
                <Link to="/login-email" className="text-white text-decoration-none">
                    <span>Sign in</span>
                </Link>
            )}
        </>
    );
}

export default AuthButton;
