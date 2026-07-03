import { useAnalysis } from '@/features/analysis/hooks/useAnalysis.ts';
import { useAuth } from '@/presentation/context/AuthContext.tsx';
import AnalysisForm from '@/features/analysis/components/AnalysisForm';
import AnalysisResult from '@/features/analysis/components/AnalysisResult';
import Header from '@/presentation/components/Header';
import Sidebar from '@/presentation/components/Sidebar';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

function AnalysisPage() {
    const { isLoading, result, error, hasInteracted, executeAnalysis } = useAnalysis();
    const { user } = useAuth();

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050816] font-sans antialiased">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden ml-20 xl:ml-56">
                <Header
                    userName={user?.fullName}
                    title="Análisis con Inteligencia Artificial"
                />

                <main className="flex-1 flex flex-col overflow-y-auto px-[clamp(1.5rem,2vw,3rem)] py-[clamp(1.5rem,2vw,3rem)] bg-[#050816]">
                    <div className="w-full max-w-550 mx-auto flex-1 flex flex-col gap-[clamp(1.5rem,2vw,2.5rem)]">

                        <AnalysisForm
                            loading={isLoading}
                            onAnalyze={(request) => executeAnalysis(request)}
                        />

                        {isLoading ? (
                            <div className="w-full flex-1 flex flex-col items-center justify-center py-12 gap-4">
                                <Loader2 size={36} className="text-blue-500 animate-spin stroke-[1.5]" />
                                <p className="text-[clamp(1rem,1.1vw,1.3rem)] text-slate-400 font-medium select-none tracking-wide animate-pulse">
                                    Analizando contenido...
                                </p>
                            </div>
                        ) : error ? (
                            <div className="w-full flex-1 flex flex-col items-center justify-center py-12 gap-6 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20 shadow-lg shadow-red-500/5">
                                    <AlertCircle size={30} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-[clamp(1.2rem,1.5vw,1.6rem)] font-bold text-white tracking-tight">Ocurrió un inconveniente</h3>
                                    <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-slate-400 max-w-md mx-auto leading-relaxed">{error}</p>
                                </div>
                                <button
                                    onClick={handleRetry}
                                    className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 cursor-pointer"
                                >
                                    <RefreshCw size={14} />
                                    Reintentar análisis
                                </button>
                            </div>
                        ) : (
                            <div className="w-full flex-1 flex flex-col">
                                <AnalysisResult
                                    result={result}
                                    error={error}
                                    showPlaceholder={!hasInteracted}
                                />
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
}

export default AnalysisPage;