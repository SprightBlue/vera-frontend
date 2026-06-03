import { useState, useRef, useEffect } from "react";
import { Mail, MoreVertical, Link, Trash2, CheckCircle2, Clock } from "lucide-react";
import type { Contact } from "../../../domain/models/Contact";

interface Props {
    contact: Contact;
    onRemove: (id: number) => Promise<void>;
    onInvite: (id: number) => Promise<string>;
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

function ContactCard({ contact, onRemove, onInvite }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleInvite = async () => {
        setMenuOpen(false);
        const link = await onInvite(contact.id);
        setInviteLink(link);
    };

    const handleCopy = () => {
        if (!inviteLink) return;
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const avatarColor = AVATAR_COLORS[contact.id % AVATAR_COLORS.length];

    return (
        <div className="p-5 rounded-2xl bg-[#070B1A] border border-[#182033] flex flex-col gap-4 hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {getInitials(contact.fullName)}
                    </div>
                    <div className="min-w-0">
                        <p className="text-white font-semibold text-base leading-tight">{contact.fullName}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 font-medium">
                                {contact.relationship}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen(p => !p)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
                    >
                        <MoreVertical size={16} />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-1 w-44 rounded-xl bg-[#0d1222] border border-[#182033] shadow-xl z-20 overflow-hidden">
                            <button
                                onClick={handleInvite}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                            >
                                <Link size={14} /> Invitar por link
                            </button>
                            <button
                                onClick={() => { setMenuOpen(false); onRemove(contact.id); }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors text-left"
                            >
                                <Trash2 size={14} /> Eliminar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Mail size={12} />
                <span>{contact.email}</span>
            </div>

            <div className="flex items-center gap-2">
                {contact.status === "ACTIVE" ? (
                    <>
                        <CheckCircle2 size={13} className="text-green-400" />
                        <span className="text-xs text-green-400 font-medium">Activo</span>
                    </>
                ) : (
                    <>
                        <Clock size={13} className="text-yellow-400" />
                        <span className="text-xs text-yellow-400 font-medium">Pendiente · invitación enviada</span>
                    </>
                )}
            </div>

            {inviteLink && (
                <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <p className="text-xs text-blue-400 truncate">{inviteLink}</p>
                    <button
                        onClick={handleCopy}
                        className="text-xs text-blue-400 hover:text-blue-300 flex-shrink-0 font-medium"
                    >
                        {copied ? "Copiado" : "Copiar"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default ContactCard;