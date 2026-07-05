import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { getAlerts, type AlertSummary } from "../../../features/alerts/api/alerts-api.ts";
import toast from "react-hot-toast";

function RecentAlerts() {
    const [alerts, setAlerts] = useState<AlertSummary[]>([]);

    useEffect(() => {
        void getAlerts(0).then((data) => {
            setAlerts(data.content.slice(0, 3));
        }).catch(() => {
            toast.error("No se pudieron cargar las alertas recientes");
            setAlerts([]);
        });
    }, []);

    return (
        <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/10">
                    <ShieldAlert size={20} className="text-red-400" />
                </div>
                <div>
                    <h2 className="text-white text-lg font-semibold">Alertas recientes</h2>
                    <p className="text-slate-400 text-sm mt-1">Actividad sospechosa detectada.</p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className="flex items-center justify-between bg-[#111827] border border-slate-800 rounded-2xl px-5 py-4 transition-all hover:border-slate-700 hover:bg-[#131c2e]"
                    >
                        <div>
                            <h3 className="text-white font-medium">{alert.title}</h3>
                            <p className="text-sm text-slate-400 mt-1">
                                Usuario: {alert.protectedFullName ?? "Desconocido"}
                            </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            alert.isResolved
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                            {alert.isResolved ? "RESUELTA" : "PENDIENTE"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentAlerts;
