import React, { useState } from "react";
import Table from "../../../components/admin/Table";
import notificationsData from "../../../data/notifications/notifications.json";

export default function NotificationManagement() {
    const [notifications, setNotifications] = useState(notificationsData);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const addNotification = () => {
        if (!title || !message) return alert("Enter title and message");
        const newNotification = {
            id: notifications.length + 1,
            title,
            message,
        };
        setNotifications([...notifications, newNotification]);
        setTitle("");
        setMessage("");
    };

    const deleteNotification = (id) => {
        if (window.confirm("Delete this notification?")) {
            setNotifications(notifications.filter((n) => n.id !== id));
        }
    };

    const columns = [
        { key: "id", title: "ID" },
        { key: "title", title: "Title" },
        { key: "message", title: "Message" },
        {
            key: "actions",
            title: "Actions",
            render: (n) => (
                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteNotification(n.id)}
                >
                    Delete
                </button>
            ),
        },
    ];

    return (
        <>
            <div className="m-3">
                <h2 className="page-title mb-3 text-center">Notification Management</h2>

                <div className="mb-3 flex gap-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={addNotification}>
                        Add
                    </button>
                </div>

                <Table columns={columns} data={notifications} />
            </div>
        </>
    );
}
