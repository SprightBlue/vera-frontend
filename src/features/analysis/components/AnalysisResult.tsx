import {
    FileText,
    Clock,
    Globe,
    MessageSquareShare,
    Loader2,
    Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { AnalysisDetailResponse } from '@/features/analysis/api/analysisApi.ts';
import { getRiskConfig } from '@/features/analysis/utils/riskConfig';

type Props = {
    result: AnalysisDetailResponse | null;
    isStartingChat: boolean;
    onStartChat: (id: string) => Promise<string | null>;
};

function AnalysisResult({ result, isStartingChat, onStartChat }: Props) {
    const navigate = useNavigate();

    if (!result) {
        return (
            <div className="w-full flex items-center justify-center text-center select-none py-36 animate-fade-in">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    En esta sección se mostrarán los resultados del análisis.
                </span>
            </div>
        );
    }

    const config = getRiskConfig(result.riskLevel);
    const percentage = result.riskPercentage ?? 0;
    const isHighRisk = result.riskLevel?.toUpperCase() === 'HIGH' || result.riskLevel?.toUpperCase() === 'ALTO';

    const handleStartAnalysisChat = async (): Promise<void> => {
        if (!result.id || isStartingChat) return;
        const chatId = await onStartChat(result.id);
        if (chatId) {
            navigate(`/chat?currentChatId=${chatId}`);
        }
    };

    return (
        <section className="w-full space-y-[clamp(1rem,1.5vw,2rem)] pb-8 font-sans animate-fade-in">

            <div className={`rounded-2xl border-y border-r border-[#182033] bg-linear-to-b from-[#0a0f24] to-[#070B1A] p-[clamp(0.9rem,1.3vw,1.5rem)] shadow-xl relative overflow-hidden ${config.borderColor} border-l-4`}>
                <div className={`absolute top-0 right-0 w-[clamp(180px,18vw,320px)] h-[clamp(180px,18vw,320px)] rounded-full filter blur-[80px] opacity-10 pointer-events-none ${
                    isHighRisk ? 'bg-red-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                }`} />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-[clamp(0.95rem,1.1vw,1.2rem)] font-bold tracking-tight text-white truncate max-w-sm sm:max-w-md select-text">
                                    {result.title || 'Contenido Analizado'}
                                </h3>
                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border shrink-0 ${config.bgColor} ${config.borderColor} ${config.textColor}`}>
                                    Riesgo {config.label} {percentage}%
                                </span>
                            </div>

                            <p className="text-[clamp(0.75rem,0.8vw,0.86rem)] text-slate-400 leading-relaxed font-medium select-text max-w-380">
                                {isHighRisk
                                    ? 'Se detectó un peligro inminente bajo indicadores críticos de fraude. Te recomendamos de forma tajante cortar comunicación y resguardar tus credenciales.'
                                    : percentage >= 40
                                        ? 'Se identificaron patrones irregulares o sospechosos en la estructura del mensaje. Procedé con precaución.'
                                        : 'El contenido cumple con los parámetros básicos de seguridad analizados.'}
                            </p>
                        </div>
                    </div>

                    {isHighRisk && (
                        <button
                            onClick={handleStartAnalysisChat}
                            disabled={isStartingChat}
                            className="w-full md:w-36 h-9 shrink-0 flex items-center justify-center gap-1.5 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/10 disabled:text-blue-400/30 text-white font-bold text-[clamp(0.72rem,0.78vw,0.82rem)] tracking-tight transition-all duration-150 shadow-lg shadow-blue-600/10 active:scale-[0.97] cursor-pointer group/btn"
                        >
                            {isStartingChat ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>Conectando</span>
                                </>
                            ) : (
                                <>
                                    <MessageSquareShare className="h-3.5 w-3.5 transition-transform group-hover/btn:scale-105" />
                                    <span>Iniciar Chat</span>
                                </>
                            )}
                        </button>
                    )}
                </div>

                <div className="w-full h-1 bg-slate-800/40 rounded-full mt-4 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                            isHighRisk ? 'bg-red-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-[#070B1A]/40 border border-[#182033]/60 rounded-xl px-4 py-2.5 text-[clamp(0.7rem,0.75vw,0.8rem)] text-slate-400 select-none">
                <div className="flex items-center gap-1.5">
                    <Globe size={12} className="text-slate-500" />
                    <span>Dónde: <strong className="text-slate-200 font-semibold select-text">{result.source || 'No especificado'}</strong></span>
                </div>
                <div className="w-1 h-1 bg-slate-700 rounded-full shrink-0" />
                <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-slate-500" />
                    <span>Cuándo: <strong className="text-slate-200 font-semibold select-text">{result.createdAt}</strong></span>
                </div>
                <div className="w-1 h-1 bg-slate-700 rounded-full shrink-0" />
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <Tag size={12} className="text-slate-500 shrink-0" />
                    <span className="truncate">
                        Categoría: <strong className="text-blue-400 font-bold ml-0.5 select-text">{result.riskType || 'General'}</strong>
                    </span>
                </div>
            </div>

            <div className="w-full space-y-[clamp(1rem,1.2vw,1.5rem)]">

                <div className="bg-[#070B1A]/40 border border-[#182033]/60 rounded-2xl p-[clamp(0.9rem,1.3vw,1.5rem)] space-y-2">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[9px] uppercase tracking-widest select-none">
                        <FileText className="h-3.5 w-3.5 text-blue-400" />
                        <h4>Resumen analítico del Contenido</h4>
                    </div>
                    <p className="text-[clamp(0.75rem,0.8vw,0.86rem)] text-slate-400 leading-relaxed font-medium select-text">
                        {result.contentSummary || 'No se pudo generar un resumen conceptual.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1rem,1.2vw,1.5rem)] items-stretch">

                    <div className="space-y-2 flex flex-col">
                        <h4 className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 text-red-400/90 select-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Patrones Sospechosos Detectados
                        </h4>
                        <div className="bg-[#070B1A]/20 border-l-2 border-red-500/50 p-[clamp(0.9rem,1.3vw,1.5rem)] flex-1">
                            <p className="text-[clamp(0.75rem,0.8vw,0.86rem)] text-slate-300 leading-relaxed font-medium whitespace-pre-line select-text">
                                {result.suspiciousPatterns || 'Sin patrones de riesgo explícitos identificados.'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <h4 className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 text-emerald-400/90 select-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Recomendación Sugerida
                        </h4>
                        <div className="bg-[#070B1A]/20 border-l-2 border-emerald-500/50 p-[clamp(0.9rem,1.3vw,1.5rem)] flex-1">
                            <p className="text-[clamp(0.75rem,0.8vw,0.86rem)] text-slate-300 leading-relaxed font-medium whitespace-pre-line select-text">
                                {result.recommendation || 'No se requieren acciones complejas.'}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default AnalysisResult;