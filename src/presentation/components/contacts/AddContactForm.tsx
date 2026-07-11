import { useState } from "react";
import { UserPlus } from "lucide-react";
import axios from "axios";
import type { AddContactRequest } from "../../../infrastructure/api/contacts-api";
import { ActionButton } from "@/features/shared/components/ActionButton";

interface Props {
    onInvite: (data: AddContactRequest) => Promise<void>;
    onCancel: () => void;
}

const RELATIONSHIPS = [
    { value: "Familiar",              label: "Familiar" },
    { value: "Amigo/a",               label: "Amigo/a" },
    { value: "Vecino/a",              label: "Vecino/a" },
    { value: "Profesional",           label: "Profesional" },
    { value: "Contacto de confianza", label: "Otro contacto de confianza" },
];

const EMPTY: AddContactRequest = {
    fullName: "",
    contactPhone: "",
    contactEmail: "",
    relationship: "",
    sensitivityLevel: "MEDIO",
    notifyHighRisk: true,
    receiveAlertSummaries: false,
};

function AddContactForm({ onInvite, onCancel }: Props) {
    const [form, setForm] = useState<AddContactRequest>(EMPTY);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const set = <K extends keyof AddContactRequest>(field: K, value: AddContactRequest[K]) =>
        setForm(prev => ({ ...prev, [field]: value }));

    const validate = () => {
        if (!form.fullName.trim()) return "El nombre completo es obligatorio.";
        if (!form.contactEmail.trim()) return "El email es obligatorio.";
        if (!form.relationship) return "Seleccioná el tipo de relación.";
        return null;
    };

    const handleSubmit = async () => {
        const validationError = validate();
        if (validationError) { setError(validationError); return; }
        setSaving(true);
        setError(null);
        try {
            await onInvite(form);
            setForm(EMPTY);
        } catch (err: unknown) {
            let msg: string | null = null;
            if (axios.isAxiosError(err)) {
                msg = typeof err.response?.data === "string" ? err.response.data : null;
            }
            setError(msg ?? "No se pudo enviar la invitación. Verificá que el email tenga una cuenta VERA.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">

            {/* Información personal */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 flex flex-col gap-5">
                <h4 className="text-white font-semibold text-sm">Información Personal</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-400 font-medium">
                            Nombre completo <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: Juan García"
                            value={form.fullName}
                            onChange={e => set("fullName", e.target.value)}
                            className="w-full bg-[#0b1220] border border-[#1e293b] rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-400 font-medium">Número de teléfono</label>
                        <input
                            type="tel"
                            placeholder="+54 11 5555 5555"
                            value={form.contactPhone ?? ""}
                            onChange={e => set("contactPhone", e.target.value)}
                            className="w-full bg-[#0b1220] border border-[#1e293b] rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-400 font-medium">
                            Email <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Ej: juan@email.com"
                            value={form.contactEmail}
                            onChange={e => set("contactEmail", e.target.value)}
                            className="w-full bg-[#0b1220] border border-[#1e293b] rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-400 font-medium">
                            Parentesco o relación <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={form.relationship}
                            onChange={e => set("relationship", e.target.value)}
                            className="w-full bg-[#0b1220] border border-[#1e293b] rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                        >
                            <option value="" disabled>Seleccionar relación</option>
                            {RELATIONSHIPS.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Configuración de Protección — igual a ProtectedPersonForm */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 flex flex-col gap-5">
                <h4 className="text-white font-semibold text-sm">Configuración de Protección</h4>

                {/* Alertas de Riesgo Alto */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white text-sm font-medium">Alertas de Riesgo Alto</p>
                        <p className="text-xs text-slate-500 mt-0.5">Notificaciones inmediatas ante amenazas.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => set("notifyHighRisk", !form.notifyHighRisk)}
                        className={`w-14 h-8 rounded-full transition-all relative flex-shrink-0 cursor-pointer ${
                            form.notifyHighRisk ? "bg-blue-600" : "bg-slate-700"
                        }`}
                    >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow ${
                            form.notifyHighRisk ? "left-7" : "left-1"
                        }`} />
                    </button>
                </div>

                {/* Resúmenes Semanales */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white text-sm font-medium">Resúmenes Semanales</p>
                        <p className="text-xs text-slate-500 mt-0.5">Recibir informes consolidados cada semana.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => set("receiveAlertSummaries", !form.receiveAlertSummaries)}
                        className={`w-14 h-8 rounded-full transition-all relative flex-shrink-0 cursor-pointer ${
                            form.receiveAlertSummaries ? "bg-blue-600" : "bg-slate-700"
                        }`}
                    >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow ${
                            form.receiveAlertSummaries ? "left-7" : "left-1"
                        }`} />
                    </button>
                </div>

                {/* Sensibilidad de Notificaciones */}
                <div>
                    <p className="text-white text-sm font-medium mb-1">Sensibilidad de Notificaciones</p>
                    <p className="text-xs text-slate-500 mb-3">Ajustá la frecuencia con la que VERA enviará alertas a este contacto.</p>
                    <div className="flex gap-3">
                        {(["BAJO", "MEDIO", "ALTO"] as const).map(level => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => set("sensitivityLevel", level)}
                                className={`px-5 py-2 rounded-xl border transition-all cursor-pointer text-sm font-medium ${
                                    form.sensitivityLevel === level
                                        ? "bg-blue-600 border-blue-500 text-white"
                                        : "border-[#1f2937] bg-[#070B1A] text-slate-300 hover:text-white"
                                }`}
                            >
                                {level === "BAJO" ? "Bajo" : level === "MEDIO" ? "Medio" : "Alto"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {error && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <div className="flex items-center justify-end gap-3">
                <ActionButton variant="neutral" onClick={onCancel} disabled={saving}>
                    Cancelar
                </ActionButton>
                <ActionButton
                    variant="info"
                    icon={UserPlus}
                    disabled={saving}
                    isLoading={saving}
                    onClick={() => void handleSubmit()}
                >
                    {saving ? "Enviando..." : "Agregar contacto"}
                </ActionButton>
            </div>

            <p className="text-xs text-slate-600">
                La persona debe tener una cuenta activa en VERA. Recibirá una notificación para aceptar la invitación.
            </p>
        </div>
    );
}

export default AddContactForm;