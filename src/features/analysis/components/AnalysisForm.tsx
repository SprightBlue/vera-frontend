import React, { useState } from 'react';
import { useAuth } from '../../../presentation/context/AuthContext';
import type { AnalyzeRequestDto } from '../types/analysis.types';

type Props = {
    loading: boolean;
    onAnalyze: (request: AnalyzeRequestDto) => Promise<void>;
};

const HARDCODED_SOURCE = 'UNKNOWN';

export function AnalysisForm({ loading, onAnalyze }: Props) {
    const [content, setContent] = useState('');
    const { user } = useAuth();

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        if (!content.trim() || loading || !user) return;

        await onAnalyze({
            content: content.trim(),
            source: HARDCODED_SOURCE,
        });
    };

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur-sm">

            <div className="mb-5">
                <h2 className="text-xl font-semibold text-white">
                    Analizar mensaje sospechoso
                </h2>

                <p className="mt-1 text-slate-400">
                    Pegá cualquier mensaje, email o enlace para verificar si es seguro.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col gap-3">

                    <textarea
                        rows={4}
                        placeholder="Pegá aquí un mensaje, correo electrónico o enlace sospechoso..."
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
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

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !content.trim() || !user}
                            className="
                                min-w-[140px]
                                rounded-xl
                                bg-primary
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