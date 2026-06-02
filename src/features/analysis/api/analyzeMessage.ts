import type { AnalysisResultDto, AnalyzeRequestDto } from '../types/analysis.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const ANALYSIS_ENDPOINT = '/api/v1/analysis/message';

export async function analyzeMessage(payload: AnalyzeRequestDto): Promise<AnalysisResultDto> {
    // 1. Recuperamos el token del almacenamiento local
    const token = localStorage.getItem('vera_token');

    // 2. Preparamos las cabeceras básicas
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // 3. Si el token existe, lo inyectamos con el formato Bearer que espera Spring Security
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${ANALYSIS_ENDPOINT}`, {
        method: 'POST',
        headers: headers, // 🔒 Ahora viaja seguro
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Error en el análisis (${response.status}): ${errorText}`.trim());
    }

    return await response.json() as Promise<AnalysisResultDto>;
}