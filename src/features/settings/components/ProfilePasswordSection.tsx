import {useState} from "react";
import {ActionButton} from "@/features/shared/components/ActionButton";
import {KeyRound, Edit2, Save, RotateCcw, AlertCircle, Eye, EyeOff} from "lucide-react";
import {type SettingsErrors} from "@/features/settings/hooks/useSettings";

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ProfilePasswordSectionProps {
    isEditing: boolean;
    saving: boolean;
    form: PasswordForm;
    errors: SettingsErrors;
    onEditToggle: (editing: boolean) => void;
    onChange: (form: PasswordForm) => void;
    onClearError: (field: keyof SettingsErrors) => void;
    onSave: () => void | Promise<void>;
}

export function ProfilePasswordSection({
                                           isEditing,
                                           saving,
                                           form,
                                           errors,
                                           onEditToggle,
                                           onChange,
                                           onClearError,
                                           onSave
                                       }: ProfilePasswordSectionProps) {
    const [showCurrent, setShowCurrent] = useState<boolean>(false);
    const [showNew, setShowNew] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const handleCancel = () => {
        onChange({currentPassword: "", newPassword: "", confirmPassword: ""});
        onClearError("currentPassword");
        onClearError("newPassword");
        onClearError("confirmPassword");
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
        onEditToggle(false);
    };

    const handleInputChange = (field: keyof PasswordForm, value: string) => {
        onChange({...form, [field]: value});
        onClearError(field);
    };

    return (
        <section className="w-full flex flex-col gap-6 select-none relative z-10">

            <div className="w-full text-center sm:text-left">
                <h3 className="text-[13px] sm:text-sm font-display font-black uppercase text-white tracking-wider leading-none mb-2.5">
                    Contraseña de Ingreso
                </h3>
                <p className="text-[clamp(13px,0.75vw,14px)] text-slate-400 font-sans font-medium">
                    Actualizá tu contraseña periódicamente para mantener tu cuenta resguardada de accesos no
                    autorizados.
                </p>
            </div>

            <div className="flex items-center justify-center sm:justify-end w-full -mt-2">
                {!isEditing ? (
                    <ActionButton
                        variant="info"
                        icon={Edit2}
                        onClick={() => onEditToggle(true)}
                    >
                        Cambiar
                    </ActionButton>
                ) : (
                    <div className="flex gap-3 w-full sm:w-auto">
                        <ActionButton
                            variant="neutral"
                            icon={RotateCcw}
                            disabled={saving}
                            onClick={handleCancel}
                        >
                            Cancelar
                        </ActionButton>
                        <ActionButton
                            variant="success"
                            icon={Save}
                            isLoading={saving}
                            onClick={onSave}
                        >
                            Guardar
                        </ActionButton>
                    </div>
                )}
            </div>

            {!isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(1.2rem,1.5vw,1.8rem)]">

                    <div className="flex flex-col gap-2">
                        <label
                            className="text-[10px] font-display font-extrabold tracking-widest text-slate-500 uppercase pl-1">
                            Contraseña Activa
                        </label>
                        <div className="relative flex items-center w-full">
                            <span className="absolute left-4 text-slate-500">
                                <KeyRound className="w-4 h-4"/>
                            </span>
                            <div
                                className="h-11 w-full flex items-center pl-11 pr-4 bg-[#03050c]/40 border border-slate-800/20 rounded-lg text-[13.5px] font-sans font-semibold text-slate-500 select-none tracking-widest">
                                ••••••••••••••••
                            </div>
                        </div>
                        <span className="text-[11.5px] text-slate-500 font-sans font-medium leading-normal pl-1">
                            Tu información de acceso se encuentra encriptada de forma segura.
                        </span>
                    </div>

                    <div className="hidden md:flex flex-col gap-2 opacity-35">
                        <label
                            className="text-[10px] font-display font-extrabold tracking-widest text-slate-600 uppercase pl-1">
                            Nueva Contraseña
                        </label>
                        <div
                            className="h-11 w-full flex items-center pl-4 bg-slate-950/10 border border-dashed border-slate-900 rounded-lg text-[13px] font-sans font-medium text-slate-600">
                            Modificación inactiva
                        </div>
                        <span className="text-[11.5px] text-slate-600 font-sans font-medium leading-normal pl-1">
                            Se habilitará para edición cuando decidas cambiar tu contraseña.
                        </span>
                    </div>

                    <div className="hidden md:flex flex-col gap-2 opacity-35">
                        <label
                            className="text-[10px] font-display font-extrabold tracking-widest text-slate-600 uppercase pl-1">
                            Verificación inactiva
                        </label>
                        <div
                            className="h-11 w-full flex items-center pl-4 bg-slate-950/10 border border-dashed border-slate-900 rounded-lg text-[13px] font-sans font-medium text-slate-600">
                            Confirmación inactiva
                        </div>
                        <span className="text-[11.5px] text-slate-600 font-sans font-medium leading-normal pl-1">
                            Este campo te servirá para reescribir tu nueva contraseña y validarla.
                        </span>
                    </div>

                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(1rem,1.2vw,1.5rem)]">

                    <div className="flex flex-col gap-2">
                        <label
                            className="text-[10px] font-display font-extrabold tracking-widest text-slate-500 uppercase pl-1">
                            Contraseña Actual
                        </label>
                        <div className="relative flex items-center w-full">
                            <span className="absolute left-4 text-slate-500 flex items-center justify-center">
                                <KeyRound className="w-4 h-4"/>
                            </span>
                            <input
                                type={showCurrent ? "text" : "password"}
                                value={form.currentPassword}
                                onChange={e => handleInputChange("currentPassword", e.target.value)}
                                disabled={saving}
                                className={`h-11 w-full bg-[#03050c]/90 text-slate-100 rounded-lg pl-11 pr-11 text-[13.5px] font-sans font-semibold outline-hidden transition-all shadow-inner border ${
                                    errors.currentPassword
                                        ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                                        : "border-slate-800/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                                }`}
                                placeholder="Ingresá tu clave de hoy"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                disabled={saving}
                                className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors focus:outline-hidden disabled:opacity-50 flex items-center justify-center"
                            >
                                {showCurrent ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                            </button>
                        </div>
                        {errors.currentPassword ? (
                            <span
                                className="text-[11.5px] text-red-500 font-sans font-semibold leading-normal pl-1 flex items-center gap-1.5 animate-fadeIn">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0"/>
                                {errors.currentPassword}
                            </span>
                        ) : (
                            <span className="text-[11.5px] text-slate-500 font-sans font-medium leading-normal pl-1">
                                Tu contraseña actual para verificar que sos vos.
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            className="text-[10px] font-display font-extrabold tracking-widest text-slate-500 uppercase pl-1">
                            Nueva Contraseña
                        </label>
                        <div className="relative flex items-center w-full">
                            <span className="absolute left-4 text-slate-500 flex items-center justify-center">
                                <KeyRound className="w-4 h-4"/>
                            </span>
                            <input
                                type={showNew ? "text" : "password"}
                                value={form.newPassword}
                                onChange={e => handleInputChange("newPassword", e.target.value)}
                                disabled={saving}
                                className={`h-11 w-full bg-[#03050c]/90 text-slate-100 rounded-lg pl-11 pr-11 text-[13.5px] font-sans font-semibold outline-hidden transition-all shadow-inner border ${
                                    errors.newPassword
                                        ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                                        : "border-slate-800/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                                }`}
                                placeholder="Ingresá la nueva clave"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                disabled={saving}
                                className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors focus:outline-hidden disabled:opacity-50 flex items-center justify-center"
                            >
                                {showNew ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                            </button>
                        </div>
                        {errors.newPassword ? (
                            <span
                                className="text-[11.5px] text-red-500 font-sans font-semibold leading-normal pl-1 flex items-center gap-1.5 animate-fadeIn">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0"/>
                                {errors.newPassword}
                            </span>
                        ) : (
                            <span className="text-[11.5px] text-slate-500 font-sans font-medium leading-normal pl-1">
                                Recordá que debe ser diferente a la anterior.
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            className="text-[10px] font-display font-extrabold tracking-widest text-slate-500 uppercase pl-1">
                            Confirmar Contraseña
                        </label>
                        <div className="relative flex items-center w-full">
                            <span className="absolute left-4 text-slate-500 flex items-center justify-center">
                                <KeyRound className="w-4 h-4"/>
                            </span>
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={form.confirmPassword}
                                onChange={e => handleInputChange("confirmPassword", e.target.value)}
                                disabled={saving}
                                className={`h-11 w-full bg-[#03050c]/90 text-slate-100 rounded-lg pl-11 pr-11 text-[13.5px] font-sans font-semibold outline-hidden transition-all shadow-inner border ${
                                    errors.confirmPassword
                                        ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                                        : "border-slate-800/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                                }`}
                                placeholder="Repetir nueva contraseña"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                disabled={saving}
                                className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors focus:outline-hidden disabled:opacity-50 flex items-center justify-center"
                            >
                                {showConfirm ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                            </button>
                        </div>
                        {errors.confirmPassword ? (
                            <span
                                className="text-[11.5px] text-red-500 font-sans font-semibold leading-normal pl-1 flex items-center gap-1.5 animate-fadeIn">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0"/>
                                {errors.confirmPassword}
                            </span>
                        ) : (
                            <span className="text-[11.5px] text-slate-500 font-sans font-medium leading-normal pl-1">
                                Volvé a escribir la contraseña para evitar errores de escritura.
                            </span>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}