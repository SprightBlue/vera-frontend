import { Paperclip, File, X, Search } from 'lucide-react';
import { useAuth } from '@/presentation/context/AuthContext';
import { ActionButton } from '@/features/shared/components/ActionButton';
import { type SyntheticEvent, type ChangeEvent, type MouseEvent, type RefObject } from 'react';

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

export function AnalysisForm({
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
        <div className="w-full flex flex-col gap-2 font-sans select-none">
            <span className="text-[clamp(10px,0.55vw,11px)] font-sans font-bold tracking-wider text-slate-500 uppercase">
                FORMULARIO DE ANÁLISIS DE INTELIGENCIA ARTIFICIAL
            </span>

            <div className="w-full flex flex-col rounded-xl border border-[#161f37] bg-linear-to-b from-[#080d20] to-[#040714] p-[clamp(1.2rem,1.8vw,2rem)] ring-1 ring-inset ring-[#161f35]/20 shadow-2xl transition-all duration-300 relative overflow-hidden group">

                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 w-[clamp(220px,22vw,400px)] h-[clamp(220px,22vw,400px)] rounded-full bg-blue-500/3 filter blur-[90px] pointer-events-none" />

                <div className="relative z-10 flex flex-col w-full">
                    <div className="w-full">
                        <textarea
                            rows={3}
                            placeholder="INGRESÁ EL TEXTO, PEGÁ UN CORREO SOSPECHOSO O INSERTA UN ENLACE..."
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            disabled={loading || !user}
                            className="w-full bg-transparent text-slate-200 text-[clamp(12px,0.78vw,14px)] font-sans font-semibold tracking-wide outline-hidden placeholder:text-slate-600 resize-none disabled:opacity-40 leading-relaxed min-h-[clamp(100px,9vw,140px)] select-text uppercase"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#161f37]/60 pt-[clamp(1rem,1.5vw,1.8rem)] mt-2">

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
                                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-[clamp(10px,0.55vw,11px)] text-slate-400 font-sans font-bold tracking-wider uppercase bg-[#0a0f1d] border border-[#161f37] hover:border-[#223156] hover:text-slate-200 transition-all duration-300 active:scale-[0.97] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shrink-0"
                            >
                                <Paperclip size={12} className="text-current transition-colors duration-200 stroke-[2.5]" />
                                <span>Adjuntar archivo</span>
                            </button>

                            {file && (
                                <div className={`inline-flex items-center gap-2.5 bg-[#050814]/90 border border-[#161f37] pl-3 pr-1.5 h-9 rounded-lg max-w-xs animate-fade-in transition-all duration-200 ${
                                    loading ? 'opacity-40 pointer-events-none' : ''
                                }`}>
                                    <File size={12} className="text-blue-400 shrink-0 stroke-[2.2]" />
                                    <span className="text-[clamp(11px,0.65vw,13px)] font-sans font-bold tracking-wide text-slate-300 truncate select-text">
                                        {file.name}
                                    </span>
                                    <button
                                        type="button"
                                        title="Quitar archivo"
                                        disabled={loading}
                                        onClick={(e) => removeFile(e)}
                                        className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors duration-200"
                                    >
                                        <X size={12} className="stroke-[2.5]" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <ActionButton
                            variant="info"
                            isLoading={loading}
                            icon={Search}
                            disabled={(!text.trim() && !file) || !user}
                            onClick={(e) => onSubmit(e, user)}
                        >
                            Analizar
                        </ActionButton>
                    </div>
                </div>
            </div>
        </div>
    );
}