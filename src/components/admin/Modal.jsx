// src/components/admin/Modal.jsx
import React, { useEffect, useState, useRef } from "react";
import "./Modal.css";

export default function Modal({ title, data, fields = [], onClose, onSave }) {
    const [form, setForm] = useState({});
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    // sync data whenever editing an existing item
    useEffect(() => {
        setForm(data ? { ...data } : {});
        if (data?.logo) setPreview(data.logo);
    }, [data]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "logo" && files && files[0]) {
            const file = files[0];
            if (!file.type.startsWith("image/")) {
                alert("Please select an image file!");
                return;
            }
            setForm(prev => ({ ...prev, [name]: file }));
            setPreview(URL.createObjectURL(file));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("Please drop an image file!");
            return;
        }
        setForm(prev => ({ ...prev, logo: file }));
        setPreview(URL.createObjectURL(file));
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    const stopProp = (e) => e.stopPropagation();

    return (
        <div className="custom-modal-backdrop" onClick={onClose}>
            <div className="custom-modal" onClick={stopProp} role="dialog" aria-modal="true">
                <div className="custom-modal-header">
                    <h4>{title}</h4>
                    <button className="custom-close-btn" onClick={onClose} aria-label="Close">×</button>
                </div>

                <form onSubmit={handleSubmit} className="custom-modal-body">
                    {fields.map((f) => (
                        <div className="custom-form-group" key={f}>
                            <label className="custom-label">{f.charAt(0).toUpperCase() + f.slice(1)}</label>

                            {f === "logo" ? (
                                <>
                                    <div
                                        className="drag-drop-area"
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="preview-image"
                                            />
                                        ) : (
                                            <span>Drag & drop an image or click to select</span>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        name="logo"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="hidden-file-input"
                                    />
                                </>
                            ) : (
                                <input
                                    type="text"
                                    name={f}
                                    value={form[f] ?? ""}
                                    onChange={handleChange}
                                    className="custom-input"
                                    required
                                />
                            )}
                        </div>
                    ))}

                    <div className="custom-modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
