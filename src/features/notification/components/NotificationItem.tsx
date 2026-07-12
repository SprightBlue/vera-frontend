import { useState } from "react";
import { type AppNotification } from "@/features/notification/api/notificationsApi.ts";
import { NOTIFICATION_MAP, type NotificationType } from "@/features/shared/utils/typeConfig";
import { UI_VARIANTS_MAP } from "@/features/shared/utils/styleConfig";
import { ActionButton } from "@/features/shared/components/ActionButton";
import { CloseButton } from "@/features/shared/components/CloseButton";

interface ItemProps {
    notif: AppNotification;
    onAction: (notif: AppNotification, action: 'ACCEPT' | 'REJECT' | 'DELETE') => void | Promise<void>;
    onSelect: (notif: AppNotification) => void;
}

export function NotificationItem({ notif, onAction, onSelect }: ItemProps) {
    const notifType = notif.type as NotificationType;
    const notifConfig = NOTIFICATION_MAP[notifType] || { variant: 'neutral' as const };

    const theme = UI_VARIANTS_MAP[notifConfig.variant];
    const infoTheme = UI_VARIANTS_MAP['info'];

    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const invitationId = notif.payload && typeof notif.payload === 'object'
        ? (notif.payload as Record<string, string | number>).id
        : null;

    const hasActions = notifType === 'ALERT' || (notifType === 'INVITATION' && invitationId);

    return (
        <div className="group rounded-xl border border-[#161f37]/80 bg-linear-to-b from-[#090c16] to-[#030409] p-[clamp(0.8rem,1vw,1.1rem)] shadow-lg relative overflow-hidden flex flex-col gap-2.5 transition-all duration-300 ring-1 ring-inset ring-[#161f35]/10 w-full">

            <div className={`absolute -top-12 -right-12 w-[clamp(120px,12vw,180px)] h-[clamp(120px,12vw,180px)] rounded-full ${infoTheme.glowColor} filter blur-[45px] opacity-15 pointer-events-none`} />

            <div className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-${theme.laserColor || 'blue-500'}/25 to-transparent pointer-events-none z-10`} />

            <CloseButton
                isProcessing={isDeleting}
                onClick={async (e) => {
                    e.stopPropagation();
                    setIsDeleting(true);
                    try {
                        await onAction(notif, 'DELETE');
                    } catch {
                        setIsDeleting(false);
                    }
                }}
            />

            <div className="relative z-10 w-full flex flex-col pr-7">
                <span className="text-[clamp(10px,0.6vw,11px)] font-sans font-bold text-slate-500 tracking-wider select-text uppercase">
                    {notif.createdAt}
                </span>

                <h3 className="text-[clamp(13px,0.8vw,14px)] font-display font-black text-white uppercase tracking-wide pt-0.5 select-text line-clamp-1">
                    {notif.title}
                </h3>

                <p className="text-[clamp(12px,0.72vw,13px)] text-slate-400 leading-relaxed font-sans font-medium select-text line-clamp-2 mt-0.5">
                    {notif.message}
                </p>
            </div>

            {hasActions && (
                <div className="relative mt-1 w-full z-10 flex items-center justify-end gap-2 pt-2.5">
                    <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#161f37]/90 to-transparent pointer-events-none" />

                    {notifType === 'INVITATION' && invitationId && (
                        <>
                            <ActionButton
                                variant="success"
                                onClick={() => onAction(notif, 'ACCEPT')}
                                className="px-3.5 h-[clamp(1.75rem,1.9vw,2rem)] text-[9px] font-sans font-bold tracking-wider uppercase rounded-md"
                            >
                                Aceptar
                            </ActionButton>
                            <ActionButton
                                variant="danger"
                                onClick={() => onAction(notif, 'REJECT')}
                                className="px-3.5 h-[clamp(1.75rem,1.9vw,2rem)] text-[9px] font-sans font-bold tracking-wider uppercase rounded-md"
                            >
                                Rechazar
                            </ActionButton>
                        </>
                    )}

                    {notifType === 'ALERT' && (
                        <ActionButton
                            variant="info"
                            onClick={() => onSelect(notif)}
                            className="px-4 h-[clamp(1.75rem,1.9vw,2rem)] text-[9px] font-sans font-bold tracking-wider uppercase rounded-md transition-all duration-150 active:scale-[0.96]"
                        >
                            Ver Detalles
                        </ActionButton>
                    )}
                </div>
            )}
        </div>
    );
}