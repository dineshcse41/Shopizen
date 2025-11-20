import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Badge,
  Tab,
  Tabs,
} from "react-bootstrap";
import Swal from "sweetalert2";
import { useAuth } from "../../../components/context/AuthContext";
import { useUserNotifications } from "../../../components/context/UserNotificationContext";
import "./Notifications.css";

const Notifications = () => {
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead, deleteNotification } =
    useUserNotifications();
  const [key, setKey] = useState("All");
  const [notificationTypes, setNotificationTypes] = useState([]);

  // Extract unique notification types
  useEffect(() => {
    if (!notifications) return;
    const typesFromData = [
      "All",
      ...new Set(notifications.map((notif) => notif.type || "General")),
    ];
    setNotificationTypes(typesFromData);
  }, [notifications]);

  const handleMarkAll = (type) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will mark all notifications as read.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00b894",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark all as read!",
    }).then((result) => {
      if (result.isConfirmed) {
        if (type === "All") {
          markAllAsRead();
        } else {
          notifications
            .filter((n) => (n.type || "General") === type)
            .forEach((n) => markAsRead(n.id, n.isGlobal));
        }
        Swal.fire({
          title: "Success!",
          text: "Notifications marked as read.",
          icon: "success",
          confirmButtonColor: "#00b894",
        });
      }
    });
  };

  const handleDelete = (notif) => {
    Swal.fire({
      title: "Delete notification?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteNotification(notif.id, notif.isGlobal);
        Swal.fire("Deleted!", "Notification has been deleted.", "success");
      }
    });
  };

  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Displayed notifications: global always, personal only if user is logged in
  const displayedNotifications = user
    ? notifications
    : notifications.filter((n) => n.isGlobal);

  const filterNotifications = (type) =>
    type === "All"
      ? displayedNotifications
      : displayedNotifications.filter(
          (notif) => (notif.type || "General") === type
        );

  if (!displayedNotifications.length) {
    return (
      <Container className="notifications-page py-5 text-center">
        <h4 className="text-muted">No notifications available.</h4>
      </Container>
    );
  }

  return (
    <Container className="notifications-page py-5">
      <h2 className="mb-4 fw-bold text-gradient text-center">
        My Notifications
      </h2>

      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
        justify
      >
        {notificationTypes.map((type) => (
          <Tab
            eventKey={type}
            title={`${type} (${filterNotifications(type).length})`}
            key={type}
          >
            <div className="mb-3 text-end">
              <Button
                size="sm"
                variant="success"
                onClick={() => handleMarkAll(type)}
              >
                Mark All as Read
              </Button>
            </div>

            <Row className="g-3">
              {filterNotifications(type).length === 0 ? (
                <p>No notifications available.</p>
              ) : (
                filterNotifications(type).map((notif) => (
                  <Col md={12} key={notif.id}>
                    <Card
                      className={`notification-card shadow-sm ${
                        notif.isRead ? "read" : "unread"
                      } p-3`}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">
                            {notif.title || notif.message}{" "}
                            {notif.isGlobal ? (
                              <Badge bg="info" className="ms-2">
                                Global
                              </Badge>
                            ) : (
                              <Badge bg="primary" className="ms-2">
                                Personal
                              </Badge>
                            )}
                          </h6>
                          {notif.description && (
                            <p className="mb-1 text-muted">
                              {notif.description}
                            </p>
                          )}
                          <small className="text-muted">
                            {formatDate(notif.timestamp || notif.date)}
                          </small>
                        </div>
                        <div className="d-flex gap-2">
                          {!notif.isRead && (
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() =>
                                markAsRead(notif.id, notif.isGlobal)
                              }
                            >
                              {/*  Mark as Read */}
                              <i className="bi bi-check-square"></i>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(notif)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                          {notif.isRead && (
                            <Badge
                              bg="secondary"
                              style={{
                                width: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 0,
                              }}
                            >
                              <i className="bi bi-check-square-fill"></i>
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Tab>
        ))}
      </Tabs>
    </Container>
  );
};

export default Notifications;
