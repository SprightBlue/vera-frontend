import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./presentation/context/AuthContext";
import Login from "./presentation/pages/Login";
import Register from "./presentation/pages/Register";
import Dashboard from "./presentation/pages/dashboard/Dashboard";
import Settings from "./presentation/pages/settings/Settings";
import {AlertsView} from "./features/alerts/Views/AlertsView.tsx";
import { AnalysisPage } from "./features/analysis/views/AnalysisPage";
import Persons from "./presentation/pages/persons/Persons.tsx";
import PersonDetail from "./presentation/pages/persons/PersonDetail.tsx";
import PersonConfiguration from "./presentation/pages/persons/PersonConfiguration.tsx";
import ManualView from "./presentation/pages/manual/ManualView.tsx";
import {AlertDetail} from "./features/alerts/Views/AlertDetail.tsx";
import Contacts from "./presentation/pages/contacts/Contacts";
import ForgotPassword from "./presentation/pages/ForgotPassword";
import ResetPassword from "./presentation/pages/ResetPassword";
import Incidents from "./presentation/pages/incidents/IncidentsPage.tsx";
import VerifyEmail from "./presentation/pages/VerifyEmail.tsx";
import TermsAndConditions from "./presentation/pages/TermsAndConditions";
import {ChatPage} from "./features/Chat/view/ChatPage.tsx";
import {AICenterPage} from "./features/AiCenterPage.tsx";
import AcceptInvitePage from "./presentation/pages/invite/AcceptInvitePage";
import MyCarers from "./presentation/pages/persons/My-Carers.tsx";

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
                    path="/terms"
                    element={<TermsAndConditions />}
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
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

                <Route
                    path="/verify-email"
                    element={<VerifyEmail />}
                />

                <Route
                    path="/invite/:token"
                    element={<AcceptInvitePage />}
                />
                


                {/* Privadas */}

                <Route path="/ai-center" 
                element={<PrivateRoute><AICenterPage /></PrivateRoute>} 
                />

                <Route
                    path="/analysis"
                    element={<PrivateRoute><AnalysisPage /></PrivateRoute>}
                />

                <Route
                    path="/chat"
                    element={<PrivateRoute><ChatPage /></PrivateRoute>}
                />

                <Route
                    path="/dashboard"
                    element={<PrivateRoute><Dashboard /></PrivateRoute>}
                />

                <Route
                    path="/persons"
                    element={<PrivateRoute><Persons /></PrivateRoute>}
                />

                <Route
                    path="/persons/:id"
                    element={<PrivateRoute><PersonDetail /></PrivateRoute>}
                />

                <Route
                    path="/persons/personConfig"
                    element={<PrivateRoute><PersonConfiguration /></PrivateRoute>}
                />

                <Route
                    path="/alerts"
                    element={<PrivateRoute><AlertsView /></PrivateRoute>}
                />

                <Route
                    path="/alerts/:alertId"
                    element={<PrivateRoute><AlertDetail /></PrivateRoute>}
                />

                <Route
                    path="/contacts"
                    element={<PrivateRoute><Contacts /></PrivateRoute>}
                />

                <Route
                    path="/settings"
                    element={<PrivateRoute><Settings /></PrivateRoute>}
                />

                <Route
                    path="/manual"
                    element={<PrivateRoute><ManualView /></PrivateRoute>}
                />

                <Route
                    path="/incidents"
                    element={<PrivateRoute><Incidents /></PrivateRoute>}
                />

                <Route
                    path="/my-carers"
                    element={<PrivateRoute><MyCarers/></PrivateRoute>}
                />


            </Routes>

        </BrowserRouter>
    );
}

export default App;