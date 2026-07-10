import { useState } from 'react';
import { useAuth } from '@/presentation/context/AuthContext.tsx';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard.ts';
import Sidebar from '@/presentation/components/Sidebar';
import Header from '@/presentation/components/Header';
import CreateProtectedPersonModal from '@/presentation/components/protected-persons/CreateProtectedPersonModal';
import { DashboardBanner } from '../components/DashboardBanner';
import { DashboardStats } from '../components/DashboardStats';
import { DashboardHero } from '../components/DashboardHero';
import { Sparkles, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const { user } = useAuth();
    const { data, loading, error, refetch } = useDashboard();
    const [showModal, setShowModal] = useState<boolean>(false);
    const navigate = useNavigate();

    // Ahora determinamos si tiene protegidos mediante la existencia del último contacto vinculado
    const hasProtected = data ? !!data.latestTrustContact : false;
    const currentRole = (user?.role === 'PROTECTED' || user?.role === 'CARER') ? user.role : 'CARER';

    // El Hero toma el control del espacio si es Cuidador y todavía no vinculó a nadie
    const shouldShowHero = !loading && !error && currentRole === 'CARER' && !hasProtected;

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050816] text-slate-100 font-sans antialiased select-none">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56">
                <Header
                    userName={user?.fullName ?? "Usuario"}
                    title="Centro de Control"
                />

                <main className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1rem,2vw,3rem)] py-[clamp(1rem,1.8vw,2.5rem)] flex flex-col justify-between">
                    <div className="mx-auto max-w-480 w-full flex-1 flex flex-col gap-[clamp(1.2rem,1.8vw,2rem)] animate-fade-in">

                        {currentRole === "CARER" ? (
                            <DashboardBanner
                                title="Cuidá a los que más querés"
                                description="Agregá a un familiar para protegerlo. Revisaremos sus mensajes para avisarte si intentan estafarlo."
                                buttonLabel="Proteger a Alguien"
                                buttonIcon={UserPlus}
                                buttonVariant="info"
                                onClickAction={() => setShowModal(true)}
                            />
                        ) : (
                            <DashboardBanner
                                title="Tu tranquilidad es lo primero"
                                description="¿Dudas con un mensaje o enlace sospechoso? Verificalo acá al instante para saber si es seguro."
                                buttonLabel="Revisar Mensaje"
                                buttonIcon={Sparkles}
                                buttonVariant="purple"
                                onClickAction={() => navigate("/ai-center")}
                            />
                        )}

                        {/* SECCIÓN MÉTRICAS / HERO */}
                        {shouldShowHero ? (
                            <DashboardHero onAddProtectedClick={() => setShowModal(true)} />
                        ) : (
                            <DashboardStats
                                loading={loading}
                                error={error}
                                data={data}
                                refetch={refetch}
                                role={currentRole}
                                hasProtected={hasProtected}
                            />
                        )}

                    </div>
                </main>
            </div>

            {/* MODAL GLOBAL DE ASIGNACIÓN */}
            {showModal && (
                <CreateProtectedPersonModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        void refetch(); // Ejecuta una recarga HTTP limpia del estado actual del panel
                    }}
                />
            )}
        </div>
    );
}

export default Dashboard;