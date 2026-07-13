import { useState } from "react";
import { type AppNotification } from "@/features/notification/api/notificationsApi";
import { type NotificationType } from "@/features/shared/utils/typeConfig";
import { ActionButton } from "@/features/shared/components/ActionButton";
import { DeleteButton } from "@/features/shared/components/DeleteButton";

interface ItemProps {
    notif: AppNotification;
    onAction: (notif: AppNotification, action: 'ACCEPT' | 'REJECT' | 'DELETE') => void | Promise<void>;
    onSelect: (notif: AppNotification) => void;
}

export function NotificationItem({ notif, onAction, onSelect }: ItemProps) {
    const notifType = notif.type as NotificationType;

    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const invitationId = notif.payload && typeof notif.payload === 'object'
        ? (notif.payload as Record<string, string | number>).id
        : null;

    const hasActions = notifType === 'ALERT' || (notifType === 'INVITATION' && invitationId);

    return (
        <div className="w-full flex flex-col gap-2.5 rounded-xl border border-slate-800/80 bg-linear-to-b from-[#0f172a] to-[#020617] p-[clamp(0.85rem,1.2vw,1.2rem)] shadow-2xl relative overflow-hidden ring-1 ring-inset ring-slate-700/10">

            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-slate-500 filter blur-3xl opacity-5 pointer-events-none" />

            <div className="w-full flex items-center justify-between pr-8 select-none relative z-10">
                <span className="text-[clamp(10px,0.58vw,11px)] font-display font-extrabold text-slate-500 tracking-widest uppercase">
                    {notif.createdAt}
                </span>
            </div>

            <div className="absolute top-2.5 right-2.5 z-20">
                <DeleteButton
                    isProcessing={isDeleting}
                    title="Eliminar notificación"
                    onClick={async (e) => {
                        e.stopPropagation();
                        setIsDeleting(true);
                        await new Promise(resolve => setTimeout(resolve, 300));
                        try {
                            await onAction(notif, 'DELETE');
                        } catch {
                            setIsDeleting(false);
                        }
                    }}
                />
            </div>

            <div className="w-full flex flex-col pr-2 relative z-10">
                <h3 className="text-[clamp(13.5px,0.85vw,14.5px)] font-display font-black text-slate-100 uppercase tracking-wide select-text line-clamp-1">
                    {notif.title}
                </h3>

                <p className="text-[clamp(12px,0.74vw,13px)] text-slate-400 leading-relaxed font-sans font-medium select-text line-clamp-2 mt-1">
                    {notif.message}
                </p>
            </div>

            {hasActions && (
                <div className="mt-1 w-full flex flex-col gap-2.5 relative z-10">
                    <div className="h-px w-full bg-slate-800/60 pointer-events-none" />

                    <div className="w-full flex items-center justify-end gap-2">
                        {notifType === 'INVITATION' && invitationId && (
                            <>
                                <ActionButton
                                    variant="success"
                                    onClick={() => onAction(notif, 'ACCEPT')}
                                    className="px-3.5 h-[clamp(1.75rem,1.9vw,2rem)] text-[9px] font-sans font-black tracking-wider uppercase rounded-md shadow-md"
                                >
                                    Aceptar
                                </ActionButton>
                                <ActionButton
                                    variant="danger"
                                    onClick={() => onAction(notif, 'REJECT')}
                                    className="px-3.5 h-[clamp(1.75rem,1.9vw,2rem)] text-[9px] font-sans font-black tracking-wider uppercase rounded-md shadow-md"
                                >
                                    Rechazar
                                </ActionButton>
                            </>
                        )}

                        {notifType === 'ALERT' && (
                            <ActionButton
                                variant="info"
                                onClick={() => onSelect(notif)}
                                className="px-4 h-[clamp(1.75rem,1.9vw,2rem)] text-[9px] font-sans font-black tracking-wider uppercase rounded-md shadow-md"
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