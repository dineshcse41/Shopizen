import React from "react";
import PolicyPage from "./PolicyPage";
import termsData from "../../../data/policies/terms.json";

const Terms = () => {
    return <PolicyPage jsonData={termsData} />;
};

export default Terms;
