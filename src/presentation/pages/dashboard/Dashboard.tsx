import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import StatCard from "../../components/dashboard/StatCard";
import RecentAlerts from "../../components/dashboard/RecentAlerts";
import SecurityStatusCard from "../../components/dashboard/SecurityStatusCard";

import { getDashboardData } from "../../../infrastructure/api/dashboard-api";

function Dashboard() {


const [data, setData] = useState({
    alerts: 0,
    analyses: 0,
    highRisk: 0
});

useEffect(() => {

    async function loadData() {

        const result = await getDashboardData();

        setData(result);

    }

    loadData();

}, []);

return (

    <div className="flex min-h-screen bg-[#050816]">

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

            <Header userName="Usuario" />

            {/* CONTENT */}

            <div className="p-8">

                {/* SECURITY STATUS */}

                <SecurityStatusCard
                    name="Usuario"
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
                        value={data.alerts.toString()}
                    />

                    <StatCard
                        title="Mensajes analizados"
                        value={data.analyses.toString()}
                    />

                    <StatCard
                        title="Amenazas bloqueadas"
                        value={data.highRisk.toString()}
                    />

                </div>

                {/* RECENT ALERTS */}

                <RecentAlerts />

            </div>

        </main>

    </div>

);


}

export default Dashboard;
