import { useAnalysis } from '@/features/analysis/hooks/useAnalysis';
import { useAuth } from '@/presentation/context/AuthContext';
import { AnalysisForm } from '@/features/analysis/components/AnalysisForm';
import { AnalysisResult } from '@/features/analysis/components/AnalysisResult';
import Header from '@/features/shared/components/Header';
import Sidebar from '@/features/shared/components/Sidebar';

export function AnalysisView() {
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

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050814] text-slate-100 font-sans antialiased select-none">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56">
                <Header
                    userName={user?.fullName}
                    title="Analizador Inteligente"
                />

                <main className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1rem,2vw,3rem)] py-[clamp(1.2rem,2vw,2.5rem)] flex flex-col justify-between">
                    <div className="mx-auto max-w-5xl w-full flex-1 flex flex-col gap-[clamp(1.5rem,2.5vw,3rem)] animate-fade-in">

                        <div className="w-full relative pb-[clamp(1rem,1.5vw,1.8rem)] overflow-hidden select-none">
                            <h2 className="text-[clamp(13px,0.8vw,14.5px)] text-slate-400 leading-relaxed font-sans font-medium tracking-wide mt-1.5 select-text">
                                El contenido que ingreses será analizado por un modelo de inteligencia artificial para determinar su nivel de riesgo y generar un resumen del mismo. Puedes ingresar texto directamente o subir un archivo de texto para su análisis.
                            </h2>

                            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#161f37]/90 to-transparent pointer-events-none" />
                        </div>

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

                        <AnalysisResult
                            result={result}
                            loading={isLoading}
                            error={error}
                            isStartingChat={isStartingChat}
                            onStartChat={startAnalysisChat}
                        />

                    </div>
                </main>
            </div>
        </div>
    );
}