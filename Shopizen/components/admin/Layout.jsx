import React from "react";
import Sidebar from "./Sidebar";
import "./Layout.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Layout = ({ children }) => {
    return (
        <div className="d-flex layout-container">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <main className="flex-grow-1 layout-main">
                <div className="content-wrapper shadow-sm rounded  p-4">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
