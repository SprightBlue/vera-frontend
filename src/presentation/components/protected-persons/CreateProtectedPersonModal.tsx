import { useState } from "react";
import ProtectedPersonForm from "./ProtectedPersonForm.tsx";
import { createProtectedPerson, type CreateProtectedPersonRequest } from "../../../infrastructure/api/protected-person-api.ts";
import { CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { ActionButton } from "@/features/shared/components/ActionButton.tsx";

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

function CreateProtectedPersonModal({ onClose, onSuccess }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    async function handleCreate(formData: CreateProtectedPersonRequest) {
        setIsLoading(true);
        try {
            await createProtectedPerson(formData);
            setIsSent(true);
            onSuccess();
        } catch {
            toast.error("Ocurrió un error al enviar la invitación");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-500">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0f172a] border border-[#1e293b] rounded-3xl p-6 md:p-8">

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Invitar protegido</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer text-lg">
                        ✕
                    </button>
                </div>

                {isSent ? (
                    <div className="flex flex-col items-center text-center py-12 px-4 gap-4 animate-fade-in">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                        <h3 className="text-xl font-bold text-white mt-2">¡Invitación enviada con éxito!</h3>
                        <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                            La solicitud fue depositada directamente en la bandeja de notificaciones del protegido en tiempo real. Podrás ver su estado en tu panel en cuanto sea aceptada.
                        </p>
                        <ActionButton variant="info" onClick={onClose} className="mt-6">
                            Entendido
                        </ActionButton>
                    </div>
                ) : (
                    <div className={`mt-4 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
                        <ProtectedPersonForm
                            onClose={onClose}
                            onSubmit={handleCreate}
                        />

                        {isLoading && (
                            <p className="text-sm text-blue-400 font-medium text-center mt-4 animate-pulse">
                                Enviando notificación en tiempo real a la app...
                            </p>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default CreateProtectedPersonModal;