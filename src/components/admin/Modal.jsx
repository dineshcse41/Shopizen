// src/components/admin/Modal.jsx
import React, { useEffect, useState, useRef } from "react";
import "./Modal.css";
import { useToast } from "../context/ToastContext.jsx"; // ✅ Import your toast hook

export default function Modal({ title, data, fields = [], onClose, onSave }) {
  const [form, setForm] = useState({});
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { showToast } = useToast(); // ✅ Toast function

  // Sync data when editing an existing item
  useEffect(() => {
    setForm(data ? { ...data } : {});
    if (data?.logo) {
      if (typeof data.logo === "string") {
        setPreview(data.logo); // existing URL
      } else if (data.logo instanceof File) {
        setPreview(URL.createObjectURL(data.logo)); // uploaded file
      }
    } else {
      setPreview(null);
    }
  }, [data]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "logo" && files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        showToast(" Please select an image file!", "error");
        return;
      }
      setForm((prev) => ({ ...prev, [name]: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast(" Please drop an image file!", "warning");
      return;
    }

    setForm((prev) => ({ ...prev, logo: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    showToast(" Brand saved successfully!", "success"); // optional success message
  };

  const stopProp = (e) => e.stopPropagation();

  return (
    <div className="custom-modal-backdrop" onClick={onClose}>
      <div
        className="custom-modal"
        onClick={stopProp}
        role="dialog"
        aria-modal="true"
      >
        <div className="custom-modal-header">
          <h2>{title}</h2>
          <button
            className="custom-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="custom-modal-body">
          {fields.map((f) => (
            <div className="custom-form-group" key={f}>
              <label className="custom-label">
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </label>

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
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
