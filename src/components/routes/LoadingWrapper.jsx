import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Preloader from "../../pages/testing/Preloader";

export default function LoadingWrapper({ children, delay = 300 }) {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), delay);
        return () => clearTimeout(timer);
    }, [location.pathname, delay]);

    if (loading) return <Preloader />;
    return children;
}
