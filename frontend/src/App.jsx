import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import EndpointDetails from "./pages/EndpointDetails/EndpointDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/endpoint/:id" element={<EndpointDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
