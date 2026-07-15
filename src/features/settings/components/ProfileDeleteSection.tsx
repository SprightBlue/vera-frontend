import {useState, type ChangeEvent} from "react";
import {ActionButton} from "@/features/shared/components/ActionButton";
import {UI_VARIANTS_MAP} from "@/features/shared/utils/styleConfig";
import {Trash2, KeyRound, RotateCcw, AlertCircle, Eye, EyeOff} from "lucide-react";

interface ProfileDeleteSectionProps {
    onDeleteAccount: (password?: string) => void | Promise<void>;
    isDeleting: boolean;
}

export function ProfileDeleteSection({onDeleteAccount, isDeleting}: ProfileDeleteSectionProps) {
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const dangerConfig = UI_VARIANTS_MAP.danger;

    const handleStartDelete = (): void => {
        setShowConfirm(true);
    };

    const handleCancel = (): void => {
        setShowConfirm(false);
        setPassword("");
        setError("");
        setShowPassword(false);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPassword(e.target.value);
        setError("");
    };

    const handleConfirmDelete = async (): Promise<void> => {
        if (!password.trim()) {
            setError("Por favor, ingresá tu contraseña para confirmar.");
            return;
        }

        setError("");

        try {
            await onDeleteAccount(password);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Ocurrió un error inesperado.");
            }
        }
    };

    return (
        <section
            className={`group rounded-xl border transition-all duration-300 relative overflow-hidden shadow-2xl w-full
                ${dangerConfig.permanentBorder} 
                ${dangerConfig.bgColor}
                ${dangerConfig.hoverBorders}
            `}
        >
            <div
                className={`absolute -right-16 -top-16 w-36 h-36 rounded-full opacity-20 blur-3xl pointer-events-none transition-all duration-500 group-hover:opacity-35 ${dangerConfig.glowColor}`}/>
            <div
                className={`absolute -left-16 -bottom-16 w-36 h-36 rounded-full opacity-10 blur-3xl pointer-events-none transition-all duration-500 group-hover:opacity-20 ${dangerConfig.glowColor}`}/>

            <div className="p-[clamp(1.2rem,2vw,2rem)] flex flex-col gap-6 relative z-10">

                <div
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${showConfirm ? 'opacity-40 transition-opacity duration-300' : ''}`}>
                    <div className="space-y-2 text-center sm:text-left">
                        <h3 className="text-[clamp(1.15rem,1.4vw,1.45rem)] font-display font-black uppercase text-red-200 tracking-wide leading-tight">
                            Eliminar Cuenta
                        </h3>
                        <p className="text-[clamp(13px,0.75vw,14px)] text-red-300/70 font-sans font-medium">
                            Esto borrará permanentemente todos tus datos personales, sesiones, historial y
                            configuraciones. No se puede deshacer.
                        </p>
                    </div>

                    {!showConfirm && (
                        <div className="shrink-0 flex items-center justify-center sm:self-center">
                            <ActionButton
                                variant="danger"
                                icon={Trash2}
                                onClick={handleStartDelete}
                            >
                                Eliminar
                            </ActionButton>
                        </div>
                    )}
                </div>

                {showConfirm && (
                    <div className="border-t border-red-500/20 pt-6 animate-fadeIn flex flex-col gap-5">
                        <div className="flex items-center gap-3 bg-red-950/40 border border-red-500/20 p-4 rounded-lg">
                            <div className="flex flex-col gap-0.5">
                                <h4 className="text-xs font-display font-bold text-red-200 uppercase tracking-wide leading-none">
                                    Se requiere confirmación de identidad
                                </h4>
                                <p className="text-[12px] text-red-300/80 font-sans font-medium leading-relaxed mt-1">
                                    Para evitar eliminaciones accidentales, ingresá tu contraseña actual para confirmar
                                    la baja definitiva.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 items-center w-full">

                            <div className="flex flex-col gap-2 w-full md:flex-1">
                                <div className="relative flex items-center w-full">
                                    <span className="absolute left-4 text-red-400/50 flex items-center justify-center">
                                        <KeyRound className="w-4 h-4"/>
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={handleInputChange}
                                        disabled={isDeleting}
                                        className={`h-11 w-full bg-[#03050c]/90 text-red-100 rounded-lg pl-11 pr-11 text-[13.5px] font-sans font-semibold outline-hidden transition-all shadow-inner border 
                                            ${error
                                            ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                                            : "border-red-950/30 focus:border-red-500/30 focus:ring-1 focus:ring-red-500/10"
                                        }`}
                                        placeholder="Escribí tu contraseña para confirmar"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isDeleting}
                                        className="absolute right-4 text-red-400/50 hover:text-red-300 transition-colors focus:outline-hidden disabled:opacity-50 flex items-center justify-center"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                    </button>
                                </div>

                                {error ? (
                                    <span
                                        className="text-[11.5px] text-red-500 font-sans font-semibold leading-none pl-1 flex items-center gap-1.5 animate-fadeIn">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0"/>
                                        {error}
                                    </span>
                                ) : (
                                    <span
                                        className="text-[11.5px] text-red-400/50 font-sans font-medium leading-none pl-1">
                                        Esta acción no tiene retorno. Por favor, confirmá a conciencia.
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-3 w-full md:w-auto shrink-0 h-11 items-center">
                                <ActionButton
                                    variant="neutral"
                                    icon={RotateCcw}
                                    disabled={isDeleting}
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </ActionButton>
                                <ActionButton
                                    variant="danger"
                                    icon={Trash2}
                                    isLoading={isDeleting}
                                    onClick={handleConfirmDelete}
                                >
                                    Eliminar
                                </ActionButton>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}