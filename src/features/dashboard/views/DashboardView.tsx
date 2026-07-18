import { useEffect, useState } from 'react';
import { useAuth } from '@/presentation/context/AuthContext';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import Sidebar from '@/features/shared/components/Sidebar';
import Header from '@/features/shared/components/Header';
import CreateProtectedPersonModal from '@/presentation/components/protected-persons/CreateProtectedPersonModal.tsx';
import { DashboardBanner } from '@/features/dashboard/components/DashboardBanner';
import { DashboardStats } from '@/features/dashboard/components/DashboardStats';
import { DashboardHero } from '@/features/dashboard/components/DashboardHero';
import { LoadingScreen } from "@/features/shared/components/LoadingScreen";
import { RetryScreen } from "@/features/shared/components/RetryScreen";
import { Sparkles, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { startDashboardTour } from "@/features/shared/utils/tours.ts";

export function DashboardView() {
    const { user } = useAuth();
    const { data, loading, error, refetch } = useDashboard();
    const [showModal, setShowModal] = useState<boolean>(false);
    const navigate = useNavigate();

    const currentRole = (user?.role === 'PROTECTED' || user?.role === 'CARER') ? user.role : 'CARER';

    // 100% Local: Controla si el usuario ya vio el Hero/interactuó con el modal
    const [firstVisitCompleted, setFirstVisitCompleted] = useState<boolean>(() => {
        return localStorage.getItem("dashboard_first_visit_completed") === "true";
    });

    // Si no se completó la visita localmente, se muestra el Hero
    const shouldShowHero = !firstVisitCompleted;

    // Disparador del Tour automático basado estrictamente en LocalStorage
    useEffect(() => {
        if (user?.role && !loading && data) {
            const tourCompleted = localStorage.getItem("tour_dashboard_completed") === "true";

            if (!tourCompleted) {
                const timer = setTimeout(() => {
                    try {
                        startDashboardTour(user.role);
                    } catch (err) {
                        console.error("Error iniciando el tour:", err);
                    }
                }, 600);
                return () => clearTimeout(timer);
            }
        }
    }, [user?.role, loading, data]);

    // En cuanto el usuario interactúa para abrir el modal, el Hero se oculta de inmediato
    const handleAddContactClick = () => {
        localStorage.setItem("dashboard_first_visit_completed", "true");
        setFirstVisitCompleted(true);
        setShowModal(true);
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050814] text-slate-100 antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56 relative z-10">
                <Header userName={user?.fullName ?? "Usuario"} title="Panel Principal" />

                <main className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1.5rem,3vw,3.5rem)] py-[clamp(1.5rem,2.5vw,3rem)] flex flex-col justify-between relative z-20 pointer-events-auto">
                    <div className="mx-auto max-w-7xl w-full flex-1 flex flex-col gap-[clamp(1.5rem,2.5vw,3rem)] animate-fade-in justify-center">
                        {loading ? (
                            <LoadingScreen />
                        ) : error ? (
                            <RetryScreen onRetry={refetch} />
                        ) : (
                            <>
                                {shouldShowHero ? (
                                    /* Primer login: muestra el Hero en pantalla y el Tour corre por encima */
                                    <DashboardHero onAddProtectedClick={handleAddContactClick} />
                                ) : (
                                    /* Una vez clickeado el modal: panel base permanente */
                                    <div className="flex flex-col gap-[clamp(1.5rem,2.5vw,3rem)] w-full">
                                        <DashboardBanner
                                            title={currentRole === "CARER" ? "Cuidá a los que más querés" : "Tu tranquilidad es lo primero"}
                                            description={currentRole === "CARER" ? "Agregá a un familiar para protegerlo." : "¿Dudas con un mensaje? Verificalo acá."}
                                            buttonLabel={currentRole === "CARER" ? "Agregar Contacto" : "Analizar Mensaje"}
                                            buttonIcon={currentRole === "CARER" ? UserPlus : Sparkles}
                                            buttonVariant="info"
                                            onClickAction={() => currentRole === "CARER" ? handleAddContactClick() : navigate("/analysis")}
                                        />
                                        <DashboardStats data={data!} role={currentRole} fullname={user?.fullName ?? "Usuario"} />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>

            {showModal && (
                <CreateProtectedPersonModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        localStorage.setItem("tour_dashboard_completed", "true");
                        localStorage.setItem("dashboard_first_visit_completed", "true");
                        setFirstVisitCompleted(true);
                        setShowModal(false);
                        void refetch();
                    }}
                />
            )}
        </div>
    );
}