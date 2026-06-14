import { Search, AlertCircle, ShieldAlert, FileText, CheckCircle2, AlertTriangle, Lightbulb, Clock, Globe } from 'lucide-react';
import type { AnalysisResultDto } from '../api/analyzeMessage';
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
            <div className="analysis-empty-appear w-full">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-10 text-center">
                    <Search className="text-slate-600 h-14 w-14 mb-4 mx-auto stroke-[1.5]" />
                    <h3 className="text-2xl font-semibold text-slate-300 font-montserrat mb-3">
                        Analizá un archivo o mensaje sospechoso
                    </h3>
                    <p className="font-inter text-slate-500 max-w-md mx-auto leading-relaxed">
                        Subí capturas, audios, documentos o pegá texto para detectar posibles intentos de phishing, fraudes o malware.
                    </p>
                </div>
            </div>
        );
    }

    const config = getRiskConfig(result.riskLevel);
    const percentage = result.riskPercentage ?? 0;

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <section className="analysis-appear w-full mb-8 space-y-6">

            <div className={`rounded-xl border p-5 flex items-start gap-4 ${config.bgColor} ${config.borderColor}`}>
                <div className="mt-0.5">
                    {percentage >= 70 ? (
                        <ShieldAlert className="h-6 w-6 text-red-400" />
                    ) : percentage >= 40 ? (
                        <AlertTriangle className="h-6 w-6 text-yellow-400" />
                    ) : (
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                    )}
                </div>
                <div>
                    <h3 className={`text-lg font-semibold ${config.textColor}`}>
                        {result.title || 'Análisis Completado'}
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-400">
                        {percentage >= 70
                            ? 'Peligro inminente detectado. Te recomendamos no interactuar con el remitente ni descargar elementos.'
                            : percentage >= 40
                                ? 'Se encontraron discrepancias o patrones irregulares. Procedé con cuidado.'
                                : 'No se detectaron amenazas graves bajo los criterios estándares de seguridad.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-4">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Origen del Análisis</p>
                    <p className="text-sm font-bold text-slate-200 mt-1 flex items-center gap-1.5">
                        <Globe className="h-4 w-4 text-slate-500" /> Entorno {result.source}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-4">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Tipo de Amenaza</p>
                    <p className="text-sm font-bold text-blue-400 mt-1 truncate">
                        {result.riskType || 'No identificado'}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-4">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Fecha de Ejecución</p>
                    <p className="text-sm font-medium text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-12 items-stretch">

                <div className="lg:col-span-4 rounded-xl border border-slate-900 bg-slate-900/20 p-6 flex flex-col items-center justify-center backdrop-blur-sm">
                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 w-full text-left font-montserrat mb-6">
                        Porcentaje de Riesgo
                    </p>

                    <div className="relative flex items-center justify-center h-32 w-32 my-auto">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 116 116">
                            <circle cx="58" cy="58" r={radius} className="stroke-slate-800/50" strokeWidth="9" fill="transparent" />
                            <circle
                                cx="58"
                                cy="58"
                                r={radius}
                                className={`transition-all duration-1000 ease-out ${config.strokeColor}`}
                                strokeWidth="9"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                            />
                        </svg>

                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-white font-inter">
                                {percentage}%
                            </span>
                            <span className={`text-xs font-bold uppercase tracking-widest mt-0.5 ${config.textColor}`}>
                                {config.label}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 rounded-xl border border-slate-900 bg-slate-900/20 p-6 flex flex-col justify-start backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-slate-400 font-semibold text-sm uppercase tracking-wider mb-3">
                        <FileText className="h-4 w-4 text-slate-500" />
                        <h4>Resumen del Contenido Analizado</h4>
                    </div>
                    <p className="text-base text-slate-300 font-inter leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-800/60 grow">
                        {result.contentSummary || 'No se pudo generar un resumen del contenido procesado.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">

                <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-5 flex flex-col backdrop-blur-sm">
                    <h4 className={`text-base font-bold font-montserrat mb-3 flex items-center gap-2 ${config.textColor}`}>
                        <AlertTriangle className="h-4 w-4 text-yellow-400" /> Patrones e Indicadores Obtenidos
                    </h4>
                    <p className="text-sm text-slate-300 font-inter leading-relaxed pl-4 border-l-2 border-slate-800 grow">
                        {result.suspiciousPatterns}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-5 flex flex-col backdrop-blur-sm">
                    <h4 className="text-base font-bold font-montserrat mb-3 flex items-center gap-2 text-blue-400">
                        <Lightbulb className="h-4 w-4 text-blue-400" /> Acciones Sugeridas
                    </h4>
                    <p className="text-sm text-slate-300 font-inter leading-relaxed pl-4 border-l-2 border-slate-800 grow">
                        {result.recommendation || 'No se requieren acciones drásticas. Mantenga sus filtros de seguridad activos.'}
                    </p>
                </div>

            </div>

        </section>
    );
}