import { Search, AlertCircle } from 'lucide-react';
import type { AnalysisResultDto } from '../types/analysis.types';
import { getRiskConfig } from '../utils/riskConfig';

type Props = {
    result: AnalysisResultDto | null;
    error: string | null;
    showPlaceholder?: boolean;
};

export function AnalysisResult({ result, error, showPlaceholder = true }: Props) {

    if (error) {
        return (
            <div className="analysis-appear flex flex-col items-center justify-center text-center py-14 bg-transparent w-full select-none">
                <AlertCircle className="text-red-500/80 h-14 w-14 mb-4 stroke-[1.5]" />
                <h3 className="text-xl font-semibold text-slate-200 font-montserrat mb-1">
                    No se pudo completar el análisis
                </h3>
                <p className="font-inter text-lg text-slate-500 max-w-sm leading-relaxed">
                    Ocurrió un error al procesar el análisis. Por favor, intente nuevamente más tarde.
                </p>
            </div>
        );
    }

    if (!result) {
        if (!showPlaceholder) return null;
        return (
            <div className="analysis-empty-appear flex flex-col items-center justify-center py-16 bg-transparent text-center w-full select-none">
                <Search className="text-slate-700 h-14 w-14 mb-4 stroke-[1.5]" />
                <h3 className="text-xl font-semibold text-slate-400 font-montserrat mb-1">
                    Sistema listo para analizar
                </h3>
                <p className="font-inter text-lg text-slate-600 max-w-xs leading-relaxed">
                    Inserte un mensaje o enlace para analizar su nivel de riesgo y patrones sospechosos.
                </p>
            </div>
        );
    }

    const config = getRiskConfig(result.riskLevel);
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (config.percentage / 100) * circumference;

    return (
        <section className="analysis-appear w-full mb-8">
            <div className="grid gap-6 lg:grid-cols-12 items-stretch">

                <div className="lg:col-span-4 rounded-xl border border-slate-900 bg-slate-900/20 p-6 flex flex-col items-center justify-center min-h-55 backdrop-blur-sm">
                    <p className="text-lg font-semibold uppercase tracking-wider text-slate-500 w-full text-left font-montserrat self-start mb-6">
                        Nivel de riesgo
                    </p>

                    <div className="relative flex items-center justify-center h-28 w-28 my-auto">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 116 116">
                            <circle cx="58" cy="58" r={radius} className="stroke-slate-800/60" strokeWidth="8" fill="transparent" />
                            <circle
                                cx="58"
                                cy="58"
                                r={radius}
                                className={`transition-all duration-1000 ease-out ${config.strokeColor}`}
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                            />
                        </svg>

                        <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-white font-inter">
                  {config.percentage}%
                </span>
                            <span className={`text-sm font-bold uppercase tracking-wider ${config.textColor}`}>
                  {config.label}
                </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 lg:col-span-8 justify-between">

                    <div className="flex-1 rounded-xl border border-slate-900 bg-slate-900/20 p-5 min-h-25 flex flex-col justify-start backdrop-blur-sm">
                        <h4 className={`text-xl font-semibold uppercase tracking-wider font-montserrat mb-2 ${config.textColor}`}>
                            Patrones Sospechosos
                        </h4>
                        <p className="text-lg text-slate-200 font-inter leading-relaxed wrap-break-word pl-5 border-l border-slate-800">
                            {result.suspiciousPatterns || 'No se identificaron patrones de riesgo explícitos en el contenido.'}
                        </p>
                    </div>

                    <div className="flex-1 rounded-xl border border-slate-900 bg-slate-900/20 p-5 min-h-25 flex flex-col justify-start backdrop-blur-sm">
                        <h4 className="text-xl font-semibold uppercase tracking-wider text-primary font-montserrat mb-2">
                            Recomendación
                        </h4>
                        <p className="text-lg text-slate-300 font-inter leading-relaxed wrap-break-word pl-5 border-l border-slate-800">
                            {result.recommendation || 'Proceda con precaución estándar del sistema.'}
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}
