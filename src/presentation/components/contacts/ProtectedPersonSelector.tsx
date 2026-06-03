import { useState, useRef, useEffect } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import type { ProtectedPerson } from "../../../infrastructure/api/protected-person-api";

interface Props {
    persons: ProtectedPerson[];
    selected: ProtectedPerson | null;
    onSelect: (p: ProtectedPerson) => void;
    loading: boolean;
}

function getInitials(name: string) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : name.slice(0, 2).toUpperCase();
}

function ProtectedPersonSelector({ persons, selected, onSelect, loading }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    if (loading) {
        return <div className="h-[88px] rounded-2xl bg-[#070B1A] border border-[#182033] animate-pulse" />;
    }

    if (!selected) return null;

    return (
        <div className="flex items-center justify-between p-5 rounded-2xl bg-[#070B1A] border border-[#182033]">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold text-lg border-2 border-white/10">
                    {getInitials(selected.fullName)}
                </div>
                <div>
                    <p className="text-white font-semibold text-lg">{selected.fullName}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20 font-medium">
                        Protegida/o
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3" ref={ref}>
                {persons.length > 1 && (
                    <div className="relative">
                        <button
                            onClick={() => setOpen(p => !p)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-300 text-sm font-medium border border-[#182033] hover:bg-white/5 hover:text-white transition-all"
                        >
                            Cambiar
                            <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0d1222] border border-[#182033] shadow-xl z-50 overflow-hidden">
                                {persons.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => { onSelect(p); setOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors
                                            ${selected.id === p.id
                                            ? "bg-blue-600/10 text-white"
                                            : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                            {getInitials(p.fullName)}
                                        </div>
                                        {p.fullName}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-300 text-sm font-medium border border-[#182033] hover:bg-white/5 hover:text-white transition-all">
                    Ver perfil <ExternalLink size={13} />
                </button>
            </div>
        </div>
    );
}

export default ProtectedPersonSelector;