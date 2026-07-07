import { apiClient as api } from "@/infrastructure/api/auth.repository.ts";

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AnalysisResponse {
    id: string;
    createdAt: string;
    title: string;
    contentSummary: string;
    riskLevel: RiskLevel;
}

export interface AnalysisDetailResponse {
    id: string;
    createdAt: string;
    title: string;
    source: string;
    contentSummary: string;
    riskType: string;
    riskLevel: RiskLevel;
    riskPercentage: number;
    suspiciousPatterns: string;
    recommendation: string;
}

export interface PagedResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface AnalysisFilters {
    riskLevel?: RiskLevel;
    search?: string;
    page?: number;
}

export interface AnalyzeRequestDto {
    text?: string;
    file?: File | null;
    source: string;
}

export const analysisApi = {
    getAnalysisHistory: async (filters: AnalysisFilters = {}): Promise<PagedResponse<AnalysisResponse>> => {
        const cleanParams: Record<string, string | number | boolean> = {};

        if (filters.riskLevel) cleanParams.riskLevel = filters.riskLevel;
        if (filters.search?.trim()) cleanParams.search = filters.search.trim();
        if (filters.page !== undefined) cleanParams.page = filters.page;

        const response = await api.get<PagedResponse<AnalysisResponse>>('/api/v1/analysis', {
            params: cleanParams
        });
        return response.data;
    },

    getAnalysisDetail: async (analysisId: string): Promise<AnalysisDetailResponse> => {
        const response = await api.get<AnalysisDetailResponse>(`/api/v1/analysis/${analysisId}`);
        return response.data;
    },

    deleteAnalysis: async (analysisId: string): Promise<void> => {
        await api.delete(`/api/v1/analysis/${analysisId}`);
    },

    analyzeContent: async (payload: AnalyzeRequestDto): Promise<AnalysisDetailResponse> => {
        const formData = new FormData();

        if (payload.text) {
            formData.append('text', payload.text);
        }
        if (payload.file) {
            formData.append('file', payload.file);
        }
        formData.append('source', payload.source);

        const response = await api.post<AnalysisDetailResponse>('/api/v1/analysis', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    },

    initializeChatFromAnalysis: async (analysisId: string): Promise<string> => {
        const response = await api.post<string>(
            `/api/v1/analysis/chat/${encodeURIComponent(analysisId)}`,
            null,
            { responseType: 'text' }
        );
        return response.data;
    }
};