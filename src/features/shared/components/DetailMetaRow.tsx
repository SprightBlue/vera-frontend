import { Globe, Clock, Tag } from "lucide-react";

interface DetailMetaRowProps {
    source: string;
    createdAt: string;
    riskType: string;
}

export function DetailMetaRow({ source, createdAt, riskType }: DetailMetaRowProps) {
    return (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 bg-linear-to-b from-[#080d20] to-[#040714]
        border border-[#161f37] rounded-xl px-5 py-3.5 text-[clamp(11px,0.65vw,13px)] font-sans text-slate-400 hover:text-slate-300 transition-colors duration-200
        ring-1 ring-inset ring-[#161f35]/20 shadow-xl select-none w-full relative overflow-hidden">

            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/5 to-transparent pointer-events-none" />

            <div className="flex items-center gap-2 min-w-0 relative z-10">
                <Globe size={14} className="text-current shrink-0 transition-colors duration-200" />
                <span className="truncate tracking-wide">
                    ORIGEN: <strong className="text-slate-200 font-sans font-bold select-text tracking-wider">{source || 'NO ESPECIFICADO'}</strong>
                </span>
            </div>

            <div className="w-1 h-1 bg-slate-800 rounded-full shrink-0 hidden sm:block relative z-10" />

            <div className="flex items-center gap-2 min-w-0 relative z-10">
                <Clock size={14} className="text-current shrink-0 transition-colors duration-200" />
                <span className="truncate tracking-wide">
                    REGISTRO: <strong className="text-slate-200 font-display font-bold select-text tracking-wider">{createdAt}</strong>
                </span>
            </div>

            <div className="w-1 h-1 bg-slate-800 rounded-full shrink-0 hidden md:block relative z-10" />

            <div className="flex items-center gap-2 min-w-0 relative z-10">
                <Tag size={14} className="text-current shrink-0 transition-colors duration-200" />
                <span className="truncate tracking-wide">
                    CATEGORÍA: <strong className="text-slate-200 font-sans font-bold select-text tracking-wider">{riskType || 'GENERAL'}</strong>
                </span>
            </div>
        </div>
    );
}