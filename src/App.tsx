import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./presentation/context/AuthContext";
import Home from "./presentation/pages/Home";
import Login from "./presentation/pages/Login";
import Register from "./presentation/pages/Register";
import Dashboard from "./presentation/pages/dashboard/Dashboard";
import Settings from "./presentation/pages/settings/Settings";
import AlertsView from "./components/AlertsView";

function PrivateRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/alerts" element={<PrivateRoute><AlertsView /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;