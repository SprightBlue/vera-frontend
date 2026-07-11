import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { changeEmail, type ChangeEmailRequest } from "../../../infrastructure/api/email-api";
import { useAuth } from "../../context/AuthContext";
import { ActionButton } from "@/features/shared/components/ActionButton";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChangeEmailModal({
    isOpen,
    onClose
}: Props) {

    const { updateUser } = useAuth();

    const [form, setForm] = useState<ChangeEmailRequest>({
        newEmail: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {

        if (!form.newEmail || !form.password) {
            toast.error("Completá todos los campos.");
            return;
        }

        try {

            setLoading(true);

            await changeEmail(form);

            updateUser({
                email: form.newEmail
            });

            toast.success("Correo actualizado correctamente.");

            onClose();

        } catch {

            toast.error("No se pudo cambiar el correo.");

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-3xl bg-[#0d1222] border border-[#182033] p-8">

                <h2 className="text-2xl font-bold text-white mb-6">
                    Cambiar correo electrónico
                </h2>

                <p className="text-slate-400 mb-6">
                    Ingresá tu nuevo correo y confirmá tu contraseña.
                </p>

                <div className="space-y-5">

                    <div>

                        <label className="block text-slate-400 mb-2">
                            Nuevo correo electrónico
                        </label>

                        <input
                            type="email"
                            value={form.newEmail}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    newEmail: e.target.value
                                })
                            }
                            className="w-full rounded-2xl bg-[#12141c] border border-[#1f2937] px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        />

                    </div>

                    <div>

                        <label className="block text-slate-400 mb-2">
                            Contraseña
                        </label>

                        <div className="relative">

                            <input
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value
                                    })
                                }
                                className="w-full rounded-2xl bg-[#12141c] border border-[#1f2937] px-4 py-3 pr-12 text-white focus:border-blue-500 focus:outline-none"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                {
                                    showPassword
                                        ? <EyeOff size={20} />
                                        : <Eye size={20} />
                                }
                            </button>

                        </div>

                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-8">

                    <ActionButton variant="neutral" onClick={onClose}>
                        Cancelar
                    </ActionButton>

                    <ActionButton
                        variant="success"
                        onClick={handleSubmit}
                        disabled={loading}
                        isLoading={loading}
                    >
                        {loading ? "Actualizando..." : "Guardar"}
                    </ActionButton>

                </div>

            </div>

        </div>
    );
}