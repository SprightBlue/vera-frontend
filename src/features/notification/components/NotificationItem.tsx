import { ShieldAlert, UserPlus, Info, Check, X, ShieldCheck, Trash2 } from "lucide-react";
import { type AppNotification } from "../api/notifications";

interface ItemProps {
    notif: AppNotification;
    onAction: (notif: AppNotification, action: 'ACCEPT' | 'REJECT' | 'DELETE') => void;
    onSelect: (notif: AppNotification) => void;
}

export function NotificationItem({ notif, onAction, onSelect }: ItemProps) {
    const renderIcon = () => {
        switch (notif.type) {
            case 'ALERT':
                return <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />;
            case 'ALERT_SOLVED':
                return <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />;
            case 'INVITATION':
                return <UserPlus className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />;
            default:
                return <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />;
        }
    };

    return (
        <div className={`p-3 rounded-lg border transition-colors flex items-start gap-3 relative group ${
            notif.isRead ? 'bg-transparent border-transparent' : 'bg-white/5 border-white/5'
        }`}>
            {renderIcon()}

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{notif.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{notif.message}</p>

                {notif.type === 'INVITATION' && (
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => onAction(notif, 'ACCEPT')}
                            className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                            <Check className="w-3 h-3" /> Aceptar
                        </button>
                        <button
                            onClick={() => onAction(notif, 'REJECT')}
                            className="flex-1 py-1 bg-red-950 hover:bg-red-900 text-red-400 border border-red-900/30 rounded text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                            <X className="w-3 h-3" /> Rechazar
                        </button>
                    </div>
                )}
            </div>

            {notif.type === 'ALERT' && (
                <button
                    onClick={() => onSelect(notif)}
                    className="text-xs text-blue-400 font-bold hover:underline cursor-pointer whitespace-nowrap self-center"
                >
                    Ver
                </button>
            )}

            {notif.type !== 'INVITATION' && notif.type !== 'ALERT' && (
                <button
                    onClick={() => onAction(notif, 'DELETE')}
                    className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer absolute right-2 top-2"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
}