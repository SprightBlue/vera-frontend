import { useState } from "react";
import { type AppNotification } from "@/features/notification/api/notificationsApi";
import { type NotificationType } from "@/features/shared/utils/typeConfig";
import { ActionButton } from "@/features/shared/components/ActionButton";
import { DeleteButton } from "@/features/shared/components/DeleteButton";

interface ItemProps {
    notif: AppNotification;
    onAction: (notif: AppNotification, action: 'ACCEPT' | 'REJECT' | 'DELETE') => void | Promise<void>;
    onSelect: (notif: AppNotification) => void;
    isDisabled?: boolean; // Prop para bloquear acciones si la app está procesando globalmente
}

export function NotificationItem({ notif, onAction, onSelect, isDisabled = false }: ItemProps) {
    const notifType = notif.type as NotificationType;
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const invitationId = notif.payload && typeof notif.payload === 'object'
        ? (notif.payload as Record<string, string | number>).id
        : null;

    const hasActions = notifType === 'ALERT' || (notifType === 'INVITATION' && invitationId);

    // Bloquear si se está borrando este item ESPECÍFICO o si hay un bloqueo externo
    const preventActions = isDeleting || isDisabled;

    return (
        <div
            className={`group rounded-xl border border-slate-800/80 bg-linear-to-b from-[#0f172a] to-[#020617] p-[clamp(0.9rem,1.2vw,1.3rem)] shadow-2xl relative overflow-hidden flex flex-col gap-3 transition-all duration-300 ring-1 ring-inset ring-slate-700/10 w-full ${
                preventActions ? "opacity-60 pointer-events-none" : ""
            }`}
        >
            <div
                className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-slate-500 filter blur-3xl opacity-10 pointer-events-none"
            />

            <div
                className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"
            />

            {/* Botón de borrado individual */}
            <div className="absolute top-2.5 right-2.5 z-20">
                <DeleteButton
                    isProcessing={isDeleting}
                    title="Eliminar notificación"
                    disabled={preventActions}
                    onClick={async (e) => {
                        e.stopPropagation();
                        if (preventActions) return;
                        setIsDeleting(true);

                        // Pequeña pausa para animación de salida de la UI
                        await new Promise(resolve => setTimeout(resolve, 300));
                        try {
                            await onAction(notif, 'DELETE');
                        } catch {
                            setIsDeleting(false);
                        }
                    }}
                />
            </div>

            <div className="flex flex-col justify-between min-w-0 flex-1 relative z-10 gap-2 items-start pr-6">
                <span
                    className="text-[clamp(9px,0.52vw,10px)] font-display font-extrabold text-slate-500 tracking-widest uppercase select-text leading-none"
                >
                    {notif.createdAt}
                </span>

                <div className="flex flex-col gap-1 w-full">
                    <h3 className="text-[clamp(12.5px,0.8vw,14px)] font-display font-black text-white line-clamp-1 tracking-wide uppercase select-text leading-snug">
                        {notif.title}
                    </h3>
                    <p className="text-[clamp(11px,0.7vw,12px)] font-sans font-medium text-slate-400 line-clamp-2 select-text leading-relaxed">
                        {notif.message}
                    </p>
                </div>
            </div>

            {hasActions && (
                <div className="flex flex-col gap-3 shrink-0 w-full border-t border-slate-800/60 pt-3 relative z-10">
                    <div className="w-full flex items-center justify-end gap-2">
                        {notifType === 'INVITATION' && invitationId && (
                            <>
                                <ActionButton
                                    variant="success"
                                    onClick={() => !preventActions && onAction(notif, 'ACCEPT')}
                                    disabled={preventActions}
                                    className="px-3.5 h-[clamp(1.75rem,1.9vw,2rem)] text-[9px] font-sans font-black tracking-wider uppercase rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Aceptar
                                </ActionButton>
                                <ActionButton
                                    variant="danger"
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