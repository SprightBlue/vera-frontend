import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";

import { getDashboardData } from "../../infrastructure/api/dashboard-api";

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
        <div style={{
            display: "flex",
            backgroundColor: "#0B1120",
            minHeight: "100vh"
        }}>

            <Sidebar />

            <div style={{
                flex: 1,
                padding: "30px"
            }}>

                <Header />

                <div style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "30px"
                }}>

                    <StatCard
                        title="Alertas"
                        value={data.alerts.toString()}
                    />

                    <StatCard
                        title="Análisis"
                        value={data.analyses.toString()}
                    />

                    <StatCard
                        title="Riesgo Alto"
                        value={data.highRisk.toString()}
                    />

                </div>

                <div style={{
                    backgroundColor: "#111827",
                    borderRadius: "16px",
                    padding: "25px",
                    color: "white"
                }}>

                    <h2>Actividad reciente</h2>

                    <p style={{
                        color: "#9CA3AF"
                    }}>
                        No se detectaron amenazas críticas en las últimas horas.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;