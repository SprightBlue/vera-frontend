import { useState } from "react";
import { X, UserPlus, Link } from "lucide-react";
import type { AddContactRequest, InviteContactResponse } from "../../../infrastructure/api/contacts-api";

interface Props {
    onAdd: (data: AddContactRequest) => Promise<void>;
    onInvite: (data: AddContactRequest) => Promise<InviteContactResponse>;
    onCancel: () => void;
}

const RELATIONSHIPS = [
    { value: "Familiar",                  label: "Familiar" },
    { value: "Amigo/a",                   label: "Amigo/a" },
    { value: "Vecino/a",                  label: "Vecino/a" },
    { value: "Profesional",               label: "Profesional" },
    { value: "Contacto de confianza",     label: "Otro contacto de confianza" },
];

const EMPTY: AddContactRequest = {
    fullName: "",
    contactPhone: "",
    contactEmail: "",
    relationship: "",
    emergencyContact: false,
};

function AddContactForm({ onAdd, onInvite, onCancel }: Props) {
    const [form, setForm] = useState<AddContactRequest>(EMPTY);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const set = <K extends keyof AddContactRequest>(field: K, value: AddContactRequest[K]) =>
        setForm(prev => ({ ...prev, [field]: value }));

    const validate = () => {
        if (!form.fullName.trim()) return "El nombre completo es obligatorio.";
        if (!form.contactEmail.trim()) return "El email es obligatorio.";
        if (!form.relationship) return "Seleccioná el tipo de relación.";
        return null;
    };

    const handleSubmit = async (mode: "add" | "invite") => {
        const validationError = validate();
        if (validationError) { setError(validationError); return; }
        setSaving(true);
        setError(null);
        try {
            if (mode === "add") {
                await onAdd(form);
                setForm(EMPTY);
            } else {
                const res = await onInvite(form);
                setInviteLink(res.invitationLink);
                setForm(EMPTY);
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : null;
            setError(msg ?? (mode === "add"
                ? "No se pudo agregar el contacto. Verificá que el email tenga una cuenta VERA."
                : "No se pudo generar la invitación. Intentá de nuevo."));
        } finally {
            setSaving(false);
        }
    };

    const handleCopy = () => {
        if (!inviteLink) return;
        void navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (inviteLink) {
        return (
            <div className="p-6 rounded-2xl bg-[#070B1A] border border-blue-500/20">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-white font-semibold text-base">Invitación generada</h3>
                    <button onClick={onCancel} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                        <X size={16} />
                    </button>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                    Compartí este link con el contacto. La invitación expira en <span className="text-white font-medium">7 días</span>.
                </p>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <p className="text-sm text-blue-400 truncate flex-1">{inviteLink}</p>
                    <button
                        onClick={handleCopy}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex-shrink-0 transition-colors"
                    >
                        {copied ? "¡Copiado!" : "Copiar"}
                    </button>
                </div>
                <button
                    onClick={onCancel}
                    className="mt-4 w-full px-4 py-2 rounded-xl text-slate-400 text-sm font-medium hover:text-white hover:bg-white/5 border border-[#182033] transition-all"
                >
                    Cerrar
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 rounded-2xl bg-[#070B1A] border border-blue-500/20">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold text-base">Nuevo contacto de confianza</h3>
                <button
                    onClick={onCancel}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-400 font-medium">Nombre completo <span className="text-red-400">*</span></label>
                        <input
                            type="text"
                            placeholder="Ej: Juan García"
                            value={form.fullName}
                            onChange={e => set("fullName", e.target.value)}
                            className="px-3 py-2.5 rounded-xl bg-[#0d1526] border border-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-400 font-medium">Teléfono</label>
                        <input
                            type="tel"
                            placeholder="+54 11 5555 5555"
                            value={form.contactPhone ?? ""}
                            onChange={e => set("contactPhone", e.target.value)}
                            className="px-3 py-2.5 rounded-xl bg-[#0d1526] border border-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-400 font-medium">Email <span className="text-red-400">*</span></label>
                        <input
                            type="email"
                            placeholder="Ej: juan@email.com"
                            value={form.contactEmail}
                            onChange={e => set("contactEmail", e.target.value)}
                            className="px-3 py-2.5 rounded-xl bg-[#0d1526] border border-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-400 font-medium">Relación <span className="text-red-400">*</span></label>
                        <select
                            value={form.relationship}
                            onChange={e => set("relationship", e.target.value)}
                            className="px-3 py-2.5 rounded-xl bg-[#0d1526] border border-white/5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
                        >
                            <option value="" disabled className="text-slate-600">Seleccionar relación</option>
                            {RELATIONSHIPS.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Toggle emergencia */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0d1526] border border-white/5">
                    <div>
                        <p className="text-white text-sm font-medium">Contacto de emergencia</p>
                        <p className="text-xs text-slate-500 mt-0.5">Recibirá alertas inmediatas ante situaciones de alto riesgo.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => set("emergencyContact", !form.emergencyContact)}
                        className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${form.emergencyContact ? "bg-red-500" : "bg-slate-700"}`}
                    >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${form.emergencyContact ? "left-6" : "left-0.5"}`} />
                    </button>
                </div>

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <div className="flex items-center justify-end gap-3 pt-1 flex-wrap">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving}
                        className="px-4 py-2 rounded-xl text-slate-400 text-sm font-medium hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => void handleSubmit("invite")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500/40 text-blue-400 text-sm font-semibold hover:bg-blue-500/10 transition-all disabled:opacity-50"
                    >
                        <Link size={14} />
                        {saving ? "Generando..." : "Invitar por link"}
                    </button>
                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => void handleSubmit("add")}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all disabled:opacity-50"
                    >
                        <UserPlus size={14} />
                        {saving ? "Guardando..." : "Agregar contacto"}
                    </button>
                </div>

                <p className="text-xs text-slate-600">
                    <span className="text-slate-500">Agregar contacto</span> requiere que la persona ya tenga cuenta en VERA.
                    Usá <span className="text-slate-500">Invitar por link</span> si aún no la tiene.
                </p>
            </div>
        </div>
    );
}

export default AddContactForm;
