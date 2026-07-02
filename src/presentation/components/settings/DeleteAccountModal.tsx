import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { deleteAccount } from "../../../infrastructure/api/delete-account-api";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function DeleteAccountModal({
    isOpen,
    onClose
}: Props) {

    const [confirmation, setConfirmation] = useState("");
    const handleDeleteAccount = async () => {

        if (confirmation !== "ELIMINAR") {

            toast.error("Debes escribir ELIMINAR.");

            return;

        }

        try {

            setLoading(true);

            await deleteAccount();

            toast.success("Cuenta eliminada correctamente.");

            logout();

            navigate("/login");

        } catch (error: any) {

            console.error(error);

            const message =
                error?.response?.data?.message
                ||
                "No se pudo eliminar la cuenta.";

            toast.error(message);

        } finally {

            setLoading(false);

        }

    };
    const navigate = useNavigate();

    const { logout } = useAuth();

    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

            <div className="w-full max-w-lg rounded-3xl bg-[#0d1222] border border-red-900/40 p-8">

                <h2 className="text-2xl font-bold text-red-500 mb-6">
                    Eliminar cuenta
                </h2>

                <p className="text-slate-300 leading-7 mb-6">

                    Esta acción es <span className="font-semibold text-red-400">permanente</span>.

                    <br /><br />

                    Se eliminará tu cuenta y no podrás recuperarla.

                    <br /><br />

                    Si todavía tienes personas protegidas o relaciones activas,
                    el sistema no permitirá eliminar tu cuenta.

                </p>

                <label className="block text-slate-400 mb-2">
                    Escribí <b>ELIMINAR</b> para continuar
                </label>

                <input
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                    className="w-full rounded-2xl bg-[#12141c] border border-[#1f2937] px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                />

                <div className="flex justify-end gap-3 mt-8">

                    <button
                        onClick={onClose}
                        className="px-5 py-3 rounded-2xl bg-white/10 text-white hover:bg-white/20"
                    >
                        Cancelar
                    </button>

                    <button

                        onClick={handleDeleteAccount}
                        disabled={
                            confirmation !== "ELIMINAR"
                            ||
                            loading
                        }
                        className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white"
                    >
                        Eliminar cuenta
                    </button>

                </div>

            </div>

        </div>

    );

}