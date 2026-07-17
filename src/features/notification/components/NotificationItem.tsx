import { useState } from "react";
import { Trash2, ArrowRight, Check, X } from "lucide-react";
import { type AppNotification } from "@/features/notification/api/notificationsApi";
import { type NotificationType } from "@/features/shared/utils/typeConfig";
import { ActionButton } from "@/features/shared/components/ActionButton";

import { UI_VARIANTS_MAP, UI_BUTTON_STYLES } from '@/features/shared/utils/styleConfig';

interface ItemProps {
    notif: AppNotification;
    onAction: (notif: AppNotification, action: 'ACCEPT' | 'REJECT' | 'DELETE') => void | Promise<void>;
    onSelect: (notif: AppNotification) => void;
    isDisabled?: boolean;
}

export function NotificationItem({ notif, onAction, onSelect, isDisabled = false }: ItemProps) {
    const notifType = notif.type as NotificationType;
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const invitationId = notif.payload && typeof notif.payload === 'object'
        ? (notif.payload as Record<string, string | number>).id
        : null;

    const hasActions = notifType === 'ALERT' || (notifType === 'INVITATION' && invitationId);
    const preventActions = isDeleting || isDisabled;

    const dangerButtonStyle = UI_BUTTON_STYLES['danger'];
    const cardStyle = UI_VARIANTS_MAP['neutral'];

    return (
        <div
            className={`group rounded-xl border p-[clamp(0.9rem,1.4vw,1.3rem)] shadow-lg relative overflow-hidden flex flex-col gap-4 transition-all duration-200 ring-1 ring-inset ring-white/5 w-full 
            ${cardStyle.bgColor} ${cardStyle.borderColor} ${cardStyle.textColor} ${
                preventActions ? "opacity-60 pointer-events-none" : ""
            }`}
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            {/* Brillo ambiental elástico integrado */}
            <div
                className={`absolute -top-16 -right-16 w-[clamp(140px,15vw,220px)] h-[clamp(140px,15vw,220px)] rounded-full ${cardStyle.glowColor} filter blur-2xl opacity-5 pointer-events-none`}
            />

            <div className="absolute top-2.5 right-2.5 z-20">
                <button
                    type="button"
                    disabled={preventActions}
                    onClick={async (e) => {
                        e.stopPropagation();
                        if (preventActions) return;
                        setIsDeleting(true);

                        await new Promise(resolve => setTimeout(resolve, 300));
                        try {
                            await onAction(notif, 'DELETE');
                        } catch {
                            setIsDeleting(false);
                        }
                    }}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 select-none outline-none focus:outline-none border-0 shadow-sm ${
                        preventActions && !isDeleting
                            ? "text-slate-600 bg-transparent cursor-not-allowed opacity-50"
                            : `${dangerButtonStyle} text-white shadow-sm active:scale-90 cursor-pointer`
                    }`}
                    title="Eliminar notificación"
                >
                    {isDeleting ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                    )}
                </button>
            </div>

            {/* Contenido Principal */}
            <div className="flex flex-col justify-between min-w-0 flex-1 relative z-10 gap-2 items-start pr-6 select-text">
                <span className="text-[clamp(10px,0.6vw,11.5px)] font-medium text-slate-500 tracking-wide normal-case">
                    {notif.createdAt}
                </span>

                <div className="flex flex-col gap-0.5 w-full">
                    <h4 className="text-[clamp(13px,0.85vw,14.5px)] font-bold text-white line-clamp-2 tracking-wide w-full normal-case">
                        {notif.title}
                    </h4>
                    <p className="text-[clamp(12px,0.75vw,13px)] text-slate-400 leading-relaxed line-clamp-2 pr-1 font-normal w-full">
                        {notif.message}
                    </p>
                </div>
            </div>

            {/* Barra de Acciones del Item */}
            {hasActions && (
                <div className="flex flex-col gap-3 shrink-0 w-full border-t border-white/5 pt-3 relative z-10">
                    <div className="w-full flex items-center justify-end gap-2">
                        {notifType === 'INVITATION' && invitationId && (
                            <>
                                <ActionButton
                                    variant="success"
                                    icon={Check}
                                    onClick={() => !preventActions && onAction(notif, 'ACCEPT')}
                                    disabled={preventActions}
                                    className="px-3 h-7 text-[11px] font-medium tracking-wide normal-case rounded-lg shadow-sm disabled:opacity-50"
                                >
                                    Aceptar
                                </ActionButton>
                                <ActionButton
                                    variant="danger"
                                    icon={X}
                                    onClick={() => !preventActions && onAction(notif, 'REJECT')}
                                    disabled={preventActions}
                                    className="px-3 h-7 text-[11px] font-medium tracking-wide normal-case rounded-lg shadow-sm disabled:opacity-50"
                                >
                                    Rechazar
                                </ActionButton>
                            </>
                        )}

                        {notifType === 'ALERT' && (
                            <ActionButton
                                variant="info"
                                icon={ArrowRight}
                                onClick={() => !preventActions && onSelect(notif)}
                                disabled={preventActions}
                                className="px-3.5 h-7 text-[11px] font-medium tracking-wide normal-case rounded-lg shadow-sm disabled:opacity-50"
                            >
                                Ver Detalles
                            </ActionButton>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}