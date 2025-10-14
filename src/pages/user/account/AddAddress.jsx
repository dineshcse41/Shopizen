import React from "react";
import AddressForm from "./AddressForm";
import { useUserNotifications } from "../../../components/context/UserNotificationContext.jsx";

function AddAddress() {
    const { addNotification } = useUserNotifications();

    const handleAdd = async (data) => {
        try {
            const response = await fetch("http://localhost:8000/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Failed to add address");

            await response.json();
            addNotification("Address added successfully", "success");
        } catch (error) {
            console.error(error);
            // Use toast component for errors
            alert("❌ Failed to add address"); // or your toast
        }
    };

    return <AddressForm mode="add" onSubmit={handleAdd} />;
}

export default AddAddress;
