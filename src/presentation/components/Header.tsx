import { useState, useEffect, useRef } from "react";
import { Bell, Mail, CheckCircle2, X, AlertTriangle } from "lucide-react";
import { fetchActiveAlerts, solveAlert, type RiskAlertResponse } from "./riskAlerts";

interface HeaderProps {
    userName?: string;
    userRole?: string;
    title?: string;
    subtitle?: string;
}

function Header({ userName = "Usuario", userRole = "Protector", title, subtitle }: HeaderProps) {
    const displayTitle = title ?? `Bienvenido, ${userName} 👋`;
    const displaySubtitle = subtitle ?? "Aquí tienes el resumen del bienestar de tus protegidos.";
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const [alerts, setAlerts] = useState<RiskAlertResponse[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<RiskAlertResponse | null>(null);
    const [isRinging, setIsRinging] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadInitialAlerts = async () => {
            try {
                const data = await fetchActiveAlerts();
                setAlerts(data);
                console.log("🟢 Alertas iniciales cargadas con éxito:", data.length);
            } catch (error) {
                console.error("🔴 Error cargando alertas iniciales:", error);
            }
        };

        loadInitialAlerts();

        const token = localStorage.getItem('vera_token');
        if (!token) {
            console.warn("⚠️ No se encontró el 'vera_token' en el localStorage.");
            return;
        }

        console.log("📡 Intentando conectar al canal SSE...");
        const eventSource = new EventSource(`${API_URL}/api/v1/risk-alerts/stream?token=${token}`);

        eventSource.onopen = () => {
            console.log("✅ ¡Conexión SSE establecida con el Backend exitosamente!");
        };

        eventSource.addEventListener("RISK_ALERT", (event: MessageEvent) => {
            console.log("🔥 ¡ALERTA RECIBIDA EN TIEMPO REAL!", event.data);
            const newAlert: RiskAlertResponse = JSON.parse(event.data);

            setAlerts((prev) => [newAlert, ...prev]);
            setIsRinging(true);
            setTimeout(() => setIsRinging(false), 2000);
        });

        eventSource.onerror = (error) => {
            console.error("❌ Error o desconexión en el canal SSE. Detalles:", error);
            // Si el status en la pestaña 'Network' es 401 o 403, Spring Security está bloqueando el parámetro ?token=
            eventSource.close();
        };

        return () => {
            console.log("🔌 Cerrando conexión SSE (Componente desmontado)");
            eventSource.close();
        };
    }, [API_URL]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSolveAlert = async (id: string) => {
        try {
            await solveAlert(id);
            setAlerts((prev) => prev.filter((a) => a.alertId !== id));
            setSelectedAlert(null);
            setIsDropdownOpen(false);
        } catch {
            alert("No se pudo resolver la alerta");
        }
    };

    const getRiskColor = (level: string) => {
        if (level === "HIGH" || level === "ALTO") return "text-red-500 bg-red-500/10 border-red-500/20";
        if (level === "MEDIUM" || level === "MEDIO") return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
        return "text-green-500 bg-green-500/10 border-green-500/20";
    };

    return (
        // 🔄 DETALLE: El z-index del header sube a 9999 dinámicamente si el modal está abierto
        <header className={`sticky top-0 flex items-center justify-between w-full px-4 sm:px-8 py-5 bg-[#050816]/80 backdrop-blur-md border-b border-white/5 transition-all ${
            selectedAlert ? 'z-[9999]' : 'z-50'
        }`}>
            <div className="flex flex-col min-w-0 max-w-[60%] sm:max-w-none">
                <h2 className="text-lg sm:text-xl font-medium text-white tracking-tight truncate">{displayTitle}</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 truncate hidden xs:block">{displaySubtitle}</p>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">

                {/* 🔔 CAMPANA */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`relative p-2 text-slate-400 hover:text-white transition-all duration-200 rounded-full hover:bg-white/5 cursor-pointer
                            ${isRinging ? 'animate-bell-ring text-red-500 bg-red-500/10 scale-110' : ''}
                        `}
                    >
                        <Bell className={`w-5 h-5 ${isRinging ? 'stroke-[2.5]' : ''}`} />

                        {alerts.length > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#050816] animate-pulse transition-all duration-300" />
                        )}
                    </button>

                    {/* BANDEJA DESPLEGABLE RESPONSIVE */}
                    {isDropdownOpen && (
                        <div className="absolute right-[-50px] sm:right-0 mt-3 w-[85vw] max-w-[380px] sm:w-96 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl z-50 max-h-[400px] overflow-y-auto">
                            <div className="px-4 py-2 border-b border-white/5 mb-2">
                                <h4 className="text-sm font-semibold text-white">Alertas de riesgo activas</h4>
                            </div>

                            {alerts.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-6">No hay alertas pendientes 🙌</p>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    {alerts.map((alert) => (
                                        <button
                                            key={alert.alertId}
                                            onClick={() => {
                                                setSelectedAlert(alert);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors duration-150 flex flex-col gap-1 border border-transparent hover:border-white/5 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between w-full gap-2">
                                                <span className="text-sm font-semibold text-slate-200 truncate">{alert.protectedUserName}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold shrink-0 ${getRiskColor(alert.riskLevel)}`}>
                                                    {alert.riskLevel}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 truncate w-full">{alert.messageContent}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* PERFIL RESPONSIVE */}
                <div className="flex items-center gap-3 border-l border-white/5 pl-3 sm:pl-6">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-semibold text-white">{userName}</span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">{userRole}</span>
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>

            {/* MODAL COMPLETAMENTE CORREGIDO (POR ENCIMA DE TODO) */}
            {selectedAlert && (
                <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/80 backdrop-blur-sm p-4">
                    {/* 🔄 DETALLE: max-h-[90vh] y overflow-hidden para que nunca se estire de más e impida ver los botones inferiores */}
                    <div className="w-full max-w-xl rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6 text-slate-200 shadow-2xl relative flex flex-col gap-5 max-h-[90vh] my-auto overflow-hidden">

                        {/* Cabecera del modal */}
                        <div className="flex items-start justify-between border-b border-white/5 pb-4 shrink-0">
                            <div className="flex items-center gap-3 min-w-0">
                                <AlertTriangle className="text-red-500 h-6 w-6 shrink-0" />
                                <div className="min-w-0">
                                    <h3 className="text-base sm:text-lg font-bold text-white truncate">Detalle de Amenaza Detectada</h3>
                                    <p className="text-xs text-slate-400 truncate">ID: {selectedAlert.alertId}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedAlert(null)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer shrink-0">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Cuerpo con scroll interno independiente por si el texto es excesivamente largo */}
                        <div className="flex flex-col gap-4 text-sm overflow-y-auto pr-1 grow">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-lg border border-white/5">
                                <div>
                                    <span className="text-xs text-slate-500 font-medium uppercase">Usuario en Riesgo</span>
                                    <p className="font-semibold text-white text-base mt-0.5 truncate">{selectedAlert.protectedUserName}</p>
                                </div>
                                <div className="sm:text-right">
                                    <span className="text-xs text-slate-500 font-medium uppercase block mb-1">Riesgo</span>
                                    {/* 🔄 CORREGIDO: Cambiado 'alert.riskLevel' por 'selectedAlert.riskLevel' */}
                                    <span className={`inline-block text-xs px-2.5 py-1 rounded-full border font-extrabold ${getRiskColor(selectedAlert.riskLevel)}`}>
                                        {selectedAlert.riskLevel}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-slate-400 uppercase mb-1">Mensaje Analizado</h4>
                                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 italic text-slate-300 break-words text-xs sm:text-sm max-h-[120px] overflow-y-auto(custom-scroll)">
                                    "{selectedAlert.messageContent}"
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-slate-400 uppercase mb-1">Patrones Identificados</h4>
                                <p className="text-slate-300 pl-3 border-l-2 border-red-500/40 text-xs sm:text-sm">{selectedAlert.suspiciousPatterns || "Sin patrones explícitos."}</p>
                            </div>
                        </div>

                        {/* Botones fijos al fondo del modal */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5 shrink-0">
                            <a
                                href={`mailto:${selectedAlert.protectedUserEmail}?subject=Seguimiento Sistema VERA`}
                                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-500 text-center text-sm"
                            >
                                <Mail className="w-4 h-4" />
                                Contactar
                            </a>
                            <button
                                onClick={() => handleSolveAlert(selectedAlert.alertId)}
                                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 font-semibold text-white transition cursor-pointer text-sm"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Resolver Alerta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;