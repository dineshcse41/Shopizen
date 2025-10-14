import React from "react";
import AddressForm from "../account/AddressForm";
import { useUserNotifications } from "../../../components/context/UserNotificationContext";

function EditAddress({ addressId }) {
    const { addNotification } = useUserNotifications();

    const handleEdit = async (data) => {
        try {
            const response = await fetch(`http://localhost:8000/addresses/${addressId}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Failed to update address");

            await response.json();
            addNotification("Address updated successfully", "success");
        } catch (error) {
            console.error(error);
            alert("❌ Failed to update address"); // or use your toast
        }
    };

    return <AddressForm mode="edit" onSubmit={handleEdit} />;
}

export default EditAddress;
