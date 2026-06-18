import { useNotifications } from "../../features/notification/hooks/useNotifications.ts"; // 👈 Cambiado al hook unificado
import { NotificationDropdown } from "../../features/notification/components/NotificationDropdown";
import { AlertDetailModal } from "../../features/notification/components/AlertDetailModel";

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

    // 🌟 Inyectamos el nuevo hook con los estados polimórficos de la bandeja
    const {
        notifications,
        isRinging,
        selectedAlert,
        isModalRendered,
        animateModalIn,
        openModal,
        closeModal,
        handleSolveAlert,
        handleAcceptInvitation,
        handleRejectInvitation
    } = useNotifications(API_URL);

    return (
        <header className={`sticky top-0 flex items-center justify-between w-full px-4 sm:px-8 py-5 bg-[#050816]/80 backdrop-blur-md border-b border-white/5 transition-all ${
            isModalRendered ? 'z-9999' : 'z-50'
        }`}>
            <div className="flex flex-col min-w-0 max-w-[60%] sm:max-w-none">
                <h2 className="text-lg sm:text-xl font-medium text-white tracking-tight truncate">{displayTitle}</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 truncate hidden xs:block">{displaySubtitle}</p>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">

                <div id="notification-bell">
                    <NotificationDropdown
                        notifications={notifications}
                        isRinging={isRinging}
                        onSelectAlert={openModal}
                        onAcceptInvite={handleAcceptInvitation}
                        onRejectInvite={handleRejectInvitation}
                    />
                </div>

                <div id="user-profile-menu" className="flex items-center gap-3 border-l border-white/5 pl-3 sm:pl-6">
                    <div className="flex-col items-end hidden sm:flex">
                        <span className="text-sm font-semibold text-white">{userName}</span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">{userRole}</span>
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>

            {isModalRendered && selectedAlert && (
                <AlertDetailModal
                    alert={selectedAlert}
                    animateIn={animateModalIn}
                    onClose={closeModal}
                    onSolve={handleSolveAlert}
                />
            )}
        </header>
    );
}

export default Header;