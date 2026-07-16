import {useState} from "react";
import {Trash2, ArrowRight, Check, X} from "lucide-react";
import {type AppNotification} from "@/features/notification/api/notificationsApi";
import {type NotificationType} from "@/features/shared/utils/typeConfig";
import {ActionButton} from "@/features/shared/components/ActionButton";

import {UI_VARIANTS_MAP, UI_BUTTON_STYLES} from '@/features/shared/utils/styleConfig';

interface ItemProps {
    notif: AppNotification;
    onAction: (notif: AppNotification, action: 'ACCEPT' | 'REJECT' | 'DELETE') => void | Promise<void>;
    onSelect: (notif: AppNotification) => void;
    isDisabled?: boolean;
}

export function NotificationItem({notif, onAction, onSelect, isDisabled = false}: ItemProps) {
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
            className={`group rounded-xl border p-[clamp(1.2rem,1.8vw,2rem)] shadow-2xl relative overflow-hidden flex flex-col gap-5 transition-all duration-200 ring-1 ring-inset ring-[#161f35]/20 w-full 
            ${cardStyle.bgColor} ${cardStyle.borderColor} ${cardStyle.textColor} ${
                preventActions ? "opacity-60 pointer-events-none" : ""
            }`}
        >
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)]
                bg-size-[3.5rem_3.5rem] opacity-45 pointer-events-none z-0"
            />

            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,#080d20_95%)] pointer-events-none z-0"
            />

            <div
                className={`absolute -top-16 -right-16 w-[clamp(180px,18vw,300px)] h-[clamp(180px,18vw,300px)] rounded-full ${cardStyle.glowColor} filter blur-3xl opacity-10 pointer-events-none`}
            />

            <div
                className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"
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
                    style={{WebkitTapHighlightColor: 'transparent'}}
                    className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 select-none outline-none focus:outline-none focus:ring-0 active:ring-0 border-0 shadow-md ${
                        preventActions && !isDeleting
                            ? "text-slate-600 bg-transparent cursor-not-allowed opacity-50"
                            : `${dangerButtonStyle} text-white shadow-[0_0_12px_rgba(220,38,38,0.4)] hover:shadow-[0_0_16px_rgba(220,38,38,0.6)] active:shadow-none active:scale-90 cursor-pointer`
                    }`}
                    title="Eliminar notificación"
                >
                    {isDeleting ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    ) : (
                        <Trash2
                            className="w-3.5 h-3.5 stroke-[2.5]"
                        />
                    )}
                </button>
            </div>

            <div className="flex flex-col justify-between min-w-0 flex-1 relative z-10 gap-3 items-start pr-6">
                <div className="flex items-center gap-2 select-none">
                    <span
                        className="text-[clamp(11px,0.65vw,13px)] font-display font-bold text-slate-500 leading-none tracking-wider uppercase">
                        {notif.createdAt}
                    </span>
                </div>

                <div className="flex flex-col gap-1 w-full">
                    <h3 className="text-[clamp(14px,1vw,17px)] font-display font-extrabold text-white line-clamp-2 select-text tracking-wide w-full uppercase">
                        {notif.title}
                    </h3>
                    <p className="text-[clamp(13px,0.8vw,14px)] text-slate-400 leading-relaxed line-clamp-2 pr-2 select-text font-sans font-medium w-full">
                        {notif.message}
                    </p>
                </div>
            </div>

            {hasActions && (
                <div className="flex flex-col gap-3 shrink-0 w-full border-t border-[#161f37] pt-4 relative z-10">
                    <div className="w-full flex items-center justify-end gap-2">
                        {notifType === 'INVITATION' && invitationId && (
                            <>
                                <ActionButton
                                    variant="success"
                                    icon={Check}
                                    onClick={() => !preventActions && onAction(notif, 'ACCEPT')}
                                    disabled={preventActions}
                                    className="px-3.5 h-[clamp(1.75rem,1.9vw,2rem)] text-[9px] font-sans font-black tracking-wider uppercase rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Aceptar
                                </ActionButton>
                                <ActionButton
                                    variant="danger"
                                    icon={X}
                                    onClick={() => !preventActions && onAction(notif, 'REJECT')}
                                    disabled={preventActions}
                                    className="px-3.5 h-[clamp(1.75rem,1.9vw,2rem)] text-[9px] font-sans font-black tracking-wider uppercase rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
                                className="px-4 h-[clamp(1.75rem,1.9vw,2rem)] text-[9px] font-sans font-black tracking-wider uppercase rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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