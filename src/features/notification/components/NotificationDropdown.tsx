import { useState, useEffect, useRef } from "react";
import { Bell, ShieldAlert, UserPlus, Check, X } from "lucide-react";
import { type AppNotification, type RiskAlertResponse } from "../api/notifications";
import { getRiskColor } from "../utils/alertUtils";

interface NotificationDropdownProps {
    notifications: AppNotification[];
    isRinging: boolean;
    onSelectAlert: (alert: RiskAlertResponse) => void;
    onAcceptInvite: (id: number) => void;
    onRejectInvite: (id: number) => void;
}

export function NotificationDropdown({
                                         notifications,
                                         isRinging,
                                         onSelectAlert,
                                         onAcceptInvite,
                                         onRejectInvite
                                     }: NotificationDropdownProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`relative p-2 text-slate-400 hover:text-white transition-all duration-200 rounded-full hover:bg-white/5 cursor-pointer
                    ${isRinging ? 'animate-bell-ring text-red-500 bg-red-500/10 scale-110' : ''}
                `}
            >
                <Bell className={`w-5 h-5 ${isRinging ? 'stroke-[2.5]' : ''}`} />
                {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#050816] animate-pulse" />
                )}
            </button>

            <div
                className={`absolute -right-12.5 sm:right-0 mt-3 w-[85vw] max-w-95 sm:w-96 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl z-50 max-h-100 overflow-y-auto
                    transition-all duration-200 ease-out origin-top-right
                    ${isDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
                `}
            >
                <div className="px-4 py-2 border-b border-white/5 mb-2">
                    <h4 className="text-sm font-semibold text-white">Bandeja de notificaciones</h4>
                </div>

                {notifications.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-6">No hay novedades pendientes 🙌</p>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        {notifications.map((notif, index) => {
                            if (notif.type === 'ALERT') {
                                const alert = notif.data;
                                return (
                                    <button
                                        key={`alert-${alert.alertId}-${index}`}
                                        type="button"
                                        onClick={() => {
                                            onSelectAlert(alert);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-start gap-3 border border-transparent hover:border-white/5 cursor-pointer"
                                    >
                                        <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-sm font-semibold text-slate-200 truncate">{alert.protectedUserName}</span>
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold uppercase shrink-0 ${getRiskColor(alert.riskLevel)}`}>
                                                    {alert.riskLevel}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 truncate mt-0.5">{alert.messageContent}</p>
                                        </div>
                                    </button>
                                );
                            } else {
                                const invite = notif.data;
                                return (
                                    <div
                                        key={`invite-${invite.id}-${index}`}
                                        className="w-full text-left p-3 rounded-lg bg-white/2 border border-slate-800/60 flex items-start gap-3"
                                    >
                                        <UserPlus className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-0.5">Invitación de Seguridad</span>

                                            {/* 🛠️ Aseguramos que si caregiverName no existe, use fullName o un fallback para evitar errores nulos */}
                                            <p className="text-sm text-slate-200 font-medium truncate">
                                                <span className="font-bold text-white">
                                                    {invite.caregiverName || invite.fullName || "Un usuario"}
                                                </span> quiere protegerte.
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">Relación: {invite.relationship}</p>

                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onAcceptInvite(invite.id);
                                                        setIsDropdownOpen(false); // Cerramos el dropdown para actualizar la UI limpiamente
                                                    }}
                                                    className="flex-1 py-1 px-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-md flex items-center justify-center gap-1 transition cursor-pointer"
                                                >
                                                    <Check className="w-3 h-3" /> Aceptar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRejectInvite(invite.id);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-md flex items-center justify-center transition cursor-pointer"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}