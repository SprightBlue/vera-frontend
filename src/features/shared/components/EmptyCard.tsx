import { UI_VARIANTS_MAP } from "@/features/shared/utils/styleConfig";

interface EmptyCardProps {
    title?: string;
    description?: string;
    className?: string;
}

export function EmptyCard({
                              title = "Sin registros",
                              description,
                              className = ""
                          }: EmptyCardProps) {

    const neutralTheme = UI_VARIANTS_MAP['neutral'];

    return (
        <div className={`group rounded-xl border border-[#161f37] bg-linear-to-b from-[#080d20] to-[#040714] 
        p-[clamp(1.5rem,2vw,2.2rem)] shadow-2xl relative overflow-hidden 
        flex flex-col items-center justify-center text-center min-h-32.5 transition-all duration-300 
        ring-1 ring-inset ring-[#161f35]/20 hover:shadow-slate-950/20 w-full ${neutralTheme.hoverBorders} ${className}`}>

            <div className={`absolute -top-12 -right-12 w-[clamp(200px,20vw,350px)] h-[clamp(200px,20vw,350px)] rounded-full filter blur-[75px] opacity-5 pointer-events-none transform origin-top-right transition-all duration-500 ease-out group-hover:opacity-15 group-hover:scale-110 ${neutralTheme.glowColor}`} />

            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none" />

            <div className="flex flex-col items-center justify-center max-w-xs relative z-10 gap-1">
                <h4 className="text-[clamp(0.85rem,1vw,1.1rem)] font-display font-black text-slate-400 uppercase tracking-widest leading-snug">
                    {title}
                </h4>

                {description && (
                    <p className="text-[clamp(0.72rem,0.76vw,0.82rem)] font-sans font-medium text-slate-500 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

        </div>
    );
}