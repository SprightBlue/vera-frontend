import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./presentation/context/AuthContext";
import Login from "./presentation/pages/Login";
import Register from "./presentation/pages/Register";
import Dashboard from "./presentation/pages/dashboard/Dashboard";
import Settings from "./presentation/pages/settings/Settings";
import AlertsView from "./components/AlertsView";
import {AnalysisPage} from "./features/analysis/views/AnalysisPage";
import Persons from "./presentation/pages/persons/Persons.tsx";
import PersonDetail from "./presentation/pages/persons/PersonDetail.tsx";
import PersonConfiguration from "./presentation/pages/persons/PersonConfiguration.tsx";
import ManualView from "./presentation/pages/manual/ManualView.tsx";
import AlertDetail from "./presentation/pages/alerts/AlertDetail.tsx";
import Contacts from "./presentation/pages/contacts/Contacts";

function PrivateRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Públicas */}
                <Route
                    path="/"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/logout"
                    element={<Login />}
                />

                <Route
                    path="/analysis"
                    element={<AnalysisPage/>}
                />

                {/* Privadas */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/persons"
                    element={<Persons />}
                />

                <Route
                    path="/persons/:id"
                    element={<PersonDetail />}
                />

                <Route
                    path="/persons/personConfig"
                    element={<PersonConfiguration />}
                />

                <Route
                    path="/alerts"
                    element={<PrivateRoute><AlertsView /></PrivateRoute>}
                />

                <Route
                    path="/alerts/:alertId"
                    element={<AlertDetail />}
                />

                <Route
                    path="/contacts"
                    element={<PrivateRoute><Contacts /></PrivateRoute>}
                />

                <Route
                    path="/settings"
                    element={<Settings />}
                />

                <Route 
                    path="/manual" 
                    element={<ManualView />} 
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;