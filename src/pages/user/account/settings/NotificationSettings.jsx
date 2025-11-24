import React, { useState } from "react";
import { Form, Card, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NotificationSettings.css";

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    email: {
      orders: true,
      promotions: false,
      surveys: true,
    },
    sms: {
      orders: true,
      promotions: false,
    },
    whatsapp: {
      orders: true,
      promotions: true,
    },
    push: {
      appUpdates: true,
      recommendations: false,
      securityAlerts: true,
    },
  });

  const handleToggle = (category, type) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type],
      },
    }));
  };

  return (
    <div className="notification-settings p-4 ">
      <h2 className=" mb-4 text-center fw-bold text-gradient">
        Notification Settings
      </h2>

      <Row className="gy-4">
        {/* ===== EMAIL ===== */}
        <Col md={6}>
          <Card className="setting-card shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold text-primary mb-3">Email Notifications</h5>
              <p className="small text-muted">
                Important account notifications and reminders cannot be turned
                off.
              </p>
              <Form>
                <Form.Check
                  type="switch"
                  id="email-orders"
                  label="Order Updates (Shipping & Delivery)"
                  checked={settings.email.orders}
                  onChange={() => handleToggle("email", "orders")}
                />
                <Form.Check
                  type="switch"
                  id="email-promotions"
                  label="Promotions (Exclusive deals & campaigns)"
                  checked={settings.email.promotions}
                  onChange={() => handleToggle("email", "promotions")}
                />
                <Form.Check
                  type="switch"
                  id="email-surveys"
                  label="Customer Surveys (Help us improve)"
                  checked={settings.email.surveys}
                  onChange={() => handleToggle("email", "surveys")}
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* ===== SMS ===== */}
        <Col md={6}>
          <Card className="setting-card shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold text-success mb-3">SMS Notifications</h5>
              <p className="small text-muted">
                Important account notifications and reminders cannot be turned
                off.
              </p>
              <Form>
                <Form.Check
                  type="switch"
                  id="sms-orders"
                  label="Order Updates"
                  checked={settings.sms.orders}
                  onChange={() => handleToggle("sms", "orders")}
                />
                <Form.Check
                  type="switch"
                  id="sms-promotions"
                  label="Promotions (Offers & discounts)"
                  checked={settings.sms.promotions}
                  onChange={() => handleToggle("sms", "promotions")}
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* ===== WHATSAPP ===== */}
        <Col md={6}>
          <Card className="setting-card shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold text-success mb-3">
                WhatsApp Notifications
              </h5>
              <p className="small text-muted">
                Important account notifications and reminders cannot be turned
                off.
              </p>
              <Form>
                <Form.Check
                  type="switch"
                  id="whatsapp-orders"
                  label="Order Updates (Shipping & Delivery)"
                  checked={settings.whatsapp.orders}
                  onChange={() => handleToggle("whatsapp", "orders")}
                />
                <Form.Check
                  type="switch"
                  id="whatsapp-promotions"
                  label="Promotions (Exclusive updates)"
                  checked={settings.whatsapp.promotions}
                  onChange={() => handleToggle("whatsapp", "promotions")}
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* ===== PUSH ===== */}
        <Col md={6}>
          <Card className="setting-card shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold text-info mb-3">
                Push Notifications (App)
              </h5>
              <p className="small text-muted">
                Manage alerts from our mobile or web app.
              </p>
              <Form>
                <Form.Check
                  type="switch"
                  id="push-appUpdates"
                  label="App Updates (New features & maintenance)"
                  checked={settings.push.appUpdates}
                  onChange={() => handleToggle("push", "appUpdates")}
                />
                <Form.Check
                  type="switch"
                  id="push-recommendations"
                  label="Recommendations (Personalized content)"
                  checked={settings.push.recommendations}
                  onChange={() => handleToggle("push", "recommendations")}
                />
                <Form.Check
                  type="switch"
                  id="push-securityAlerts"
                  label="Security Alerts (Login & account safety)"
                  checked={settings.push.securityAlerts}
                  onChange={() => handleToggle("push", "securityAlerts")}
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NotificationSettings;
