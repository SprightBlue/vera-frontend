import React, { useState, useRef } from 'react';
import { Paperclip, File, Trash2, Search } from 'lucide-react';
import { useAuth } from '@/presentation/context/AuthContext.tsx';
import type { AnalyzeRequestDto } from '@/features/analysis/api/analysisApi.ts';

type Props = {
    loading: boolean;
    onAnalyze: (request: AnalyzeRequestDto) => Promise<void>;
};

function AnalysisForm({ loading, onAnalyze }: Props) {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading || !user) return;

        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (loading || !user) return;
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const removeFile = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (loading) return;

        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        if ((!text.trim() && !file) || loading || !user) return;

        try {
            await onAnalyze({
                text: text.trim() || undefined,
                file: file,
                source: 'WEB',
            });
            setText('');
            removeFile();
        } catch (error) {
            console.error("Error durante el procesamiento del formulario:", error);
        }
    };

    return (
        <div className="w-full flex flex-col gap-[clamp(1.5rem,2vw,2.5rem)]">

            <div className="flex items-center justify-between gap-8 select-none border-b border-[#182033]/40 pb-6 w-full">
                <div className="max-w-3xl shrink-0">
                    <h2 className="text-[clamp(1rem,1.5vw,1.5rem)] text-slate-400 leading-relaxed">
                        Hola{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}. El contenido ingresado será analizado para realizar un informe detallado. Podés ingresar texto, insertar un enlace o adjuntar un archivo.
                    </h2>
                </div>

                <div className="shrink-0">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || (!text.trim() && !file) || !user}
                        className="min-w-37.5 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-[#182033]/50 disabled:text-slate-500 px-[clamp(1.5rem,2vw,2.5rem)] py-3.5 text-[clamp(0.85rem,0.95vw,1.05rem)] font-semibold text-white cursor-pointer shadow-lg shadow-blue-600/10 transition-all duration-200 active:scale-95"
                    >
                        <Search size={16} className={loading ? 'animate-pulse' : ''} />
                        {loading ? 'Analizando...' : 'Analizar'}
                    </button>
                </div>
            </div>

            <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`w-full flex flex-col lg:flex-row gap-5 items-stretch bg-[#070B1A] border border-[#182033] focus-within:border-blue-500/50 rounded-2xl px-5 py-4 shadow-xl transition-all duration-200
                    ${isDragActive ? 'border-blue-500/50 bg-blue-500/5' : ''}`}
            >
                <div className="flex-1 min-w-0">
                    <textarea
                        rows={4}
                        placeholder="Ingresar aquí el texto o inserta el enlace..."
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        disabled={loading || !user}
                        className="w-full h-full bg-transparent text-slate-200 text-[clamp(1rem,1.2vw,1.2rem)] font-sans outline-none border-none placeholder:text-slate-500 resize-none disabled:opacity-40 min-h-35 leading-relaxed"
                    />
                </div>

                <div className="w-[clamp(240px,16vw,320px)] shrink-0 border-l border-[#182033]/60 pl-5 flex flex-col justify-center">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        disabled={loading || !user}
                        className="hidden"
                        accept="image/*,audio/*,video/*,application/pdf"
                    />

                    {!file ? (
                        <div
                            onClick={() => !loading && user && fileInputRef.current?.click()}
                            className={`flex flex-col items-center justify-center text-center h-full min-h-35 p-3 rounded-xl bg-[#050816]/40 hover:bg-[#050816]/90 border border-[#182033]/60 hover:border-slate-700/60 select-none group transition-all duration-200
                                ${(loading || !user) ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}`}
                        >
                            <Paperclip className="text-slate-500 group-hover:text-blue-400 w-4 h-4 mb-2 shrink-0 stroke-[1.5] transition-colors" />
                            <span className="text-xs text-slate-500 font-medium leading-snug">
                                Adjuntá un archivo para analizar
                            </span>
                            <span className="text-[10px] text-slate-500 mt-0.5">
                                doc, img, audio o video
                            </span>
                        </div>
                    ) : (
                        <div className={`flex flex-col items-center justify-center text-center h-full min-h-35 bg-[#050816]/60 p-3 rounded-xl border border-[#182033]/60 relative group ${loading ? 'opacity-40' : ''}`}>
                            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0 mb-1 border border-blue-500/5">
                                <File size={16} />
                            </div>
                            <div className="min-w-0 w-full px-1">
                                <p className="text-xs font-semibold text-slate-200 truncate mx-auto max-w-44">
                                    {file.name}
                                </p>
                                <p className="text-[10px] text-slate-500 mt-0.5">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>

                            <div className="absolute top-2.5 right-2.5 shrink-0 min-w-4 flex items-center justify-center">
                                <Trash2
                                    size={13}
                                    onClick={removeFile}
                                    className={`text-slate-400 transition-colors ${loading ? 'opacity-30 pointer-events-none cursor-default' : 'hover:text-red-400 cursor-pointer'}`}
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default AnalysisForm;