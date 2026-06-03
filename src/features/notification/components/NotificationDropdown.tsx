import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { type RiskAlertResponse } from "../api/riskAlerts";
import { getRiskColor } from "../utils/alertUtils";

interface NotificationDropdownProps {
    alerts: RiskAlertResponse[];
    isRinging: boolean;
    onSelectAlert: (alert: RiskAlertResponse) => void;
}

export function NotificationDropdown({ alerts, isRinging, onSelectAlert }: NotificationDropdownProps) {
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

            {isDropdownOpen && (
                <div className="absolute -right-12.5 sm:right-0 mt-3 w-[85vw] max-w-95 sm:w-96 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl z-50 max-h-100 overflow-y-auto">
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
                                        onSelectAlert(alert);
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
    );
}