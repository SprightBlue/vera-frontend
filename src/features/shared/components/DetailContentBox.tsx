// src/features/shared/components/DetailContentBox.tsx
import { UI_VARIANTS_MAP, type UIVariant } from "@/features/shared/utils/styleConfig.ts";

interface DetailContentBoxProps {
    title: string;
    content: string;
    variant?: UIVariant;
}

export function DetailContentBox({ title, content, variant = 'info' }: DetailContentBoxProps) {
    const config = UI_VARIANTS_MAP[variant];

    return (
        <div className="space-y-2.5 flex flex-col flex-1">
            {/* Tag indicador del bloque */}
            <h4 className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${config.textColor} select-none`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.glowColor} ${variant === 'danger' ? 'animate-pulse' : ''}`} />
                {title}
            </h4>

            {/* Contenedor del bloque de texto aplanado a rounded-r-lg */}
            <div className={`bg-linear-to-b from-[#0a0f24]/60 to-[#060a17]/40 border border-transparent border-l-2 ${config.borderLeft} 
            rounded-r-lg rounded-l-none p-[clamp(1rem,1.3vw,1.6rem)] flex-1 ring-1 ring-inset ring-[#161f35]/20 shadow-md shadow-black/10`}>
                <p className="text-[clamp(0.78rem,0.84vw,0.92rem)] leading-relaxed font-medium select-text whitespace-pre-line text-slate-300 tracking-wide">
                    {content}
                </p>
            </div>
        </div>
    );
}