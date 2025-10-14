import React from "react";
import ErrorPage from "../../components/testing/ErrorPage.jsx";
function Forbidden403() {
    return (
        <ErrorPage
            code="403"
            title="Access Denied"
            message="You don’t have permission to access this page. If you believe this is a mistake, please contact support."
            image="https://cdn.dribbble.com/users/285475/screenshots/2095384/lock.gif"
            btnHome={true}
            btnSupport={true}
        />
    );
}

export default Forbidden403;
