import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import StatCard from "../../components/dashboard/StatCard";
import RecentAlerts from "../../components/dashboard/RecentAlerts";
import SecurityStatusCard from "../../components/dashboard/SecurityStatusCard";

import CreateProtectedPersonModal
    from "../../components/protected-persons/CreateProtectedPersonModal";

import { getDashboardData }
    from "../../../infrastructure/api/dashboard-api";

import {
    getProtectedPersons
} from "../../../infrastructure/api/protected-person-api";

import { useAuth }
    from "../../context/AuthContext";

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

    const [protectedPerson, setProtectedPerson] =
        useState<ProtectedPerson | null>(null);

    const [showModal, setShowModal] =
        useState(false);

    async function loadProtectedPersons() {

        try {

            const protectedPersons =
                await getProtectedPersons();

            if (protectedPersons.length > 0) {

                setProtectedPerson({

                    fullName: protectedPersons[0].fullName

                });

            }

        } catch (error) {

            console.error(
                "Error cargando protegidos:",
                error
            );

        }

    }

    useEffect(() => {

        async function loadData() {

            try {

                const result =
                    await getDashboardData();

                setData({

                    alerts: result?.alerts ?? 0,
                    analyses: result?.analyses ?? 0,
                    highRisk: result?.highRisk ?? 0

                });

            } catch (error) {

                console.error(
                    "Error cargando dashboard:",
                    error
                );

                setData({

                    alerts: 0,
                    analyses: 0,
                    highRisk: 0

                });

            }

        }

        loadData();

        loadProtectedPersons();

    }, []);

    return (

        <div className="
            flex
            min-h-screen
            bg-[#050816]
        ">

            {/* SIDEBAR */}

            <Sidebar />

            {/* MAIN */}

            <main className="
                flex-1
                flex
                flex-col
                min-w-0
            ">

                {/* HEADER */}

                <Header
                    userName={user?.fullName || "Usuario"}
                />

                {/* CONTENT */}

                <div className="
                    p-8
                    flex-1
                    flex
                    flex-col
                ">

                    {
                        !protectedPerson ? (

                            <div className="
                                flex
                                flex-1
                                items-center
                                justify-center
                            ">

                                <div className="
                                    w-full
                                    max-w-3xl

                                    bg-[#0d1222]
                                    border
                                    border-[#182033]

                                    rounded-3xl
                                    p-14

                                    text-center
                                ">

                                    <h2 className="
                                        text-4xl
                                        font-bold
                                        text-white
                                        mb-5
                                    ">
                                        Todavía no tienes protegidos
                                    </h2>

                                    <p className="
                                        text-slate-400
                                        text-lg
                                        leading-relaxed
                                        max-w-2xl
                                        mx-auto
                                        mb-8
                                    ">
                                        Comienza agregando personas protegidas
                                        para analizar mensajes, detectar amenazas
                                        y recibir alertas en tiempo real.
                                    </p>

                                    <button

                                        onClick={() =>
                                            setShowModal(true)
                                        }

                                        className="
                                            px-8
                                            py-4
                                            rounded-2xl
                                            bg-blue-600
                                            hover:bg-blue-700
                                            transition-colors
                                            text-white
                                            font-semibold
                                            text-lg
                                        "
                                    >
                                        Añadir protegido
                                    </button>

                                </div>

                            </div>

                        ) : (

                            <>

                                {/* SECURITY STATUS */}

                                <SecurityStatusCard

                                    name={protectedPerson.fullName}

                                    status="stable"

                                    message="No se detectaron amenazas críticas en las últimas horas. La actividad digital se mantiene estable."

                                    lastCheck="hace 2 horas"

                                />

                                {/* STATS */}

                                <div className="
                                    flex
                                    gap-5
                                    mt-8
                                    mb-8
                                    flex-wrap
                                ">

                                    <StatCard
                                        title="Alertas hoy"
                                        value={String(data.alerts)}
                                    />

                                    <StatCard
                                        title="Mensajes analizados"
                                        value={String(data.analyses)}
                                    />

                                    <StatCard
                                        title="Amenazas bloqueadas"
                                        value={String(data.highRisk)}
                                    />

                                </div>

                                {/* RECENT ALERTS */}

                                <RecentAlerts />

                            </>

                        )
                    }

                </div>

                {
                    showModal && (

                        <CreateProtectedPersonModal

                            onClose={() =>
                                setShowModal(false)
                            }

                            onSuccess={() => {

                                loadProtectedPersons();

                                setShowModal(false);

                            }}

                        />

                    )
                }

            </main>

        </div>

    );

}

export default Dashboard;