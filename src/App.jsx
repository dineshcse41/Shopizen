import React, { useEffect, useState } from "react";
import AppRoutes from "../src/routes/AppRoutes.jsx";
import MaintenancePage from "../src/pages/testing/MaintenancePage.jsx";
import Preloader from "../src/pages/testing/Preloader.jsx";


function App() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API delay
    const timer = setTimeout(() => {
      // Change this to true to simulate maintenance mode
      setIsMaintenance(false);
      setLoading(false);
    }, 1000); // simulate 1s network delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />;
  if (isMaintenance) return <MaintenancePage />;

  return (
    
      <AppRoutes /> 
    
  );
}

export default App;
