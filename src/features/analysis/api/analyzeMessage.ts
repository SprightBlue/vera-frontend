export interface AnalyzeRequestDto {
    text?: string;
    file?: File | null;
    source: string;
}

export interface AnalysisResultDto {
    id: string;
    createdAt: string;
    title: string;
    source: string;
    contentSummary: string;
    riskType: string;
    riskLevel: string;
    riskPercentage: number;
    suspiciousPatterns: string;
    recommendation: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const ANALYSIS_ENDPOINT = '/api/v1/analysis';

export async function analyzeMessage(payload: AnalyzeRequestDto): Promise<AnalysisResultDto> {
    const token = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token'); 

    const headers: Record<string, string> = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const formData = new FormData();

    if (payload.text) {
        formData.append('text', payload.text);
    }
    if (payload.file) {
        formData.append('file', payload.file);
    }
    formData.append('source', payload.source);

    const response = await fetch(`${API_URL}${ANALYSIS_ENDPOINT}`, {
        method: 'POST',
        headers: headers,
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Error en el análisis (${response.status}): ${errorText}`.trim());
    }

    return await response.json() as AnalysisResultDto;
}