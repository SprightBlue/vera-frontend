import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./presentation/pages/Home";
import Dashboard from "./presentation/pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;