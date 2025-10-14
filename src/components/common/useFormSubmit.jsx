import { useState, useEffect } from "react";

const useFormSubmit = (initialState = {}, apiUrl = "") => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        remember: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [users, setUsers] = useState([]);   // store users from JSON
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 🔹 Fetch users on mount
    useEffect(() => {
        if (apiUrl) {
            fetch(apiUrl)
                .then((res) => res.json())
                .then((data) => {
                    setUsers(data.users || []); // store users
                })
                .catch((err) => {
                    console.error("Error fetching users:", err);
                    setError("Failed to fetch users.");
                });
        }
    }, [apiUrl]);

    // 🔹 For inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };
    const toggleConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
    };
    // 🔹 Email login
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // simulate validation
        const foundUser = users.find(
            (user) =>
                user.email === formData.email &&
                user.password === formData.password
        );

        if (foundUser) {
            setResponse({ success: true, user: foundUser });
        } else {
            setError("Invalid credentials");
            setResponse({ success: false });
        }

        setLoading(false);
    };

    // 🔹 Check mobile exists
    const checkMobileRegistered = (mobile) => {
        return users.some((user) => user.mobile === mobile);
    };

    return {
        formData,
        showPassword,
        showConfirmPassword,
        togglePassword,
        toggleConfirmPassword,
        setFormData,
        handleChange,
        handleSubmit,
        checkMobileRegistered, // expose function for mobile login
        loading,
        error,
        response,
    };
};

export default useFormSubmit;