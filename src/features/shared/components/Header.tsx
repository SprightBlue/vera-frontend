import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/features/notification/hooks/useNotifications";
import { NotificationDropdown } from "@/features/notification/components/NotificationDropdown";
import { useAuth } from "@/presentation/context/AuthContext";
import { PersonAvatar } from "@/features/shared/components/PersonAvatar";

interface HeaderProps {
    userName?: string;
    userRole?: string;
    title?: string;
    subtitle?: string;
}

export function Header({ userName, userRole, title }: HeaderProps) {
    const navigate = useNavigate();
    const { user } = useAuth();

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
        <header
            className="sticky top-0 z-45 w-full flex items-center justify-between h-16
            bg-[#050814]/90 backdrop-blur-md transition-all duration-300 select-none
            pl-20 lg:pl-8 pr-4 sm:pr-6 lg:pr-8"
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-white/5 pointer-events-none z-10" />
            <div className="absolute bottom-0 left-4 right-4 lg:left-8 lg:right-8 h-px bg-white/5 pointer-events-none z-10" />

            <div className="flex flex-col min-w-0 pr-2 justify-center h-full py-2 items-start text-left relative z-10">
                <h2
                    className="text-base font-bold text-white truncate leading-none normal-case tracking-wide"
                    style={{ fontFamily: "'Montserrat', system-ui, sans-serif" }}
                >
                    {displayTitle}
                </h2>
            </div>

            <div
                className="flex items-center gap-4 shrink-0 relative z-10"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
                {/* ID para el tour */}
                <div id="notification-bell">
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
                </div>

                <div className="flex items-center gap-3 border-l border-white/5 pl-4">
                    <div className="hidden sm:flex flex-col items-end leading-tight gap-0.5">
                        <span className="text-sm font-semibold text-white normal-case tracking-wide">
                            {finalUserName}
                        </span>
                        <span className="text-xs font-medium text-gray-400 normal-case">
                            {finalUserRole}
                        </span>
                    </div>

                    {/* ID para el tour */}
                    <button
                        id="user-profile-menu"
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