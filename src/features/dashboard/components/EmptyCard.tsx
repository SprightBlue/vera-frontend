interface EmptyCardProps {
    label?: string;
}

export function EmptyCard({label = "No hay datos registrados en este momento"}: EmptyCardProps) {
    return (
        <div
            className="w-full flex flex-col items-center justify-center min-h-36 rounded-xl border border-slate-800/80 bg-linear-to-b from-[#0f172a] to-[#020617] p-[clamp(1.2rem,1.8vw,2rem)] shadow-2xl relative overflow-hidden ring-1 ring-inset ring-slate-700/10 select-none">

            <div
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-slate-500 filter blur-3xl opacity-5 pointer-events-none"/>
            <div
                className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-slate-500/5 filter blur-3xl pointer-events-none"/>

            <div
                className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"/>

            <div className="relative z-10 flex flex-col items-center justify-center text-center gap-1.5 max-w-md px-4">
                <span
                    className="text-[clamp(10px,0.58vw,11px)] font-display font-extrabold text-slate-500 tracking-widest uppercase">
                    Consola de Estado
                </span>
                <p className="text-[clamp(13px,0.8vw,14px)] text-slate-400 font-sans font-semibold leading-relaxed tracking-wide">
                    {label}
                </p>
            </div>
        </div>
    );
}