import { useAnalysis } from '@/features/analysis/hooks/useAnalysis.ts';
import { useAuth } from '@/presentation/context/AuthContext.tsx';
import AnalysisForm from '@/features/analysis/components/AnalysisForm';
import AnalysisResult from '@/features/analysis/components/AnalysisResult';
import Header from '@/presentation/components/Header';
import Sidebar from '@/presentation/components/Sidebar';
import { Loader2, RefreshCw } from 'lucide-react';

function AnalysisPage() {
    const {
        isLoading,
        isStartingChat,
        result,
        error,
        text,
        file,
        fileInputRef,
        setText,
        handleFileChange,
        removeFile,
        handleSubmit,
        startAnalysisChat
    } = useAnalysis();

    const { user } = useAuth();

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050816] text-slate-100 font-sans antialiased select-none">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56">
                <Header
                    userName={user?.fullName}
                    title="Análisis con Inteligencia Artificial"
                />

                <main className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1rem,2vw,3rem)] py-[clamp(1rem,1.8vw,2.5rem)] flex flex-col justify-between">
                    <div className="mx-auto max-w-480 w-full flex-1 flex flex-col gap-[clamp(1.2rem,1.8vw,2rem)] animate-fade-in">

                        <AnalysisForm
                            loading={isLoading}
                            text={text}
                            file={file}
                            fileInputRef={fileInputRef}
                            setText={setText}
                            handleFileChange={handleFileChange}
                            removeFile={removeFile}
                            onSubmit={handleSubmit}
                        />

                        {isLoading ? (
                            <div className="w-full flex-1 flex flex-col items-center justify-center py-36 select-none animate-fade-in">
                                <Loader2 size={22} className="text-blue-500 animate-spin stroke-[1.5] mb-2" />
                                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase animate-pulse">
                                    Cargando
                                </span>
                            </div>
                        ) : error ? (
                            <div className="w-full flex-1 flex items-center justify-center py-24 select-none animate-fade-in">
                                <button
                                    onClick={handleRetry}
                                    className="flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-slate-200 tracking-widest uppercase transition-colors cursor-pointer group"
                                >
                                    <RefreshCw size={12} className="stroke-[2.5] text-slate-500 group-hover:text-slate-200 transition-colors" />
                                    <span>Reintentar</span>
                                </button>
                            </div>
                        ) : (
                            <div className="w-full flex-1 flex flex-col">
                                <AnalysisResult
                                    result={result}
                                    isStartingChat={isStartingChat}
                                    onStartChat={startAnalysisChat}
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