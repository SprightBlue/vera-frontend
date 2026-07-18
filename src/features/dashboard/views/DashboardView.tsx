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

    // Leemos de localStorage de forma segura solo en la inicialización
    const [isFirstVisit] = useState<boolean>(() => {
        const visited = localStorage.getItem("dashboard_first_visit_completed");
        return !visited;
    });

    // Disparamos el tour SOLO si no se ha completado previamente en el navegador
    useEffect(() => {
        if (user?.role && !loading && data) {
            const tourCompleted = localStorage.getItem("tour_dashboard_completed");

            // Si el tour NO está completado, lo iniciamos automáticamente
            if (!tourCompleted) {
                const timer = setTimeout(() => {
                    startDashboardTour(user.role);
                }, 600);
                return () => clearTimeout(timer);
            }
        }
    }, [user?.role, loading, data]);

    const currentRole = (user?.role === 'PROTECTED' || user?.role === 'CARER') ? user.role : 'CARER';

    // CORRECCIÓN 1: Usamos encadenamiento opcional (?.) para evaluar de forma segura antes de que llegue la data
    const hasContact = !!data?.latestTrustContact;

    // Acción para cuando se abre el modal o se avanza: guardamos que ya no es la primera vez
    const handleAddContactClick = () => {
        localStorage.setItem("dashboard_first_visit_completed", "true");
        setShowModal(true);
    };

    // Condición limpia: Solo se muestra el Hero si no tiene contactos Y es su primera vez absoluta
    const shouldShowHero = !hasContact && isFirstVisit;

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
                        ) : shouldShowHero ? (
                            <DashboardHero onAddProtectedClick={handleAddContactClick} />
                        ) : (
                            <>
                                <DashboardBanner
                                    title={currentRole === "CARER" ? "Cuidá a los que más querés" : "Tu tranquilidad es lo primero"}
                                    description={currentRole === "CARER" ? "Agregá a un familiar para protegerlo." : "¿Dudas con un mensaje? Verificalo acá."}
                                    buttonLabel={currentRole === "CARER" ? "Agregar Contacto" : "Analizar Mensaje"}
                                    buttonIcon={currentRole === "CARER" ? UserPlus : Sparkles}
                                    buttonVariant="info"
                                    onClickAction={() => currentRole === "CARER" ? handleAddContactClick() : navigate("/analysis")}
                                />
                                {/* CORRECCIÓN 2: Le agregamos '!' a data indicando a TS que estamos 100% seguros de que aquí ya no es null */}
                                <DashboardStats data={data!} role={currentRole} fullname={user?.fullName ?? "Usuario"} />
                            </>
                        )}
                    </div>
                </main>
            </div>
            {showModal && (
                <CreateProtectedPersonModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        localStorage.setItem("dashboard_first_visit_completed", "true");
                        setShowModal(false);
                        void refetch();
                    }}
                />
            )}
        </div>
    );
}