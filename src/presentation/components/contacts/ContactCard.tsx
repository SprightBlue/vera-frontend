import {useState} from "react";
import {Mail, Phone, Trash2, CheckCircle2, Clock} from "lucide-react";
import type {Contact} from "../../../domain/models/Contact";
import toast from "react-hot-toast";
import {PersonAvatar} from "@/features/shared/components/PersonAvatar.tsx";
import { ActionButton } from "@/features/shared/components/ActionButton";

interface Props {
    contact: Contact;
    onRemove: (id: number) => Promise<void>;
}

function ContactCard({contact, onRemove}: Props) {
    const [removing, setRemoving] = useState(false);

    const handleRemove = () => {
        toast((t) => (
            <div className="flex-col gap-3 text-white min-w-[260px]">
            <span className="text-sm leading-snug">
                ¿Eliminar a <b>{contact.fullName}</b> de tus contactos de confianza?
            </span>
                <div className="flex justify-end gap-2">
                    <ActionButton variant="neutral" onClick={() => toast.dismiss(t.id)} className="h-9 px-4 text-sm">
                        Cancelar
                    </ActionButton>
                    <ActionButton variant="danger"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            setRemoving(true);
                            try {
                                await onRemove(contact.id);
                                toast.success(`${contact.fullName} fue eliminado`, { style: { background: "#070B1A",  color: "#fff",  border: "1px solid #182033",}, });
                            } catch {
                                toast.error("No se pudo eliminar el contacto", { style: { background: "#070B1A",  color: "#fff",  border: "1px solid #182033", }, });
                            } finally {
                                setRemoving(false);
                            }
                        }} className="h-9 px-4 text-sm">
                        Eliminar
                    </ActionButton>
                </div>
            </div>
        ), {
            style: {
                background: "#070B1A",
                border: "1px solid #182033",
                borderRadius: "0.75rem",
                padding: "1rem",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.4)",
            },
        });
    };

    return (
        <div
            className="p-5 rounded-2xl bg-[#070B1A] border border-[#182033] hover:border-slate-700 flex flex-col gap-4 transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <PersonAvatar fullName={contact.fullName} image={contact.image} size="sm" />
                    <div className="min-w-0 flex items-center gap-2 flex-wrap">
                        <p className="text-white font-semibold text-lg leading-tight truncate">
                            {contact.fullName}
                        </p>
                        <span
                            className="text-xs px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 font-medium whitespace-nowrap">
                            {contact.relationship}
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => void handleRemove()}
                    disabled={removing}
                    title="Eliminar contacto"
                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/5 transition-all flex-shrink-0 disabled:opacity-50"
                >
                    <Trash2 size={15}/>
                </button>
            </div>

            {/* Info de contacto */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Mail size={14}/>
                    <span className="truncate">{contact.email}</span>
                </div>
                {contact.phone && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Phone size={14}/>
                        <span>{contact.phone}</span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                    {contact.status === "ACTIVE" ? (
                        <>
                            <CheckCircle2 size={13} className="text-green-400"/>
                            <span className="text-sm text-green-400 font-medium">Activo</span>
                        </>
                    ) : (
                        <>
                            <Clock size={13} className="text-yellow-400"/>
                            <span className="text-sm text-yellow-400 font-medium">Invitación pendiente</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ContactCard;