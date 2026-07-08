import { Paperclip, File, X, Search, Loader2 } from 'lucide-react';
import { useAuth } from '@/presentation/context/AuthContext.tsx';
import {type SyntheticEvent, type ChangeEvent, type MouseEvent, type RefObject} from 'react';

type Props = {
    loading: boolean;
    text: string;
    file: File | null;
    fileInputRef: RefObject<HTMLInputElement | null>;
    setText: (text: string) => void;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    removeFile: (e?: MouseEvent) => void;
    onSubmit: (e: SyntheticEvent, user: { fullName?: string } | null) => Promise<void>;
};

function AnalysisForm({
                          loading,
                          text,
                          file,
                          fileInputRef,
                          setText,
                          handleFileChange,
                          removeFile,
                          onSubmit
                      }: Props) {
    const { user } = useAuth();

    return (
        <div className="w-full flex flex-col gap-[clamp(0.8rem,1.2vw,1.5rem)] font-sans select-none">

            <div className="border-b border-[#182033]/40 pb-4 w-full">
                <h2 className="text-[clamp(0.75rem,0.8vw,0.86rem)] text-slate-400 leading-relaxed font-medium select-text">
                    El contenido ingresado será analizado para realizar un informe detallado. Podés ingresar el texto, insertar el enlace o adjuntar un archivo.
                </h2>
            </div>

            <div className="w-full flex flex-col rounded-2xl border border-[#182033] hover:border-slate-700 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 bg-linear-to-b from-[#0a0f24] to-[#070B1A] p-[clamp(0.9rem,1.3vw,1.5rem)] shadow-xl transition-all duration-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[clamp(200px,20vw,380px)] h-[clamp(200px,20vw,380px)] rounded-full bg-blue-500/5 filter blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex flex-col w-full">
                    <div className="w-full">
                        <textarea
                            rows={3}
                            placeholder="INGRESÁ EL TEXTO, PEGÁ UN CORREO SOSPECHOSO O INSERTA UN ENLACE..."
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            disabled={loading || !user}
                            className="w-full bg-transparent text-slate-200 text-[clamp(0.82rem,0.88vw,0.95rem)] font-semibold tracking-wide outline-hidden placeholder:text-slate-600 resize-none disabled:opacity-40 leading-relaxed min-h-[clamp(90px,8vw,130px)] select-text uppercase"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#182033]/60 pt-4 mt-2">

                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                disabled={loading || !user}
                                className="hidden"
                                accept="image/*,audio/*,video/*,application/pdf"
                            />

                            <button
                                type="button"
                                disabled={loading || !user}
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 h-9 px-3 rounded-xl text-[clamp(10px,0.65vw,12px)] text-slate-400 font-bold tracking-wider uppercase bg-[#0a0f24]/40 border border-[#182033] hover:bg-[#131b35]/20 hover:text-slate-200 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none group shrink-0"
                            >
                                <Paperclip size={12} className="text-slate-500 group-hover:text-slate-400 transition-colors stroke-[2.2]" />
                                <span>Adjuntar archivo</span>
                            </button>

                            {file && (
                                <div className={`flex items-center gap-2 bg-[#050816]/90 border border-[#182033] pl-3 pr-2 h-9 rounded-xl max-w-xs animate-fade-in transition-opacity duration-200 ${
                                    loading ? 'opacity-40 pointer-events-none' : ''
                                }`}>
                                    <File size={11} className="text-blue-400 shrink-0" />
                                    <span className="text-[clamp(11px,0.7vw,13px)] font-bold tracking-tight text-slate-300 truncate select-text">
                                        {file.name}
                                    </span>
                                    <button
                                        type="button"
                                        title="Quitar archivo"
                                        disabled={loading}
                                        onClick={(e) => removeFile(e)}
                                        className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
                                    >
                                        <X size={12} className="stroke-[2.5]" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={(e) => onSubmit(e, user)}
                            disabled={loading || (!text.trim() && !file) || !user}
                            className="w-full sm:w-36 h-9 flex items-center justify-center gap-1.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/20 disabled:text-blue-400/40 text-white font-bold text-[clamp(10px,0.6vw,12px)] tracking-wider uppercase transition-all shadow-lg shadow-blue-600/10 active:scale-[0.97] cursor-pointer shrink-0"
                        >
                            {loading ? (
                                <>
                                    <span>Analizando</span>
                                    <Loader2 size={12} className="animate-spin stroke-[2.5]" />
                                </>
                            ) : (
                                <>
                                    <Search size={12} className="stroke-[2.5]" />
                                    <span>Analizar</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnalysisForm;