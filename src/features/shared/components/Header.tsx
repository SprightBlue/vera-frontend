import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useNotifications} from "@/features/notification/hooks/useNotifications";
import {NotificationDropdown} from "@/features/notification/components/NotificationDropdown";
import {useAuth} from "@/presentation/context/AuthContext";
import {PersonAvatar} from "@/features/shared/components/PersonAvatar";

interface HeaderProps {
    userName?: string;
    userRole?: string;
    title?: string;
    subtitle?: string;
}

export function Header({userName, userRole, title}: HeaderProps) {
    const navigate = useNavigate();
    const {user} = useAuth();

    const finalUserName = user?.fullName || userName || "Usuario";
    let finalUserRole = "Protector";
    if (user?.role === 'PROTECTED') finalUserRole = "Protegido";
    if (user?.role === 'ADMIN') finalUserRole = "Administrador";
    if (!user?.role && userRole) finalUserRole = userRole;

    const displayTitle = title ?? `Hola, ${finalUserName}`;

    const [notificationPage, setNotificationPage] = useState<number>(0);

    const {
        notifications,
        totalPages,
        totalElements,
        unreadCount,
        isRinging,
        loading,
        isBackgroundLoading,
        error,
        retry,
        isDropdownOpen,
        dropdownRef,
        toggleDropdown,
        forceLoading,
        handleAction,
        handleDeleteAllNotifications,
        isProcessingAll
    } = useNotifications({
        userEmail: user?.email,
        page: notificationPage
    });

    return (
        <header className="sticky top-0 z-45 w-full flex items-center justify-between h-[clamp(4.5rem,5vw,5.6rem)]
        bg-[#050814]/90 backdrop-blur-md transition-all duration-300 select-none
        pl-[clamp(5.8rem,8vw,6.5rem)] lg:pl-[clamp(1.5rem,2vw,2.5rem)] pr-4 sm:pr-6 lg:pr-8">

            <div
                className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"/>

            <div className="absolute bottom-0 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8 h-px
            bg-linear-to-r from-transparent via-[#161f37]/90 to-transparent pointer-events-none"/>

            <div className="flex flex-col min-w-0 pr-2 justify-center h-full py-2 items-start text-left">
                <h2 className="text-[clamp(0.95rem,1.1vw,1.25rem)] font-display font-extrabold tracking-wide uppercase text-white truncate leading-normal">
                    {displayTitle}
                </h2>
            </div>

            <div className="flex items-center gap-[clamp(0.8rem,1.2vw,1.5rem)] shrink-0 relative z-10">
                <NotificationDropdown
                    notifications={notifications}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    page={notificationPage}
                    setPage={(newPageFn) => setNotificationPage(newPageFn)}
                    unreadCount={unreadCount}
                    isRinging={isRinging}
                    loading={loading}
                    isBackgroundLoading={isBackgroundLoading}
                    isProcessingAll={isProcessingAll}
                    error={error}
                    retry={retry}
                    isDropdownOpen={isDropdownOpen}
                    dropdownRef={dropdownRef}
                    toggleDropdown={toggleDropdown}
                    forceLoading={forceLoading}
                    handleAction={handleAction}
                    onDeleteAllNotifications={handleDeleteAllNotifications}
                    onSelect={(n) => {
                        if (n.type === 'ALERT') {
                            const p = n.payload as { alertId?: string } | null;
                            if (p?.alertId) navigate(`/alerts/${p.alertId}`);
                        }
                    }}
                />

                <div className="flex items-center gap-3 border-l border-[#161f37] pl-[clamp(0.8rem,1.2vw,1.5rem)]">
                    <div className="hidden sm:flex flex-col items-end leading-none gap-1.5">
                        <span
                            className="text-[clamp(0.78rem,0.82vw,0.88rem)] font-display font-extrabold text-slate-200 uppercase tracking-wide whitespace-nowrap">
                            {finalUserName}
                        </span>
                        <span
                            className="text-[9px] font-display font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">
                            {finalUserRole}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/settings")}
                        title="Ir a configuración"
                        className="rounded-full cursor-pointer transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 group"
                    >
                        <PersonAvatar
                            fullName={finalUserName}
                            image={user?.image}
                            size="header"
                            shape="circle"
                            className="group-hover:border-blue-500/40 transition-colors duration-300"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;