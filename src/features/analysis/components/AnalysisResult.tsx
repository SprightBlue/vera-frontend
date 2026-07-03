import { BarChart3, ShieldAlert, FileText, CheckCircle2, AlertTriangle, Lightbulb, Clock, Globe } from 'lucide-react';
import type { AnalysisResultDto } from '@/features/analysis/api/analysisApi.ts';
import { getRiskConfig } from '@/features/analysis/utils/riskConfig';

type Props = {
    result: AnalysisResultDto | null;
    error: string | null;
    showPlaceholder?: boolean;
};

function AnalysisResult({ result, showPlaceholder = true }: Props) {
    if (!result) {
        if (!showPlaceholder) return null;

        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center select-none py-14 gap-3 animate-fade-in">
                <BarChart3 size={44} className="text-slate-600 stroke-[1.2]" />

                <p className="text-[clamp(1rem,1.15vw,1.3rem)] text-slate-400 leading-relaxed max-w-2xl mx-auto">
                    El análisis del contenido se mostrará aquí una vez que se complete el procesamiento.
                </p>
            </div>
        );
    }

    const config = getRiskConfig(result.riskLevel);
    const percentage = result.riskPercentage ?? 0;

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffsetTarget = circumference - (percentage / 100) * circumference;

    return (
        <section className="w-full space-y-[clamp(1.2rem,1.5vw,2rem)] pb-10 font-sans">

            <div className={`rounded-2xl border p-6 flex items-start gap-4 shadow-md ${config.bgColor} ${config.borderColor} ${
                percentage >= 70 ? 'animate-[pulse_3s_infinite]' : ''
            }`}>

                <div className={`mt-0.5 shrink-0 ${
                    percentage >= 70
                        ? 'animate-[pulse_1.5s_infinite]'
                        : percentage >= 40
                            ? 'animate-[pulse_2.5s_infinite]'
                            : ''
                }`}>
                    {percentage >= 70 ? (
                        <ShieldAlert className="h-6 w-6 text-red-400" />
                    ) : percentage >= 40 ? (
                        <AlertTriangle className="h-6 w-6 text-yellow-400" />
                    ) : (
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                    )}
                </div>

                <div className="space-y-1">
                    <h3 className={`text-[clamp(1.1rem,1.25vw,1.4rem)] font-bold tracking-tight ${config.textColor}`}>
                        {result.title || 'Análisis Completado'}
                    </h3>
                    <p className="text-[clamp(0.85rem,0.95vw,1.1rem)] text-slate-400 leading-relaxed max-w-5xl">
                        {percentage >= 70
                            ? 'Peligro inminente detectado. Te recomendamos rotundamente no interactuar con el remitente ni abrir archivos.'
                            : percentage >= 40
                                ? 'Se identificaron patrones irregulares o sospechosos. Procedé con estricto cuidado.'
                                : 'No se detectaron amenazas bajo los criterios analizados de seguridad.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-[clamp(1rem,1.5vw,2rem)]">
                {[
                    { label: 'Origen', value: `${result.source}`, icon: <Globe className="h-4 w-4 text-slate-200" />, customText: 'text-slate-200' },
                    { label: 'Tipo de Riesgo', value: result.riskType || 'No identificado', icon: null, customText: 'text-slate-200 truncate' },
                    { label: 'Fecha', value: result.createdAt, icon: <Clock className="h-4 w-4 text-slate-200" />, customText: 'text-slate-200 font-semibold' }
                ].map((item, index) => (
                    <div key={index} className="rounded-2xl border border-[#182033] bg-[#070B1A] p-5 shadow-md">
                        <p className="text-slate-200 text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
                        <p className={`text-[clamp(0.85rem,0.95vw,1.1rem)] font-bold mt-1.5 flex items-center gap-2 ${item.customText}`}>
                            {item.icon} {item.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid gap-[clamp(1rem,1.5vw,2rem)] grid-cols-12 items-stretch">

                <div className="col-span-4 rounded-2xl border border-[#182033] bg-[#070B1A] p-6 flex flex-col items-center justify-center shadow-md select-none cursor-default">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-200 w-full text-left mb-4">
                        Nivel de Riesgo
                    </p>
                    <div className="relative flex items-center justify-center h-28 w-28 my-auto">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 116 116">
                            <circle cx="58" cy="58" r={radius} className="stroke-slate-800/20" strokeWidth="6" fill="transparent" />
                            <circle
                                cx="58"
                                cy="58"
                                r={radius}
                                className={`stroke-current ${config.strokeColor}`}
                                strokeWidth="6"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffsetTarget}
                            />
                        </svg>

                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-slate-200 tracking-tight">{percentage}%</span>
                            <span className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${config.textColor}`}>
                                {config.label}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-span-8 rounded-2xl border border-[#182033] bg-[#070B1A] p-6 flex flex-col justify-start shadow-md">
                    <div className="flex items-center gap-2 text-blue-400/80 font-bold text-[10px] uppercase tracking-wider mb-3.5 select-none">
                        <FileText className="h-4 w-4 text-blue-400/80 stroke-[1.5]" />
                        <h4>Resumen del contenido</h4>
                    </div>
                    <p className="text-[clamp(0.85rem,0.95vw,1.05rem)] text-slate-400 leading-relaxed bg-[#050816]/70 p-4 rounded-xl border border-[#182033]/40 grow font-sans">
                        {result.contentSummary || 'No se pudo generar un resumen conceptual.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-[clamp(1rem,1.5vw,2rem)]">
                <div className="rounded-2xl border border-[#182033] bg-[#070B1A] p-6 flex flex-col shadow-md">
                    <h4 className={`text-[11px] font-bold uppercase tracking-wider mb-3.5 flex items-center gap-2 ${config.textColor}`}>
                        <AlertTriangle className="h-4 w-4 text-red-500/80 stroke-[1.5]" /> Patrones Sospechosos
                    </h4>
                    <p className="text-[clamp(0.85rem,0.95vw,1.05rem)] text-slate-400 leading-relaxed pl-4 border-l border-slate-800/80 grow font-sans">
                        {result.suspiciousPatterns}
                    </p>
                </div>

                <div className="rounded-2xl border border-[#182033] bg-[#070B1A] p-6 flex flex-col shadow-md">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider mb-3.5 flex items-center gap-2 text-green-400">
                        <Lightbulb className="h-4 w-4 text-green-400/80 stroke-[1.5]" /> Recomendaciones Sugeridas
                    </h4>
                    <p className="text-[clamp(0.85rem,0.95vw,1.05rem)] text-slate-400 leading-relaxed pl-4 border-l border-slate-800/80 grow font-sans">
                        {result.recommendation || 'No se requieren acciones complejas. Mantenga el estado de alerta activa.'}
                    </p>
                </div>
            </div>

        </section>
    );
}

export default AnalysisResult;