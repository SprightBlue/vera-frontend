import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/features/notification/hooks/useNotifications";
import { NotificationDropdown } from "@/features/notification/components/NotificationDropdown";
import { NotificationModal } from "@/features/notification/components/NotificationModal";
import { type AppNotification } from "@/features/notification/api/notifications.ts";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
    userName?: string;
    userRole?: string;
    title?: string;
    subtitle?: string;
}

function Header({ userName, userRole, title }: HeaderProps) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const finalUserName = user?.fullName || userName || "Usuario";
    let finalUserRole = "Protector";
    if (user?.role === 'PROTECTED') finalUserRole = "Protegido";
    if (user?.role === 'ADMIN') finalUserRole = "Administrador";
    if (!user?.role && userRole) finalUserRole = userRole;

    const displayTitle = title ?? `Bienvenido, ${finalUserName}`;

    const { notifications, isRinging, isProcessing, handleMarkAllRead, handleAction } = useNotifications();
    const [pendingAction, setPendingAction] = useState<{ notif: AppNotification; type: 'ACCEPT' | 'REJECT' | 'DELETE' } | null>(null);

    return (
        <>
            <header className="sticky top-0 z-40 w-full flex items-center justify-between h-[5.6rem] px-6 xl:px-8 bg-[#050816]/90 backdrop-blur-md border-b border-[#182033] transition-all">

                <div className="flex flex-col min-w-0 pr-4 justify-center h-full py-2">
                    <h2 className="text-[clamp(1.1rem,1.5vw,1.35rem)] font-semibold text-slate-200 tracking-tight truncate leading-normal pb-1">
                        {displayTitle}
                    </h2>
                </div>

                <div className="flex items-center gap-6">
                    <NotificationDropdown
                        notifications={notifications}
                        isRinging={isRinging}
                        onOpen={handleMarkAllRead}
                        handleAction={(n, type) => setPendingAction({ notif: n, type })}
                        onSelect={(n) => { if (n.type === 'ALERT') { const p = n.payload as { alertId: string }; navigate(`/alerts/${p.alertId}`); } }}
                    />

                    <div className="flex items-center gap-4 border-l border-[#182033] pl-6">
                        <div className="hidden sm:flex flex-col items-end leading-tight">
                            <span className="text-[0.9rem] font-semibold text-slate-200 mb-0.5">{finalUserName}</span>
                            <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-slate-200">{finalUserRole}</span>
                        </div>
                        {user?.image ? (
                            <img src={user.image} alt="Perfil" className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#182033]" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-[#070B1A] flex items-center justify-center text-blue-500 font-bold text-sm shrink-0 border border-[#182033]">
                                {finalUserName.charAt(0).toUpperCase()}
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