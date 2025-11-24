import React, { useState } from "react";
import { Container, Card, Form, Row, Col, Button } from "react-bootstrap";
import Swal from "sweetalert2"; // import SweetAlert2
import "./PrivacySettings.css";

const PrivacySettings = () => {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    searchEngineIndexing: false,
    emailSharing: false,
    twoFactorAuth: true,
    activityStatus: true,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    console.log("Saved Privacy Settings:", settings);

    // SweetAlert2 popup
    Swal.fire({
      title: "Success!",
      text: "Privacy settings saved successfully!",
      icon: "success",
      confirmButtonColor: "#00b894",
      confirmButtonText: "OK",
    });

    // TODO: send settings to backend API
  };

  return (
    <div className="privacy-settings py-5">
      <h2 className="mb-4 text-center fw-bold text-gradient">
        Privacy Settings
      </h2>

      <Row className="gy-4 justify-content-center">
        <Col md={8}>
          <Card className="setting-card shadow-sm border-0 p-4">
            <h5 className="fw-bold mb-3">Profile Privacy</h5>
            <Form>
              <Form.Check
                type="switch"
                id="profile-visibility"
                label="Show my profile to other users"
                checked={settings.profileVisibility}
                onChange={() => handleToggle("profileVisibility")}
              />
              <Form.Check
                type="switch"
                id="search-engine-indexing"
                label="Allow search engines to index my profile"
                checked={settings.searchEngineIndexing}
                onChange={() => handleToggle("searchEngineIndexing")}
              />
              <Form.Check
                type="switch"
                id="email-sharing"
                label="Share my email with third-party apps"
                checked={settings.emailSharing}
                onChange={() => handleToggle("emailSharing")}
              />
            </Form>
          </Card>

          <Card className="setting-card shadow-sm border-0 p-4 mt-4">
            <h5 className="fw-bold mb-3">Security</h5>
            <Form>
              <Form.Check
                type="switch"
                id="two-factor-auth"
                label="Enable Two-Factor Authentication (2FA)"
                checked={settings.twoFactorAuth}
                onChange={() => handleToggle("twoFactorAuth")}
              />
              <Form.Check
                type="switch"
                id="activity-status"
                label="Show my activity status to others"
                checked={settings.activityStatus}
                onChange={() => handleToggle("activityStatus")}
              />
            </Form>
          </Card>

          <div className="text-end mt-3">
            <Button variant="success" onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PrivacySettings;
