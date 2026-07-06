import { apiClient } from "@/infrastructure/api/auth.repository.ts";

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

export const analysisApi = {
    analyzeContent: async (payload: AnalyzeRequestDto): Promise<AnalysisResultDto> => {
        const formData = new FormData();

        if (payload.text) {
            formData.append('text', payload.text);
        }
        if (payload.file) {
            formData.append('file', payload.file);
        }
        formData.append('source', payload.source);

        const response = await apiClient.post<AnalysisResultDto>('/api/v1/analysis', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    },

    initializeChatFromAnalysis: async (analysisId: string): Promise<string> => {
        const response = await apiClient.post<string>(
            `/api/v1/analysis/chat/${encodeURIComponent(analysisId)}`,
            null,
            { responseType: 'text' }
        );
        return response.data;
    }
};