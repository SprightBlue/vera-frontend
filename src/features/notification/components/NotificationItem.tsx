import { ShieldAlert, UserPlus, Info, X as XIcon, ShieldCheck } from "lucide-react";
import { type AppNotification } from "../api/notifications.ts";

interface ItemProps {
    notif: AppNotification;
    onAction: (notif: AppNotification, action: 'ACCEPT' | 'REJECT' | 'DELETE') => void;
    onSelect: (notif: AppNotification) => void;
}

export function NotificationItem({ notif, onAction, onSelect }: ItemProps) {
    const renderIcon = () => {
        const baseClass = "w-5 h-5 shrink-0";
        switch (notif.type) {
            case 'ALERT': return <ShieldAlert className={`${baseClass} text-red-500`} />;
            case 'ALERT_SOLVED': return <ShieldCheck className={`${baseClass} text-emerald-500`} />;
            case 'INVITATION': return <UserPlus className={`${baseClass} text-blue-400`} />;
            default: return <Info className={`${baseClass} text-slate-500`} />;
        }
    };

    return (
        <div className={`p-4 rounded-xl border transition-all duration-300 flex items-start gap-4 relative group bg-slate-900/50 border-slate-800 hover:border-slate-700/50 ${notif.isRead ? 'opacity-60' : 'opacity-100'}`}>

            <button
                onClick={(e) => { e.stopPropagation(); onAction(notif, 'DELETE'); }}
                className="absolute top-2 right-2 p-1.5 bg-slate-950/50 text-slate-400 hover:text-red-400 hover:bg-red-950/50 border border-slate-800 rounded-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                title="Eliminar"
            >
                <XIcon size={12} strokeWidth={3} />
            </button>

            <div className="mt-0.5">{renderIcon()}</div>

            <div className="flex-1 min-w-0 pr-6">
                <p className="text-[13px] font-bold text-slate-100 truncate">{notif.title}</p>
                <p className="text-[12px] text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>

                {notif.type === 'INVITATION' && (
                    <div className="flex gap-2 mt-3">
                        <button onClick={() => onAction(notif, 'ACCEPT')} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-[11px] font-bold transition-all cursor-pointer">Aceptar</button>
                        <button onClick={() => onAction(notif, 'REJECT')} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold transition-all cursor-pointer">Rechazar</button>
                    </div>
                )}

                {notif.type === 'ALERT' && (
                    <div className="mt-3">
                        <button onClick={() => onSelect(notif)} className="px-3 py-1.5 text-[11px] bg-blue-900/30 border border-blue-500/30 text-blue-300 font-bold rounded-lg hover:bg-blue-900/50 transition-all cursor-pointer">Ver detalles</button>
                    </div>
                )}
            </div>
        </div>
    );
}