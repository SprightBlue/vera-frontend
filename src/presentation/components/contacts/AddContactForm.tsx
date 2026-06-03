import { useState } from "react";
import { X } from "lucide-react";
import type { AddContactRequest } from "../../../infrastructure/api/contacts-api";

interface Props {
    onAdd: (data: AddContactRequest) => Promise<void>;
    onCancel: () => void;
}

const RELATIONSHIPS = [
    { value: "FAMILY_MEMBER", label: "Familiar" },
    { value: "FRIEND",        label: "Amigo/a" },
    { value: "NEIGHBOR",      label: "Vecino/a" },
    { value: "PROFESSIONAL",  label: "Profesional" },
    { value: "TRUSTED_CONTACT", label: "Contacto de confianza" },
];

const EMPTY: AddContactRequest = {
    contactEmail: "",
    relationship: "",
};

function AddContactForm({ onAdd, onCancel }: Props) {
    const [form, setForm] = useState<AddContactRequest>(EMPTY);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const set = (field: keyof AddContactRequest, value: string | boolean) =>
        setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.contactEmail.trim() || !form.relationship) {
            setError("Completá el email y la relación.");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await onAdd(form);
            setForm(EMPTY);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : null;
            setError(msg ?? "No se pudo agregar el contacto. Verificá que el email tenga una cuenta VERA.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 rounded-2xl bg-[#070B1A] border border-blue-500/20">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold text-base">Nuevo contacto</h3>
                <button
                    onClick={onCancel}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                    <X size={16} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-400 font-medium">Email del contacto</label>
                        <input
                            type="email"
                            placeholder="Ej: juan@email.com"
                            value={form.contactEmail}
                            onChange={e => set("contactEmail", e.target.value)}
                            className="px-3 py-2.5 rounded-xl bg-[#0d1526] border border-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                        <p className="text-xs text-slate-500">Debe tener una cuenta en VERA</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-400 font-medium">Relación</label>
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

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <div className="flex items-center justify-end gap-3 pt-1">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-xl text-slate-400 text-sm font-medium hover:text-white hover:bg-white/5 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all disabled:opacity-50"
                    >
                        {saving ? "Guardando..." : "Guardar contacto"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddContactForm;