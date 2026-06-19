interface AlertActionModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    type: 'RESOLVE' | 'DELETE';
    isProcessing: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export function AlertActionModal({ isOpen, title, message, type, isProcessing, onClose, onConfirm }: AlertActionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-sm border border-slate-800 shadow-2xl">
                <h3 className="text-white font-bold text-lg">{title}</h3>
                <p className="text-slate-400 text-sm mt-2">{message}</p>

                <div className="flex gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="flex-1 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className={`flex-1 py-2 text-white rounded-lg font-medium transition-colors cursor-pointer ${
                            type === 'DELETE' ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'
                        }`}
                    >
                        {isProcessing ? "Procesando..." : "Confirmar"}
                    </button>
                </div>
            </div>
        </div>
    );
}