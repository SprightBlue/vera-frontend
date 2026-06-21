import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../features/notification/hooks/useNotifications";
import { NotificationDropdown } from "../../features/notification/components/NotificationDropdown";
import { NotificationModal } from "../../features/notification/components/NotificationModal";
import { type AppNotification } from "../../features/notification/api/notifications.ts";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
    userName?: string;
    userRole?: string;
    title?: string;
    subtitle?: string;
}

function Header({ userName = "Usuario", userRole = "Protector", title, subtitle }: HeaderProps) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const displayTitle = title ?? `Bienvenido, ${userName}`;
    const displaySubtitle = subtitle ?? "Aquí tienes el resumen del bienestar de tus protegidos.";

    const { notifications, isRinging, isProcessing, handleMarkAllRead, handleAction } = useNotifications();

    const [pendingAction, setPendingAction] = useState<{
        notif: AppNotification;
        type: 'ACCEPT' | 'REJECT' | 'DELETE'
    } | null>(null);

    return (
        <>
            <header className="sticky top-0 z-40 flex items-center justify-between w-full px-4 sm:px-8 py-5 bg-[#050816]/80 backdrop-blur-md border-b border-white/5 transition-all">
                <div className="flex flex-col min-w-0 max-w-[60%] sm:max-w-none">
                    <h2 className="text-lg sm:text-xl font-medium text-white tracking-tight truncate">{displayTitle}</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 truncate hidden xs:block">{displaySubtitle}</p>
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                    <NotificationDropdown
                        notifications={notifications}
                        isRinging={isRinging}
                        onOpen={handleMarkAllRead}
                        handleAction={(n, type) => setPendingAction({ notif: n, type })}
                        onSelect={(n) => {
                            if (n.type === 'ALERT') {
                                const p = n.payload as { alertId: string };
                                navigate(`/alerts/${p.alertId}`);
                            }
                        }}
                    />

                    <div className="flex items-center gap-3 border-l border-white/5 pl-3 sm:pl-6">
                        <div className="flex-col items-end hidden sm:flex">
                            <span className="text-sm font-semibold text-white">{userName}</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">{userRole}</span>
                        </div>
                        {user?.image ? (
                            <img
                            src={user.image}
                            alt="Perfil"
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0"
                        />
                        ) : (
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <NotificationModal
                pendingAction={pendingAction}
                isProcessing={isProcessing}
                onClose={() => setPendingAction(null)}
                onConfirm={async () => {
                    if (pendingAction) {
                        await handleAction(pendingAction.notif, pendingAction.type);
                        setPendingAction(null);
                    }
                }}
            />
        </>
    );
}

export default Header;