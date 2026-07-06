import { useEffect, useState, useCallback } from "react";
import { ShieldAlert, Loader2, RefreshCw, Inbox } from "lucide-react";
import { alertsApi, type AlertsResponse } from "../../../features/alerts/api/alertsApi.ts";

function RecentAlerts() {
    const [alerts, setAlerts] = useState<AlertsResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Encapsulamos la carga inicial llamando al método correcto de alertsApi
    useEffect(() => {
        let isMounted = true;

        const fetchRecentAlerts = async () => {
            try {
                // Pasamos página 0 en los filtros requeridos por getAlertsHistory
                const data = await alertsApi.getAlertsHistory({ page: 0 });
                if (!isMounted) return;

                setAlerts((data?.content ?? []).slice(0, 3));
                setError(null);
            } catch (err) {
                if (!isMounted) return;
                console.error("Error cargando alertas:", err);
                setError("No se pudieron cargar las alertas recientes.");
                setAlerts([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        void fetchRecentAlerts();

        return () => {
            isMounted = false;
        };
    }, []);

    // Callback de reintento manual interactivo (Seguro ante ESLint)
    const handleRetry = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await alertsApi.getAlertsHistory({ page: 0 });
            setAlerts((data?.content ?? []).slice(0, 3));
        } catch {
            setError("No se pudieron cargar las alertas recientes.");
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <div className="bg-[#0a0f24] border border-[#182033] rounded-3xl p-6 flex flex-col min-h-[320px]">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/10">
                    <ShieldAlert size={20} className="text-red-400" />
                </div>
                <div>
                    <h2 className="text-white text-lg font-semibold">Alertas recientes</h2>
                    <p className="text-slate-400 text-sm mt-0.5">Actividad sospechosa detectada.</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-4">
                {loading ? (
                    <div className="w-full flex-1 flex flex-col items-center justify-center py-12 select-none animate-fade-in">
                        <Loader2 size={18} className="text-blue-500 animate-spin stroke-[1.5] mb-2" />
                        <span className="text-[11px] font-medium text-slate-500 tracking-widest uppercase animate-pulse">
                            Cargando Alertas
                        </span>
                    </div>
                ) : error ? (
                    <div className="w-full flex-1 flex items-center justify-center py-10 select-none animate-fade-in">
                        <button
                            onClick={handleRetry}
                            className="flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-slate-300 tracking-widest uppercase transition-colors cursor-pointer group"
                        >
                            <RefreshCw size={12} className="stroke-[2.5] text-slate-500 group-hover:text-slate-300 transition-colors" />
                            <span>Reintentar</span>
                        </button>
                    </div>
                ) : alerts.length > 0 ? (
                    <div className="flex flex-col gap-3 animate-fade-in">
                        {alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className="flex items-center justify-between bg-linear-to-b from-[#0a0f24] to-[#070B1A] border border-[#182033] hover:border-blue-500/20 rounded-2xl px-5 py-4 transition-all duration-200"
                            >
                                <div className="min-w-0 pr-4">
                                    <h3 className="text-slate-100 font-semibold truncate text-[14px]">{alert.title}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Usuario: <span className="text-slate-400">{alert.protectedFullName ?? "Desconocido"}</span>
                                    </p>
                                </div>
                                <div className={`px-2.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider border shrink-0 ${
                                    alert.isResolved
                                        ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                                        : "bg-red-500/5 text-red-400 border-red-500/20"
                                }`}>
                                    {alert.isResolved ? "RESUELTA" : "PENDIENTE"}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 gap-2 text-center border border-dashed border-[#182033]/60 rounded-2xl animate-fade-in select-none">
                        <Inbox size={20} className="text-slate-700 stroke-[1.5]" />
                        <div className="space-y-0.5">
                            <h3 className="text-slate-500 font-medium text-[11px] tracking-wider uppercase">No hay registros</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecentAlerts;
