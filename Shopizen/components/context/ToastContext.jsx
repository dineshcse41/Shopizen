// src/components/context/ToastContext.jsx
import React, { createContext, useContext } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const showToast = (message, type = "info") => {
        const toastContainer = document.getElementById("toast-container");
        if (!toastContainer) return;

        const toastEl = document.createElement("div");
        toastEl.className = `toast align-items-center text-bg-${type === "success" ? "success" : type === "error" ? "danger" : "secondary"
            } border-0`;
        toastEl.role = "alert";
        toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;

        toastContainer.appendChild(toastEl);

        const toast = new window.bootstrap.Toast(toastEl);
        toast.show();

        toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast container (only one in entire app) */}
            <div
                id="toast-container"
                className="toast-container position-fixed top-0 end-0 p-3"
                style={{ zIndex: 9999 }}
            ></div>
        </ToastContext.Provider>
    );
};
