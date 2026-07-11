import { Globe, Clock, Tag } from "lucide-react";

interface DetailMetaRowProps {
    source: string;
    createdAt: string;
    riskType: string;
}

export function DetailMetaRow({ source, createdAt, riskType }: DetailMetaRowProps) {
    return (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 bg-linear-to-b from-[#0a0f24]/60 to-[#060a17]/60
        border border-[#182033]/80 rounded-lg px-4 py-3 text-[clamp(0.72rem,0.76vw,0.84rem)] font-sans text-slate-400
        ring-1 ring-inset ring-[#161f35]/30 shadow-lg shadow-black/10 select-none w-full">

            <div className="flex items-center gap-2 min-w-0">
                <Globe size={13} className="text-slate-500 shrink-0" />
                <span className="truncate tracking-wide">
                    ORIGEN: <strong className="text-slate-200 font-sans font-bold select-text tracking-wider">{source || 'NO ESPECIFICADO'}</strong>
                </span>
            </div>

            <div className="w-1 h-1 bg-slate-800 rounded-full shrink-0 hidden sm:block" />

            <div className="flex items-center gap-2 min-w-0">
                <Clock size={13} className="text-slate-500 shrink-0" />
                <span className="truncate tracking-wide">
                    REGISTRO: <strong className="text-slate-200 font-sans font-bold select-text tracking-wider">{createdAt}</strong>
                </span>
            </div>

            <div className="w-1 h-1 bg-slate-800 rounded-full shrink-0 hidden md:block" />

            <div className="flex items-center gap-2 min-w-0">
                <Tag size={13} className="text-slate-500 shrink-0" />
                <span className="truncate tracking-wide">
                    CATEGORÍA: <strong className="text-slate-200 font-sans font-bold select-text tracking-wider">{riskType || 'GENERAL'}</strong>
                </span>
            </div>
        </div>
    );
}