import React, {useState} from 'react';
import type {AnalyzeRequestDto} from '../types/analysis.types';

type Props = {
    loading: boolean;
    onAnalyze: (request: AnalyzeRequestDto) => Promise<void>;
};

const HARDCODED_USER_ID = 1;
const HARDCODED_SOURCE = 'UNKNOWN';

export function AnalysisForm({loading, onAnalyze}: Props) {
    const [content, setContent] = useState('');

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (!content.trim() || loading) return;

        await onAnalyze({
            userId: HARDCODED_USER_ID,
            content: content.trim(),
            source: HARDCODED_SOURCE,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <textarea
                    rows={2}
                    placeholder="Ingresa el mensaje a analizar..."
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    disabled={loading}
                    className="h-16 flex-1 rounded-lg bg-slate-900/60 border border-slate-800 px-4 py-3 text-sm text-gray-200 outline-none transition duration-200 placeholder-gray-500 focus:border-slate-600 font-inter resize-none disabled:opacity-50 backdrop-blur-sm w-full"
                />

                <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    className="rounded-lg bg-primary px-6 font-semibold text-white transition duration-300 ease-in-out hover:brightness-110 active:scale-98 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-gray-500 whitespace-nowrap sm:min-w-32 cursor-pointer w-full sm:w-auto flex items-center justify-center min-h-14"
                >
                    {loading ? 'Analizando...' : 'Analizar'}
                </button>
            </div>
        </form>
    );
}
