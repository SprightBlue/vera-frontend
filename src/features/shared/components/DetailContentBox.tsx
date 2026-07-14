import {UI_VARIANTS_MAP, type UIVariant} from "@/features/shared/utils/styleConfig";

interface DetailContentBoxProps {
    title: string;
    content: string;
    variant?: UIVariant;
}

export function DetailContentBox({title, content, variant = 'info'}: DetailContentBoxProps) {
    const config = UI_VARIANTS_MAP[variant];

    return (
        <div className="space-y-3 flex flex-col flex-1 w-full">
            <h4 className="text-[clamp(10px,0.55vw,11px)] font-sans font-bold uppercase tracking-wider flex items-center gap-2 text-slate-500 select-none">
                <span className={`w-1.5 h-1.5 rounded-full ${config.glowColor}`}/>
                {title}
            </h4>

            <div
                className={`bg-linear-to-b from-[#080d20] to-[#040714] border border-[#161f37] border-l-2 ${config.borderLeft} 
            rounded-xl rounded-l-none p-[clamp(1.2rem,1.8vw,2rem)] flex-1 ring-1 ring-inset ring-[#161f35]/20 shadow-2xl relative overflow-hidden`}>

                <div
                    className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"/>

                <p className="text-[clamp(13px,0.82vw,15px)] font-sans leading-relaxed font-medium select-text whitespace-pre-line text-slate-300 tracking-wide relative z-10">
                    {content}
                </p>
            </div>
        </div>
    );
}