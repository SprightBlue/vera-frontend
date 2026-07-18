import { useState } from "react";
import { ActionButton } from "@/features/shared/components/ActionButton";
import { Mail, KeyRound, Edit2, Save, RotateCcw, AlertCircle, Eye, EyeOff } from "lucide-react";
import { type SettingsErrors } from "@/features/settings/hooks/useSettings";

interface EmailForm {
    newEmail: string;
    passwordConfirm: string;
}

interface ProfileEmailSectionProps {
    isEditing: boolean;
    saving: boolean;
    form: EmailForm;
    staticEmail: string;
    errors: SettingsErrors;
    onEditToggle: (editing: boolean) => void;
    onChange: (form: EmailForm) => void;
    onClearError: (field: keyof SettingsErrors) => void;
    onSave: () => void | Promise<void>;
}

export function ProfileEmailSection({
                                        isEditing,
                                        saving,
                                        form,
                                        staticEmail,
                                        errors,
                                        onEditToggle,
                                        onChange,
                                        onClearError,
                                        onSave
                                    }: ProfileEmailSectionProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleCancel = () => {
        onChange({ newEmail: "", passwordConfirm: "" });
        onClearError("newEmail");
        onClearError("passwordConfirm");
        setShowPassword(false);
        onEditToggle(false);
    };

    const handleInputChange = (field: keyof EmailForm, value: string) => {
        if (field === "newEmail") {
            const cleanEmail = value
                .toLowerCase()
                .replace(/\s/g, "")
                .replace(/,/g, ".")
                .replace(/[^a-z0-9@._\-+]/g, "");

            onChange({ ...form, newEmail: cleanEmail });
        } else {
            onChange({ ...form, [field]: value });
        }
        onClearError(field);
    };

    return (
        <section className="w-full flex flex-col gap-6 select-none relative z-10">

            <div className="w-full text-center sm:text-left">
                {/* Clases nativas de fuentes aplicadas */}
                <h3 className="heading-md normal-case mb-2.5">
                    Correo electrónico
                </h3>
                <p className="body-text">
                    Administrá la dirección de correo con la que ingresás y recuperás tu cuenta.
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
                            Confirmar
                        </ActionButton>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(1.2rem,1.5vw,1.8rem)]">

                <div className="flex flex-col gap-2" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    <label
                        className="text-xs font-semibold tracking-wide text-gray-500 normal-case pl-1">
                        Correo electrónico
                    </label>
                    <div className="relative flex items-center w-full">
                        <span className="absolute left-4 text-slate-500 flex items-center justify-center">
                            <Mail className="w-4 h-4" />
                        </span>
                        {isEditing ? (
                            <input
                                type="email"
                                value={form.newEmail}
                                onChange={e => handleInputChange("newEmail", e.target.value)}
                                disabled={saving}
                                className={`h-11 w-full bg-[#03050c]/90 text-slate-100 rounded-lg pl-11 pr-4 text-[13.5px] font-semibold outline-hidden transition-all shadow-inner border ${
                                    errors.newEmail
                                        ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                                        : "border-slate-800/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                                }`}
                                placeholder="Ej: nombre@correo.com"
                            />
                        ) : (
                            <div
                                className="h-11 w-full flex items-center pl-11 pr-4 bg-[#03050c]/40 border border-slate-800/20 rounded-lg text-[13.5px] font-semibold text-slate-300 select-text">
                                {staticEmail}
                            </div>
                        )}
                    </div>
                    {errors.newEmail ? (
                        <span
                            className="text-[11.5px] text-red-500 font-semibold leading-normal pl-1 flex items-center gap-1.5 animate-fadeIn">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {errors.newEmail}
                        </span>
                    ) : (
                        <span className="text-[11.5px] text-gray-400 font-medium leading-normal pl-1">
                            Este correo es esencial para recuperar tu cuenta en caso de que olvides tus datos de ingreso.
                        </span>
                    )}
                </div>

                {isEditing ? (
                    <div className="flex flex-col gap-2" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                        <label
                            className="text-xs font-semibold tracking-wide text-gray-500 normal-case pl-1">
                            Confirmar contraseña
                        </label>
                        <div className="relative flex items-center w-full">
                            <span className="absolute left-4 text-slate-500 flex items-center justify-center">
                                <KeyRound className="w-4 h-4" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={form.passwordConfirm}
                                onChange={e => handleInputChange("passwordConfirm", e.target.value)}
                                disabled={saving}
                                className={`h-11 w-full bg-[#03050c]/90 text-slate-100 rounded-lg pl-11 pr-11 text-[13.5px] font-semibold outline-hidden transition-all shadow-inner border ${
                                    errors.passwordConfirm
                                        ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                                        : "border-slate-800/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                                }`}
                                placeholder="Ingresá tu contraseña actual"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={saving}
                                className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors focus:outline-hidden disabled:opacity-50 flex items-center justify-center"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.passwordConfirm ? (
                            <span
                                className="text-[11.5px] text-red-500 font-semibold leading-normal pl-1 flex items-center gap-1.5 animate-fadeIn">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                {errors.passwordConfirm}
                            </span>
                        ) : (
                            <span className="text-[11.5px] text-gray-400 font-medium leading-normal pl-1">
                                Por motivos de seguridad, requerimos tu contraseña actual para validar que seas el dueño de la cuenta.
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="hidden md:flex flex-col gap-2 opacity-35" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                        <label
                            className="text-xs font-semibold tracking-wide text-slate-600 normal-case pl-1">
                            Contraseña inactiva
                        </label>
                        <div
                            className="h-11 w-full flex items-center pl-4 bg-slate-950/10 border border-dashed border-slate-900 rounded-lg text-[13px] font-medium text-slate-600">
                            Verificación de identidad inactiva
                        </div>
                        <span className="text-[11.5px] text-slate-600 font-medium leading-normal pl-1">
                            Solo se te pedirá tu contraseña actual si decidís iniciar el cambio de correo electrónico.
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
}