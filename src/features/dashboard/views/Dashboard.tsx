import { useState } from 'react';
import { useAuth } from '@/presentation/context/AuthContext.tsx';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard.ts';
import Sidebar from '@/presentation/components/Sidebar';
import Header from '@/presentation/components/Header';
import CreateProtectedPersonModal from '@/presentation/components/protected-persons/CreateProtectedPersonModal';
import { DashboardBanner } from '@/features/dashboard/components/DashboardBanner';
import { DashboardStats } from '@/features/dashboard/components/DashboardStats';
import { DashboardHero } from '@/features/dashboard/components/DashboardHero';
import { Sparkles, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
    const { user } = useAuth();
    const { data, loading, error, refetch } = useDashboard();
    const [showModal, setShowModal] = useState<boolean>(false);
    const navigate = useNavigate();

    const currentRole = (user?.role === 'PROTECTED' || user?.role === 'CARER') ? user.role : 'CARER';
    const hasContact = !!data?.latestTrustContact;

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050816] text-slate-100 font-sans antialiased select-none">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56">
                <Header
                    userName={user?.fullName ?? "Usuario"}
                    title={`Bienvenido a Vera, ${user?.fullName ?? "Usuario"}`}
                />

                <main className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1rem,2vw,3rem)] py-[clamp(1rem,1.8vw,2.5rem)] flex flex-col">
                    <div className="mx-auto max-w-480 w-full flex-1 flex flex-col gap-[clamp(1.2rem,1.8vw,2rem)] animate-fade-in justify-center">

                        {loading ? (
                            <DashboardStats
                                loading={loading}
                                error={error}
                                data={data}
                                refetch={refetch}
                                role={currentRole}
                                hasProtected={hasContact}
                                fullname={user?.fullName ?? "Usuario"}
                            />
                        ) : !hasContact && !error ? (
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
                                        description="¿Dudas con un mensaje o enlace sospechoso? Verificalo acá al instante para saber si es seguro."
                                        buttonLabel="Analizar Mensaje"
                                        buttonIcon={Sparkles}
                                        buttonVariant="info"
                                        onClickAction={() => navigate("/ai-center")}
                                    />
                                )}

                                <DashboardStats
                                    loading={loading}
                                    error={error}
                                    data={data}
                                    refetch={refetch}
                                    role={currentRole}
                                    hasProtected={hasContact}
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