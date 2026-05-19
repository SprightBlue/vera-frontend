import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import { useEffect, useState } from "react";
import { getDashboardData } from "../../infrastructure/api/dashboard-api";

function Dashboard() {
   
    const [data, setData] = useState({
    alerts: 0,
    analyses: 0,
    highRisk: 0
});

useEffect(() => {

    async function loadData() {

        const result = await getDashboardData(); /*ESTO SIMLULA EL LLAMADO A LA API, DESPUES CONECTEMOS LA PARTE DEL BACK COMO CORRESPONDE*/

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
                padding: "20px"
            }}>
                <Header />

                <div style={{
                    display: "flex",
                    gap: "20px"
                }}>
                    <StatCard title="Alertas" value={data.alerts.toString()} />
                    <StatCard title="Análisis" value={data.analyses.toString()} />
                    <StatCard title="Riesgo Alto" value={data.highRisk.toString()} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;