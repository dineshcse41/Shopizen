import React from "react";
import PolicyPage from "./PolicyPage";
import privacyData from "../../../data/policies/privacy.json";

const Privacy = () => {
    return <PolicyPage jsonData={privacyData} />;
};

export default Privacy;
