import { type AppNotification } from "../api/notifications.ts";

interface NotificationModalProps {
    pendingAction: {
        notif: AppNotification;
        type: 'ACCEPT' | 'REJECT' | 'DELETE';
    } | null;
    isProcessing: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export function NotificationModal({ pendingAction, isProcessing, onClose, onConfirm }: NotificationModalProps) {
    if (!pendingAction) return null;

    const getModalConfig = () => {
        switch (pendingAction.type) {
            case 'ACCEPT':
                return {
                    title: "¿Aceptar invitación?",
                    text: "Te unirás al círculo de confianza de este usuario.",
                    btnClass: "bg-emerald-600 hover:bg-emerald-500"
                };
            case 'REJECT':
                return {
                    title: "¿Rechazar invitación?",
                    text: "La invitación será declinada de forma permanente.",
                    btnClass: "bg-red-600 hover:bg-red-500"
                };
            case 'DELETE':
                return {
                    title: "¿Eliminar notificación?",
                    text: "Esta alerta o mensaje se quitará de tu historial.",
                    btnClass: "bg-red-600 hover:bg-red-500"
                };
            default:
                return { title: "", text: "", btnClass: "" };
        }
    };

    const modalConfig = getModalConfig();

    return (
        <div className="fixed inset-0 z-9999 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-slate-900 p-6 rounded-xl w-full max-w-sm border border-slate-800 shadow-2xl my-auto flex flex-col max-h-[calc(100vh-2rem)] overflow-y-auto">
                <h3 className="text-white font-bold text-lg">{modalConfig.title}</h3>
                <p className="text-slate-400 text-sm mt-2">{modalConfig.text}</p>

                <div className="flex gap-3 mt-6 shrink-0">
                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={onClose}
                        className="flex-1 py-2 bg-slate-800 text-white rounded font-medium disabled:opacity-50 cursor-pointer transition-colors hover:bg-slate-700"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={onConfirm}
                        className={`flex-1 py-2 text-white rounded font-medium disabled:opacity-50 transition-colors cursor-pointer ${modalConfig.btnClass}`}
                    >
                        {isProcessing ? "Procesando..." : "Confirmar"}
                    </button>
                </div>
            </div>
        </div>
    );
}