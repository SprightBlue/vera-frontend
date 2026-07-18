import { ActionButton } from "@/features/shared/components/ActionButton";
import { User, Phone, Edit2, Save, RotateCcw, AlertCircle } from "lucide-react";
import { type SettingsErrors } from "@/features/settings/hooks/useSettings";

interface ProfileDataForm {
    fullName: string;
    phone: string;
}

interface ProfileDataSectionProps {
    isEditing: boolean;
    saving: boolean;
    form: ProfileDataForm;
    staticName: string;
    staticPhone: string | null;
    onEditToggle: (editing: boolean) => void;
    onChange: (form: ProfileDataForm) => void;
    onSave: () => void | Promise<void>;
    errors: SettingsErrors;
    onClearError: (field: keyof SettingsErrors) => void;
}

export function ProfileDataSection({
                                       isEditing,
                                       saving,
                                       form,
                                       staticName,
                                       staticPhone,
                                       onEditToggle,
                                       onChange,
                                       onSave,
                                       errors,
                                       onClearError
                                   }: ProfileDataSectionProps) {

    const handleCancel = () => {
        onChange({ fullName: staticName, phone: staticPhone ?? "" });
        onClearError("fullName");
        onClearError("phone");
        onEditToggle(false);
    };

    const formatPhoneNumber = (value: string): string => {
        const numbers = value.replace(/\D/g, "");

        if (!numbers.length) return "";

        if (numbers.startsWith("54")) {
            let formatted = "+";
            formatted += numbers.slice(0, 2);

            if (numbers.length > 2) {
                formatted += " " + numbers.slice(2, 3);
            }
            if (numbers.length > 3) {
                formatted += " " + numbers.slice(3, 5);
            }
            if (numbers.length > 5) {
                formatted += " " + numbers.slice(5, 9);
            }
            if (numbers.length > 9) {
                formatted += "-" + numbers.slice(9, 13);
            }
            return formatted;
        }

        let formatted = "";
        if (numbers.length > 0) {
            formatted += numbers.slice(0, 2);
        }
        if (numbers.length > 2) {
            formatted += " " + numbers.slice(2, 6);
        }
        if (numbers.length > 6) {
            formatted += "-" + numbers.slice(6, 10);
        }
        return formatted;
    };

    const handleInputChange = (field: keyof ProfileDataForm, value: string) => {
        if (field === "phone") {
            const formattedPhone = formatPhoneNumber(value);
            onChange({ ...form, phone: formattedPhone });
        } else {
            onChange({ ...form, [field]: value });
        }
        onClearError(field);
    };

    return (
        <section className="w-full flex flex-col gap-6 select-none relative z-10">

            <div className="w-full text-center sm:text-left">
                {/* Aplicando la clase heading-md en formato normal */}
                <h3 className="heading-md normal-case mb-2.5">
                    Datos personales
                </h3>
                {/* Aplicando la clase body-text */}
                <p className="body-text">
                    Modificá tu nombre público y tus vías de comunicación directa. <span
                    className="text-gray-500 italic">(El teléfono es opcional)</span>.
                </p>
            </div>

            <div className="flex items-center justify-center sm:justify-end w-full -mt-2">
                {!isEditing ? (
                    <ActionButton
                        variant="info"
                        icon={Edit2}
                        onClick={() => onEditToggle(true)}
                    >
                        Editar
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(1.2rem,1.5vw,1.8rem)]">

                {/* Los inputs y labels de abajo siguen heredando la fuente 'Inter' del Sidebar/Body de manera fluida */}
                <div className="flex flex-col gap-2" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    <label
                        className="text-xs font-semibold tracking-wide text-gray-500 normal-case pl-1">
                        Nombre de usuario
                    </label>
                    <div className="relative flex items-center w-full">
                        <span className="absolute left-4 text-slate-500">
                            <User className="w-4 h-4" />
                        </span>
                        {isEditing ? (
                            <input
                                type="text"
                                value={form.fullName}
                                onChange={e => handleInputChange("fullName", e.target.value)}
                                disabled={saving}
                                className={`h-11 w-full bg-[#03050c]/90 text-slate-100 rounded-lg pl-11 pr-4 text-[13.5px] font-semibold outline-hidden transition-all shadow-inner border ${
                                    errors.fullName
                                        ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                                        : "border-slate-800/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                                }`}
                                placeholder="Ingresá tu nombre"
                            />
                        ) : (
                            <div
                                className="h-11 w-full flex items-center pl-11 pr-4 bg-[#03050c]/40 border border-slate-800/20 rounded-lg text-[13.5px] font-semibold text-slate-300 select-text">
                                {staticName}
                            </div>
                        )}
                    </div>
                    {errors.fullName ? (
                        <span
                            className="text-[11.5px] text-red-500 font-semibold leading-normal pl-1 flex items-center gap-1.5 animate-fadeIn">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {errors.fullName}
                        </span>
                    ) : (
                        <span className="text-[11.5px] text-gray-400 font-medium leading-normal pl-1">
                            Tu nombre o alias público que se mostrará a otros usuarios dentro de la plataforma.
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    <label
                        className="text-xs font-semibold tracking-wide text-gray-500 normal-case pl-1">
                        Teléfono de contacto <span
                        className="text-[11px] text-gray-600 italic font-medium">(opcional)</span>
                    </label>
                    <div className="relative flex items-center w-full">
                        <span className="absolute left-4 text-slate-500">
                            <Phone className="w-4 h-4" />
                        </span>
                        {isEditing ? (
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={form.phone}
                                onChange={e => handleInputChange("phone", e.target.value)}
                                disabled={saving}
                                className={`h-11 w-full bg-[#03050c]/90 text-slate-100 rounded-lg pl-11 pr-4 text-[13.5px] font-semibold outline-hidden transition-all shadow-inner border ${
                                    errors.phone
                                        ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                                        : "border-slate-800/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                                }`}
                                placeholder="Ej: 11 2345-6789"
                            />
                        ) : (
                            <div
                                className="h-11 w-full flex items-center pl-11 pr-4 bg-[#03050c]/40 border border-slate-800/20 rounded-lg text-[13.5px] font-semibold text-slate-300 select-text">
                                {staticPhone || "No registrado"}
                            </div>
                        )}
                    </div>
                    {errors.phone ? (
                        <span
                            className="text-[11.5px] text-red-500 font-semibold leading-normal pl-1 flex items-center gap-1.5 animate-fadeIn">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {errors.phone}
                        </span>
                    ) : (
                        <span className="text-[11.5px] text-gray-400 font-medium leading-normal pl-1">
                            Número telefónico para avisos importantes y verificaciones de cuenta.
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
}