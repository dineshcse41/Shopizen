import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Layout.css";

const Layout = ({ children }) => {
    // Step 1: Add state for sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Step 2: Toggle function for Header’s button
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <>
            {/* Header */}
            <Header toggleSidebar={toggleSidebar} />

            {/* Sidebar + Main Content */}
            <div className="d-flex layout-container">
                {/* Step 3: Pass sidebar state and setter */}
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                {/* Main content */}
                <main className="flex-grow-1 layout-main p-0">
                    <div className="page-wrapper shadow-sm p-4">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
};

export default Layout;
