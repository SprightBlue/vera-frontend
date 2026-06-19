import { useState } from "react";
import { Mail, Phone, Trash2, CheckCircle2, Clock, ShieldAlert, Shield } from "lucide-react";
import type { Contact } from "../../../domain/models/Contact";

interface Props {
    contact: Contact;
    onRemove: (id: number) => Promise<void>;
    onToggleEmergency: (id: number, value: boolean) => Promise<void>;
}

const AVATAR_COLORS = [
    "from-blue-500 to-blue-700",
    "from-green-500 to-green-700",
    "from-purple-500 to-purple-700",
    "from-orange-500 to-orange-700",
    "from-pink-500 to-pink-700",
    "from-teal-500 to-teal-700",
];

function getInitials(name: string) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : name.slice(0, 2).toUpperCase();
}

function ContactCard({ contact, onRemove, onToggleEmergency }: Props) {
    const [toggling, setToggling] = useState(false);
    const [removing, setRemoving] = useState(false);

    const handleToggleEmergency = async () => {
        if (contact.status !== "ACTIVE") return;
        setToggling(true);
        try {
            await onToggleEmergency(contact.id, !contact.emergencyContact);
        } finally {
            setToggling(false);
        }
    };

    const handleRemove = async () => {
        if (!window.confirm(`¿Eliminar a ${contact.fullName} de los contactos de confianza?`)) return;
        setRemoving(true);
        try {
            await onRemove(contact.id);
        } finally {
            setRemoving(false);
        }
    };

    const avatarColor = AVATAR_COLORS[contact.id % AVATAR_COLORS.length];

    return (
        <div className="p-5 rounded-2xl bg-[#070B1A] border border-[#182033] hover:border-slate-700 flex flex-col gap-4 transition-colors">
            {/* Header: avatar + nombre + badge emergencia */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {getInitials(contact.fullName)}
                    </div>
                    <div className="min-w-0">
                        <p className="text-white font-semibold text-base leading-tight truncate">{contact.fullName}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 font-medium">
                                {contact.relationship}
                            </span>
                            {contact.emergencyContact && (
                                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 font-medium">
                                    <ShieldAlert size={10} />
                                    Emergencia
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Botón eliminar */}
                <button
                    onClick={() => void handleRemove()}
                    disabled={removing}
                    title="Eliminar contacto"
                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/5 transition-all flex-shrink-0 disabled:opacity-50"
                >
                    <Trash2 size={15} />
                </button>
            </div>

            {/* Info de contacto */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Mail size={11} />
                    <span className="truncate">{contact.email}</span>
                </div>
                {contact.phone && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Phone size={11} />
                        <span>{contact.phone}</span>
                    </div>
                )}
            </div>

            {/* Footer: estado + toggle emergencia */}
            <div className="flex items-center justify-between pt-1 border-t border-white/5">
                {/* Estado */}
                <div className="flex items-center gap-1.5">
                    {contact.status === "ACTIVE" ? (
                        <>
                            <CheckCircle2 size={13} className="text-green-400" />
                            <span className="text-xs text-green-400 font-medium">Activo</span>
                        </>
                    ) : (
                        <>
                            <Clock size={13} className="text-yellow-400" />
                            <span className="text-xs text-yellow-400 font-medium">Invitación pendiente</span>
                        </>
                    )}
                </div>

                {/* Toggle emergencia (solo para activos) */}
                {contact.status === "ACTIVE" && (
                    <button
                        onClick={() => void handleToggleEmergency()}
                        disabled={toggling}
                        title={contact.emergencyContact ? "Quitar de emergencias" : "Marcar como emergencia"}
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-all disabled:opacity-50 ${
                            contact.emergencyContact
                                ? "bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25"
                                : "bg-slate-700/40 text-slate-400 border border-white/5 hover:bg-slate-700/60 hover:text-white"
                        }`}
                    >
                        {contact.emergencyContact
                            ? <><ShieldAlert size={11} /> Emergencia</>
                            : <><Shield size={11} /> Normal</>
                        }
                    </button>
                )}
            </div>
        </div>
    );
}

export default ContactCard;
