import { UI_VARIANTS_MAP, type UIVariant } from "@/features/shared/utils/styleConfig";

interface DetailContentBoxProps {
    title: string;
    content: string;
    variant?: UIVariant;
}

export function DetailContentBox({ title, content, variant = 'info' }: DetailContentBoxProps) {
    const config = UI_VARIANTS_MAP[variant];

    return (
        <div className="space-y-3 flex flex-col flex-1 w-full">
            {/* Título superior del bloque */}
            <h4 className="text-[clamp(11px,0.6vw,12px)] font-sans font-semibold normal-case flex items-center gap-2 text-slate-500 select-none">
                <span className={`w-1.5 h-1.5 rounded-full ${config.bgColor || 'bg-slate-500'}`}/>
                {title}
            </h4>

            {/* Contenedor principal estilizado con los tokens del banner y la tipografía nativa */}
            <div
                className={`bg-linear-to-b from-[#080d20] to-[#040714] border border-white/5 border-l-2 ${config.borderLeft} 
            rounded-xl rounded-l-none p-[clamp(1.2rem,1.8vw,2rem)] flex-1 ring-1 ring-inset ring-white/5 shadow-2xl relative overflow-hidden`}
            >
                <div
                    className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"
                />

                {/* Se inyecta la clase limpia .body-text asignada en tus componentes globales */}
                <p className="body-text select-text whitespace-pre-line text-slate-300 normal-case relative z-10">
                    {content}
                </p>
            </div>
        </div>
    );
}