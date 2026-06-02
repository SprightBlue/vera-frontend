import { useState } from 'react';
import { analyzeMessage } from '../api/analyzeMessage';
import type { AnalysisResultDto, AnalyzeRequestDto } from '../types/analysis.types';

export function useAnalyzeMessage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResultDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    const executeAnalysis = async (request: AnalyzeRequestDto) => {
        setHasInteracted(true);
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await analyzeMessage(request);
            setResult(response);
        } catch (requestError: unknown) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : 'Error inesperado al analizar el contenido'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, result, error, hasInteracted, executeAnalysis };
}
