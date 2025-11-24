import React from "react";
import ErrorPage from "../../components/testing/ErrorPage.jsx";

function NotFound404() {
    return (
        <ErrorPage
            code="404"
            title="Oops! Page Not Found"
            message="The page you’re looking for doesn’t exist or has been moved."
            image="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
            btnHome={true}
            btnSupport={false}
        />
    );
}

export default NotFound404;
