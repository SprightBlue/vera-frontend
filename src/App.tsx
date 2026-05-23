import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./presentation/pages/Home";
import Dashboard from "./presentation/pages/dashboard/Dashboard";
import Alerts from "./presentation/pages/alerts/Alerts";
import Settings from "./presentation/pages/settings/Settings";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/alerts"
                    element={<Alerts />}
                />

            
                <Route
                    path="/settings"
                    element={<Settings />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;