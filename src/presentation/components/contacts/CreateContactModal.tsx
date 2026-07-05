import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { AddContactRequest } from "../../../infrastructure/api/contacts-api";
import AddContactForm from "./AddContactForm";
import toast from "react-hot-toast";

interface Props {
    onClose: () => void;
    onSuccess: () => void;
    onInvite: (data: AddContactRequest) => Promise<void>;
}

function CreateContactModal({ onClose, onSuccess, onInvite }: Props) {
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInvite = async (data: AddContactRequest) => {
        setIsLoading(true);
        try {
            await onInvite(data);
            onSuccess();
            setIsSent(true);
        } catch (error) {
            toast.error("No se pudo enviar la invitación");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0f172a] border border-[#1e293b] rounded-3xl p-6 md:p-8">

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Agregar contacto de confianza</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer text-lg"
                    >
                        ✕
                    </button>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed">
                    Invita a una persona de confianza para que pueda ayudar y acompañar a tu protegido.
                </p>

                {isSent ? (
                    <div className="flex flex-col items-center text-center py-12 px-4 gap-4">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                        <h3 className="text-xl font-bold text-white mt-2">¡Invitación enviada con éxito!</h3>
                        <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                            La solicitud fue depositada directamente en la bandeja de notificaciones
                            del contacto en tiempo real. Podrás ver su estado en cuanto sea aceptada.
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition cursor-pointer"
                        >
                            Entendido
                        </button>
                    </div>
                ) : (
                    <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
                        <AddContactForm onInvite={handleInvite} onCancel={onClose} />

                        {isLoading && (
                            <p className="text-sm text-blue-400 font-medium text-center mt-4 animate-pulse">
                                Enviando notificación en tiempo real...
                            </p>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default CreateContactModal;