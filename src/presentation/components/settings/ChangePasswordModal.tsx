import { useState } from "react";
import {
    changePassword,
    type ChangePasswordRequest
} from "../../../infrastructure/api/password-api";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { ActionButton } from "@/features/shared/components/ActionButton";

interface Props {

    isOpen: boolean;

    onClose: () => void;

}

export default function ChangePasswordModal({

    isOpen,
    onClose

}: Props) {

    const [form, setForm] = useState<ChangePasswordRequest>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    

    if (!isOpen) return null;

    const handleSubmit = async () => {

        if (!form.currentPassword.trim()) {
            toast.error("Ingresá tu contraseña actual.");
            return;
        }

        if (!form.newPassword.trim()) {
            toast.error("Ingresá una nueva contraseña.");
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            toast.error("Las contraseñas no coinciden.");
            return;
        }

        try {

            setLoading(true);

            await changePassword(form);

            toast.success("Contraseña actualizada correctamente.");

            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            onClose();

        } catch {

            toast.error("No se pudo cambiar la contraseña.");

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-[#0d1222] border border-[#182033] p-8">

                <h2 className="text-2xl font-bold text-white mb-6">
                    Cambiar contraseña
                </h2>

                <div className="space-y-4">

                    <div>
                        <label className="block text-slate-400 mb-2">
                            Contraseña actual
                        </label>

                        <div className="relative">

                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={form.currentPassword}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        currentPassword: e.target.value
                                    })
                                }
                                className="w-full rounded-2xl bg-[#12141c] border border-[#1f2937] px-4 pr-12 py-3 text-white focus:border-blue-500 focus:outline-none"
                            />

                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>

                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-2">
                            Nueva contraseña
                        </label>

                        <div className="relative">

                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={form.newPassword}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        newPassword: e.target.value
                                    })
                                }
                                className="w-full rounded-2xl bg-[#12141c] border border-[#1f2937] px-4 pr-12 py-3 text-white focus:border-blue-500 focus:outline-none"
                            />

                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>

                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-2">
                            Confirmar contraseña
                        </label>

                        <div className="relative">

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={form.confirmPassword}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        confirmPassword: e.target.value
                                    })
                                }
                                className="w-full rounded-2xl bg-[#12141c] border border-[#1f2937] px-4 pr-12 py-3 text-white focus:border-blue-500 focus:outline-none"
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>

                        </div>
                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-8">

                    <ActionButton
                        variant="neutral"
                        onClick={() => {
                            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                            onClose();
                        }}
                    >
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