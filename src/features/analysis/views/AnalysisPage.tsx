import { useAnalyzeMessage } from '../hooks/useAnalyzeMessage';
import { useAuth } from '../../../presentation/context/AuthContext';
import { AnalysisForm } from '../components/AnalysisForm';
import { AnalysisResult } from '../components/AnalysisResult';
import Header from '../../../presentation/components/Header';
import Sidebar from '../../../presentation/components/Sidebar';

export function AnalysisPage() {
    const { isLoading, result, error, hasInteracted, executeAnalysis } = useAnalyzeMessage();
    const { user } = useAuth();

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050816]">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden ml-65">
                    <Header
                        userName={user?.fullName || "Usuario"}
                        title="Análisis de Contenido"
                        subtitle="Detectá mensajes o contenido multimedia sospechosos y protegé tu información"
                    />

                <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-5xl w-full">

                        <div className="mb-8">
                            <AnalysisForm
                                loading={isLoading}
                                onAnalyze={(request) => executeAnalysis(request)}
                            />
                        </div>

                        {isLoading && (
                            <div className="analysis-appear w-full animate-pulse space-y-6 mb-8">
                                <div className="grid gap-6 lg:grid-cols-12 items-stretch">
                                    <div className="lg:col-span-4 rounded-xl border border-slate-900 bg-slate-900/20 p-6 flex flex-col items-center justify-center min-h-55">
                                        <div className="h-3 w-24 bg-slate-800 rounded self-start mb-6" />
                                        <div className="h-28 w-28 rounded-full border-8 border-slate-800 flex items-center justify-center" />
                                    </div>
                                    <div className="flex flex-col gap-4 lg:col-span-8 justify-between">
                                        <div className="flex-1 rounded-xl border border-slate-900 bg-slate-900/20 p-5 space-y-3 min-h-25">
                                            <div className="h-3 w-36 bg-slate-800 rounded" />
                                            <div className="h-4 w-5/6 bg-slate-800/60 rounded" />
                                        </div>
                                        <div className="flex-1 rounded-xl border border-slate-900 bg-slate-900/20 p-5 space-y-3 min-h-25">
                                            <div className="h-3 w-40 bg-slate-800 rounded" />
                                            <div className="h-4 w-4/5 bg-slate-800/60 rounded" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="transition-all duration-300 ease-in-out w-full">
                            <AnalysisResult
                                result={result}
                                error={error}
                                showPlaceholder={!hasInteracted}
                            />
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}