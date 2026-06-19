interface ChatDeleteModalProps {
    isOpen: boolean;
    isProcessing: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export function ChatDeleteModal({ isOpen, isProcessing, onClose, onConfirm }: ChatDeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-9999 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-slate-900 p-6 rounded-xl w-full max-w-sm border border-slate-800 shadow-2xl my-auto flex flex-col max-h-[calc(100vh-2rem)] overflow-y-auto analysis-appear">
                <h3 className="text-white font-bold font-montserrat text-lg">¿Eliminar consulta?</h3>
                <p className="text-slate-400 font-inter text-sm mt-2">
                    Esta sesión de chat e historial de análisis con VERA se quitará de forma permanente de tu historial.
                </p>

                <div className="flex gap-3 mt-6 shrink-0">
                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={onClose}
                        className="flex-1 py-2.5 bg-slate-800 text-white rounded-xl font-medium text-sm disabled:opacity-50 cursor-pointer transition-colors hover:bg-slate-700 font-inter"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={onConfirm}
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium text-sm disabled:opacity-50 transition-colors cursor-pointer font-inter"
                    >
                        {isProcessing ? "Eliminando..." : "Eliminar"}
                    </button>
                </div>
            </div>
        </div>
    );
}