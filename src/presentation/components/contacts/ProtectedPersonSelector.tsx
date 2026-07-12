import type { ProtectedPerson } from "@/domain/models/ProtectedPerson";
import {PersonAvatar} from "@/features/shared/components/PersonAvatar.tsx";

interface Props {
    persons: ProtectedPerson[];
    selected: ProtectedPerson | null;
    onSelect: (p: ProtectedPerson) => void;
    loading: boolean;
}

function ProtectedPersonSelector({ persons, selected, onSelect, loading }: Props) {
    if (loading) {
        return (
            <div className="flex gap-2 flex-wrap">
                {[1, 2].map(n => (
                    <div
                        key={n}
                        className="h-10 w-36 rounded-xl bg-[#070B1A] border border-[#182033] animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (persons.length === 0) return null;

    return (
        <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                Filtrar por protegido
            </p>
            <div className="flex gap-2 flex-wrap">
                {persons.map(p => (
                    <button
                        key={p.id}
                        onClick={() => onSelect(p)}
                        className={`flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                            selected?.id === p.id
                                ? "bg-blue-600/10 border-blue-500/30 text-white"
                                : "bg-[#0d1222] border-[#182033] text-slate-400 hover:text-white hover:border-[#2a3550]"
                        }`}
                    >
                        <PersonAvatar fullName={p.fullName} image={p.image} size="xs" />
                        {p.fullName}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ProtectedPersonSelector;