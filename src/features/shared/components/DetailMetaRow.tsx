import { Globe, Clock, Tag } from "lucide-react";

interface DetailMetaRowProps {
    source: string;
    createdAt: string;
    riskType: string;
}

export function DetailMetaRow({ source, createdAt, riskType }: DetailMetaRowProps) {
    return (
        <div
            className="flex flex-wrap items-center gap-x-5 gap-y-3 bg-linear-to-b from-[#080d20] to-[#040714]
            border border-white/5 rounded-xl px-5 py-3.5 text-[clamp(13px,0.8vw,14.5px)] font-sans text-slate-400
            ring-1 ring-inset ring-white/5 shadow-xl select-none w-full relative overflow-hidden"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            <div
                className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/5 to-transparent pointer-events-none"
            />

            <div className="flex items-center gap-2 min-w-0 relative z-10">
                <Globe size={15} className="text-slate-500 shrink-0"/>
                <span>
                    Origen: <strong className="text-slate-200 font-semibold select-text normal-case">
                        {source || 'No especificado'}
                    </strong>
                </span>
            </div>

            <div className="w-1 h-1 bg-slate-800 rounded-full shrink-0 hidden sm:block relative z-10"/>

            <div className="flex items-center gap-2 min-w-0 relative z-10">
                <Clock size={15} className="text-slate-500 shrink-0"/>
                <span>
                    Registro: <strong className="text-slate-200 font-semibold select-text normal-case">
                        {createdAt}
                    </strong>
                </span>
            </div>

            <div className="w-1 h-1 bg-slate-800 rounded-full shrink-0 hidden md:block relative z-10"/>

            <div className="flex items-center gap-2 min-w-0 relative z-10">
                <Tag size={15} className="text-slate-500 shrink-0"/>
                <span>
                    Categoría: <strong className="text-slate-200 font-semibold select-text normal-case">
                        {riskType || 'General'}
                    </strong>
                </span>
            </div>
        </div>
    );
}