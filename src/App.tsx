import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/presentation/context/AuthContext";

import Login from "@/presentation/pages/Login";
import Register from "@/presentation/pages/Register";
import Dashboard from "@/features/dashboard/views/Dashboard.tsx";
import Settings from "@/presentation/pages/settings/Settings";
import { AlertsList } from "@/features/alerts/views/AlertsList.tsx";
import AnalysisPage from "@/features/analysis/views/AnalysisPage";
import Persons from "@/presentation/pages/persons/Persons";
import PersonDetail from "@/presentation/pages/persons/PersonDetail";
import PersonConfiguration from "@/presentation/pages/persons/PersonConfiguration";
import ManualView from "@/presentation/pages/manual/ManualView";
import { AlertDetail } from "@/features/alerts/views/AlertDetail";
import Contacts from "@/presentation/pages/contacts/Contacts";
import ForgotPassword from "@/presentation/pages/ForgotPassword";
import ResetPassword from "@/presentation/pages/ResetPassword";
import Incidents from "@/presentation/pages/incidents/IncidentsPage";
import VerifyEmail from "@/presentation/pages/VerifyEmail";
import TermsAndConditions from "@/presentation/pages/TermsAndConditions";
import ChatPage from "@/features/chats/view/ChatPage";
import { AICenterPage } from "@/features/AiCenterPage";
import { MonitoringCenterPage } from "@/features/MonitoringCenterPage";
import AcceptInvitePage from "@/presentation/pages/invite/AcceptInvitePage";
import MyCarers from "@/presentation/pages/persons/My-Carers";
import TrainingPage from "@/features/training/views/TrainingPage";
import { AnalysisList } from "@/features/analysis/views/AnalysisList";
import { AnalysisDetail } from "@/features/analysis/views/AnalysisDetail.tsx";

import { LocationProvider } from "@/features/location/hooks/LocationContext.tsx";

function PrivateRoute() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading && !isAuthenticated) {
        return <div className="h-screen w-screen bg-[#070B1A] flex items-center justify-center text-slate-400">Verificando credenciales...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

interface RoleRouteProps {
    allowedRoles: string[];
}
function RoleRoute({ allowedRoles }: RoleRouteProps) {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) return null;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const hasRole = user?.role && allowedRoles.includes(user.role);
    return hasRole ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

function App() {
    return (
        <BrowserRouter>
            <LocationProvider>
                <Routes>
                    {/* --- RUTAS PÚBLICAS --- */}
                    <Route path="/" element={<Register />} />
                    <Route path="/terms" element={<TermsAndConditions />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/invite/:token" element={<AcceptInvitePage />} />

                    {/* --- RUTAS PRIVADAS --- */}
                    <Route element={<PrivateRoute />}>

                        {/* Rutas Compartidas */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/ai-center" element={<AICenterPage />} />
                        <Route path="/analysis" element={<AnalysisPage />} />
                        <Route path="/chat" element={<ChatPage />} />
                        <Route path="/persons" element={<Persons />} />
                        <Route path="/persons/:id" element={<PersonDetail />} />
                        <Route path="/persons/personConfig" element={<PersonConfiguration />} />
                        <Route path="/analysis-list" element={<AnalysisList />} />
                        <Route path="/analysis/:id" element={<AnalysisDetail />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/manual" element={<ManualView />} />
                        <Route path="/incidents" element={<Incidents />} />
                        <Route path="/training" element={<TrainingPage />} />

                        {/* Filtro Exclusivo: CARER ONLY */}
                        <Route element={<RoleRoute allowedRoles={['CARER']} />}>
                            <Route path="/alerts" element={<AlertsList />} />
                            <Route path="/alerts/:alertId" element={<AlertDetail />} />
                            <Route path="/monitoring-center" element={<MonitoringCenterPage />} />
                        </Route>

                        {/* Filtro Exclusivo: PROTECTED ONLY */}
                        <Route element={<RoleRoute allowedRoles={['PROTECTED']} />}>
                            <Route path="/my-carers" element={<MyCarers />} />
                        </Route>

                    </Route>

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </LocationProvider>
        </BrowserRouter>
    );
}

export default App;