import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";

import Home from "./Pages/Home";
import Privacy from "./Pages/Privacy";
import Terms from "./Pages/Terms";
import DataDeletion from "./Pages/DataDeletion";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/data-deletion" element={<DataDeletion />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
