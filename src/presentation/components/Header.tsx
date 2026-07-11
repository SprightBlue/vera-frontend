import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/features/notification/hooks/useNotifications";
import { NotificationDropdown } from "@/features/notification/components/NotificationDropdown";
import { useAuth } from "@/presentation/context/AuthContext";
import { PersonAvatar } from "@/presentation/components/common/PersonAvatar.tsx";

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

    const displayTitle = title ?? `Hola, ${finalUserName}`;

    const [notificationPage, setNotificationPage] = useState<number>(0);

    const {
        notifications,
        totalPages,
        totalElements,
        unreadCount,
        isRinging,
        loading,
        isDropdownOpen,
        dropdownRef,
        toggleDropdown,
        forceLoading,
        handleAction
    } = useNotifications({
        userEmail: user?.email,
        page: notificationPage
    });

    return (
        <header className="sticky top-0 z-45 w-full flex items-center justify-between h-[clamp(4.5rem,5vw,5.6rem)] pl-24 lg:pl-8 pr-4 sm:pr-6 lg:pr-8 bg-[#080d20]/90 backdrop-blur-md border-b border-[#1c2646]/50 transition-all select-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none" />

            <div className="flex flex-col min-w-0 pr-2 justify-center h-full py-2 items-start text-left">
                <h2 className="text-[clamp(1rem,1.2vw,1.4rem)] font-display font-black text-white truncate leading-normal">
                    {displayTitle}
                </h2>
            </div>

            <div className="flex items-center gap-[clamp(0.8rem,1.2vw,1.5rem)] shrink-0 relative z-10">
                <NotificationDropdown
                    notifications={notifications}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    page={notificationPage}
                    setPage={setNotificationPage}
                    unreadCount={unreadCount}
                    isRinging={isRinging}
                    loading={loading}
                    isDropdownOpen={isDropdownOpen}
                    dropdownRef={dropdownRef}
                    toggleDropdown={toggleDropdown}
                    forceLoading={forceLoading}
                    handleAction={handleAction}
                    onSelect={(n) => {
                        if (n.type === 'ALERT') {
                            const p = n.payload as { alertId?: string } | null;
                            if (p?.alertId) navigate(`/alerts/${p.alertId}`);
                        }
                    }}
                />

                <div className="flex items-center gap-3 border-l border-[#22315c]/30 pl-[clamp(0.8rem,1.2vw,1.5rem)]">
                    <div className="hidden sm:flex flex-col items-end leading-tight">
                        <span className="text-[clamp(0.8rem,0.85vw,0.9rem)] font-display font-black text-slate-200 mb-0.5 whitespace-nowrap">
                            {finalUserName}
                        </span>
                        <span className="text-[10px] font-display font-black uppercase text-slate-500 whitespace-nowrap">
                            {finalUserRole}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate("/settings")}
                        title="Ir a configuración"
                        className="rounded-full cursor-pointer transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                    >
                    <PersonAvatar
                        fullName={finalUserName}
                        image={user?.image}
                        size="header"
                        shape="circle"
                        className="bg-[#040714] text-blue-400 border border-blue-500/20 shadow-lg shadow-black/40"
                    />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;