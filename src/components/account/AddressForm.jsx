import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

function AddressForm({ initialData = {}, onSubmit, mode }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        doorNumber: "",
        street: "",
        landmark: "",
        address: "",
        pincode: "",
        city: "",
        state: "",
    });

    useEffect(() => {
        if (initialData && JSON.stringify(initialData) !== JSON.stringify(formData)) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            alert(mode === "edit" ? "Address updated successfully!" : "Address added successfully!");
        } catch (error) {
            console.error("Error saving address:", error);
            alert("Something went wrong, please try again.");
        }
    };

    return (
        <Container className="address-form-container mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div className="address-form-card p-4 shadow rounded">
                        <h2 className="text-center mb-4">
                            {mode === "edit" ? "Edit Address" : "Add New Address"}
                        </h2>
                        <Form onSubmit={handleSubmit}>
                            {/* Name */}
                            <Form.Group controlId="formName" className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    required
                                />
                            </Form.Group>

                            {/* Phone */}
                            <Form.Group controlId="formPhone" className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    required
                                />
                            </Form.Group>

                            {/* Door Number */}
                            <Form.Group controlId="formDoorNumber" className="mb-3">
                                <Form.Label>Door Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="doorNumber"
                                    value={formData.doorNumber}
                                    onChange={handleChange}
                                    placeholder="Enter door/flat number"
                                    required
                                />
                            </Form.Group>

                            {/* Street */}
                            <Form.Group controlId="formStreet" className="mb-3">
                                <Form.Label>Street</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    placeholder="Enter street name"
                                    required
                                />
                            </Form.Group>

                            {/* Landmark */}
                            <Form.Group controlId="formLandmark" className="mb-3">
                                <Form.Label>Landmark</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleChange}
                                    placeholder="Enter nearby landmark"
                                />
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="formPincode" className="mb-3">
                                        <Form.Label>Pincode</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            placeholder="Enter pincode"
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="formCity" className="mb-3">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Enter city"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group controlId="formState" className="mb-3">
                                <Form.Label>State</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="Enter state"
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mt-3">
                                {mode === "edit" ? "Update Address" : "Save Address"}
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default AddressForm;
