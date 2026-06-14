import React, { useState, useRef } from 'react';
import { useAuth } from '../../../presentation/context/AuthContext';
import type { AnalyzeRequestDto } from '../api/analyzeMessage';

type Props = {
    loading: boolean;
    onAnalyze: (request: AnalyzeRequestDto) => Promise<void>;
};

export function AnalysisForm({ loading, onAnalyze }: Props) {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
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

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        if ((!text.trim() && !file) || loading || !user) return;

        await onAnalyze({
            text: text.trim() || undefined,
            file: file,
            source: 'WEB',
        });
    };

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur-sm">
            <div className="mb-5">
                <h2 className="text-xl font-semibold text-white">
                    Analizar contenido sospechoso
                </h2>
                <p className="mt-1 text-slate-400">
                    Pegá un texto, enlace o subí un archivo multimedia para verificar amenazas.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="flex flex-col gap-3">

                    <textarea
                        rows={4}
                        placeholder="Pegá aquí un mensaje, correo electrónico o enlace sospechoso..."
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        disabled={loading || !user}
                        className="
                            w-full
                            rounded-xl
                            bg-slate-950/60
                            border
                            border-slate-800
                            px-4
                            py-4
                            text-base
                            text-slate-200
                            placeholder:text-slate-500
                            outline-none
                            transition-all
                            duration-200
                            resize-none
                            focus:border-blue-500
                            disabled:opacity-50
                        "
                    />

                    <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200
                            ${isDragActive ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 bg-slate-950/30 hover:border-slate-700'}
                            ${(loading || !user) ? 'opacity-50 pointer-events-none' : ''}
                        `}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*,audio/*,video/*,application/pdf"
                        />

                        {!file ? (
                            <div className="text-center space-y-1">
                                <div className="text-slate-400 font-medium">
                                    <span className="text-blue-400 hover:underline">Subí un archivo</span> o arrastralo acá
                                </div>
                                <p className="text-xs text-slate-500">
                                    Imágenes, audios, capturas de pantalla o PDFs sospechosos
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between w-full bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-800"
                                 onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="p-2 rounded-md bg-blue-500/10 text-blue-400 shrink-0 text-sm">
                                        📁
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={loading || (!text.trim() && !file) || !user}
                            className="
                                min-w-35
                                rounded-xl
                                bg-blue-600
                                px-6
                                py-3
                                font-semibold
                                text-white
                                transition-all
                                duration-300
                                hover:brightness-110
                                disabled:cursor-not-allowed
                                disabled:bg-slate-800
                                disabled:text-slate-500
                                cursor-pointer
                            "
                        >
                            {loading ? 'Analizando...' : 'Analizar'}
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}