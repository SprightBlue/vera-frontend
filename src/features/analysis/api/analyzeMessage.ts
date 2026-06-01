import type {AnalysisResultDto, AnalyzeRequestDto} from '../types/analysis.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const ANALYSIS_ENDPOINT = '/api/v1/analysis/message';

export async function analyzeMessage(payload: AnalyzeRequestDto): Promise<AnalysisResultDto> {
    const response = await fetch(`${API_URL}${ANALYSIS_ENDPOINT}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Error en el análisis (${response.status}): ${errorText}`.trim());
    }

    return await response.json() as Promise<AnalysisResultDto>;
}
