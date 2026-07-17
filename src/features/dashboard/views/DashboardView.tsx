import { useState } from 'react';
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

export function DashboardView() {
    const { user } = useAuth();
    const { data, loading, error, refetch } = useDashboard();
    const [showModal, setShowModal] = useState<boolean>(false);
    const navigate = useNavigate();

    const currentRole = (user?.role === 'PROTECTED' || user?.role === 'CARER') ? user.role : 'CARER';
    const hasContact = !!data?.latestTrustContact;

    return (
        <div
            className="flex h-screen w-screen overflow-hidden bg-[#050814] text-slate-100 antialiased select-none"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            <Sidebar />

            {/* Margen adaptativo unificado con el Sidebar del resto de vistas */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56 relative">
                <Header
                    userName={user?.fullName ?? "Usuario"}
                    title="Panel Principal"
                />

                {/* Padding fluido responsivo para el contenedor principal de la vista */}
                <main className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1.5rem,3vw,3.5rem)] py-[clamp(1.5rem,2.5vw,3rem)] flex flex-col justify-between relative z-10">
                    {/* Gap fluido responsivo entre componentes hijos del layout general */}
                    <div className="mx-auto max-w-7xl w-full flex-1 flex flex-col gap-[clamp(1.5rem,2.5vw,3rem)] animate-fade-in justify-center">

                        {loading ? (
                            <LoadingScreen />
                        ) : error !== null ? (
                            <RetryScreen onRetry={refetch} />
                        ) : !data ? null : !hasContact ? (
                            <DashboardHero onAddProtectedClick={() => setShowModal(true)} />
                        ) : (
                            <>
                                {currentRole === "CARER" ? (
                                    <DashboardBanner
                                        title="Cuidá a los que más querés"
                                        description="Agregá a un familiar para protegerlo. Revisaremos sus mensajes para avisarte si intentan estafarlo."
                                        buttonLabel="Agregar Contacto"
                                        buttonIcon={UserPlus}
                                        buttonVariant="info"
                                        onClickAction={() => setShowModal(true)}
                                    />
                                ) : (
                                    <DashboardBanner
                                        title="Tu tranquilidad es lo primero"
                                        description="¿Dudas con un message o enlace sospechoso? Verificalo acá al instante para saber si es seguro."
                                        buttonLabel="Analizar Mensaje"
                                        buttonIcon={Sparkles}
                                        buttonVariant="info"
                                        onClickAction={() => navigate("/analysis")}
                                    />
                                )}

                                <DashboardStats
                                    data={data}
                                    role={currentRole}
                                    fullname={user?.fullName ?? "Usuario"}
                                />
                            </>
                        )}

                    </div>
                </main>
            </div>

            {showModal && (
                <CreateProtectedPersonModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        void refetch();
                    }}
                />
            )}
        </div>
    );
}