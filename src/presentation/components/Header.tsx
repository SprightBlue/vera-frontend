import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/features/notification/hooks/useNotifications";
import NotificationDropdown from "@/features/notification/components/NotificationDropdown";
import { useAuth } from "@/presentation/context/AuthContext";
import {PersonAvatar} from "@/presentation/components/common/PersonAvatar.tsx";

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
        <header className="sticky top-0 z-45 w-full flex items-center justify-between h-[clamp(4.5rem,5vw,5.6rem)] pl-24 lg:pl-8 pr-4 sm:pr-6 lg:pr-8 bg-[#070B1A]/80 backdrop-blur-md border-b border-[#182033] transition-all select-none">
            <div className="flex flex-col min-w-0 pr-2 justify-center h-full py-2 items-start text-left">
                <h2 className="text-[clamp(0.95rem,1.15vw,1.35rem)] font-bold text-slate-200 tracking-tight truncate leading-normal">
                    {displayTitle}
                </h2>
            </div>

            <div className="flex items-center gap-[clamp(0.8rem,1.2vw,1.5rem)] shrink-0">
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

                <div className="flex items-center gap-2.5 sm:gap-3.5 border-l border-[#182033] pl-[clamp(0.8rem,1.2vw,1.5rem)]">
                    <div className="hidden sm:flex flex-col items-end leading-tight">
                        <span className="text-[clamp(0.8rem,0.85vw,0.9rem)] font-semibold text-slate-200 mb-0.5 whitespace-nowrap">{finalUserName}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">{finalUserRole}</span>
                    </div>

                    <PersonAvatar fullName={finalUserName} image={user?.image} size="header" shape="circle" className="bg-[#0a0f24] text-blue-400"/>
                </div>
            </div>
        </header>
    );
}

export default Header;