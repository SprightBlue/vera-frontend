import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import StatCard from "../../components/dashboard/StatCard";
import RecentAlerts from "../../components/dashboard/RecentAlerts";
import SecurityStatusCard from "../../components/dashboard/SecurityStatusCard";
import CreateProtectedPersonModal from "../../components/protected-persons/CreateProtectedPersonModal";
import { getDashboardData } from "../../../infrastructure/api/dashboard-api";
import { getProtectedPersons } from "../../../infrastructure/api/protected-person-api";
import { useAuth } from "../../context/AuthContext";
import { startDashboardTour } from "../../../features/analysis/utils/tours";
import { ShieldCheck } from "lucide-react"; // Importamos un iconito lindo para el protegido
import toast from "react-hot-toast";

interface ProtectedPerson {
    fullName: string;
}

function Dashboard() {
    const { user } = useAuth();
    const [data, setData] = useState({
        alerts: 0,
        analyses: 0,
        highRisk: 0
    });
    const [protectedPerson, setProtectedPerson] = useState<ProtectedPerson | null>(null);
    const [showModal, setShowModal] = useState(false);

    
    const loadProtectedPersons = useCallback(async () => {
        if (user?.role !== 'CARER') return; 

        try {
            const protectedPersons = await getProtectedPersons();
            if (protectedPersons.length > 0) {
                setProtectedPerson({
                    fullName: protectedPersons[0].fullName
                });
            }
        } catch {
            toast.error("Error cargando protegidos");
        }
    }, [user?.role]); 

    useEffect(() => {
        async function loadData() {
            if (user?.role !== 'CARER') return;

            try {
                const result = await getDashboardData();
                setData({
                    alerts: result?.alerts ?? 0,
                    analyses: result?.analyses ?? 0,
                    highRisk: result?.highRisk ?? 0
                });
            } catch {
                toast.error("Error cargando el dashboard");
                setData({ alerts: 0, analyses: 0, highRisk: 0 });
            }
        }

        if (user) {
            loadData();
            loadProtectedPersons();
        }
    }, [user,loadProtectedPersons]); 

    useEffect(() => {
        setTimeout(() => {
            const isForced = localStorage.getItem("force_dashboard_tour") === "true";
            
            if (isForced) {
                localStorage.removeItem("force_dashboard_tour");
                startDashboardTour(true);
            } else {
                startDashboardTour(false);
            }
        }, 500);
    }, []);

    return (
        <div className="flex min-h-screen bg-[#050816]">
            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN */}
            <main className="flex-1 flex flex-col min-w-0 ml-[79.2px] lg:ml-[224px]">
                {/* HEADER */}
                <div>
                    <Header userName={user?.fullName || "Usuario"} />
                </div>

                {/* CONTENT */}
                <div className="p-8 flex-1 flex flex-col">
                    
                    {/* VISTA PARA EL PROTEGIDO */}
                    {user?.role === 'PROTECTED' ? (
                        <div className="flex flex-1 items-center justify-center">
                            <div className="w-full max-w-3xl bg-[#0d1222] border border-emerald-500/20 rounded-3xl p-14 text-center">
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                        <ShieldCheck size={40} className="text-emerald-500" />
                                    </div>
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-5">
                                    Estás protegido por VERA
                                </h2>
                                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                                    Tus cuidadores están monitoreando tu seguridad digital en segundo plano. Podés navegar y usar tu dispositivo con total tranquilidad.
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* VISTA PARA EL PROTECTOR (CUIDADOR) */
                        !protectedPerson ? (
                            <div className="flex flex-1 items-center justify-center">
                                <div className="w-full max-w-3xl bg-[#0d1222] border border-[#182033] rounded-3xl p-14 text-center">
                                    <h2 className="text-4xl font-bold text-white mb-5">
                                        Todavía no tienes protegidos
                                    </h2>
                                    <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                                        Comienza agregando personas protegidas para analizar mensajes, detectar amenazas y recibir alertas en tiempo real.
                                    </p>
                                    <button
                                        id="add-protected-btn"
                                        onClick={() => setShowModal(true)}
                                        className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold text-lg cursor-pointer"
                                    >
                                        Añadir protegido
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div id="security-status">
                                    <SecurityStatusCard
                                        name={protectedPerson.fullName}
                                        status="stable"
                                        message="No se detectaron amenazas críticas en las últimas horas. La actividad digital se mantiene estable."
                                        lastCheck="hace 2 horas"
                                    />
                                </div>

                                <div id="dashboard-stats" className="flex gap-5 mt-8 mb-8 flex-wrap">
                                    <StatCard title="Alertas hoy" value={String(data.alerts)} />
                                    <StatCard title="Mensajes analizados" value={String(data.analyses)} />
                                    <StatCard title="Amenazas bloqueadas" value={String(data.highRisk)} />
                                </div>

                                <div id="recent-alerts">
                                    <RecentAlerts />
                                </div>
                            </>
                        )
                    )}
                </div>

                {showModal && (
                    <CreateProtectedPersonModal
                        onClose={() => setShowModal(false)}
                        onSuccess={() => {
                            loadProtectedPersons();
                            setShowModal(false);
                        }}
                    />
                )}
            </main>
        </div>
    );
}

export default Dashboard;