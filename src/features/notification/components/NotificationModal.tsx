import { type AppNotification } from "../api/notifications.ts";

interface NotificationModalProps {
    pendingAction: { notif: AppNotification; type: 'ACCEPT' | 'REJECT' | 'DELETE' } | null;
    isProcessing: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export function NotificationModal({ pendingAction, isProcessing, onClose, onConfirm }: NotificationModalProps) {
    if (!pendingAction) return null;

    const config = {
        ACCEPT: { title: "¿Aceptar invitación?", text: "Se unirá a tu círculo de confianza.", btn: "bg-blue-600 hover:bg-blue-500" },
        REJECT: { title: "¿Rechazar invitación?", text: "La invitación será descartada permanentemente.", btn: "bg-slate-700 hover:bg-slate-600" },
        DELETE: { title: "¿Eliminar notificación?", text: "Esta acción no se puede deshacer.", btn: "bg-red-600 hover:bg-red-500" }
    }[pendingAction.type];

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#070B1A] border border-slate-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative">
                <h3 className="text-white font-bold text-lg">{config.title}</h3>
                <p className="text-slate-400 text-sm mt-2">{config.text}</p>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="flex-1 py-2 bg-slate-900 text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className={`flex-1 py-2 text-white rounded-xl text-sm font-bold transition-all cursor-pointer ${config.btn}`}
                    >
                        {isProcessing ? "Procesando..." : "Confirmar"}
                    </button>
                </div>
            </div>
        </div>
    );
}