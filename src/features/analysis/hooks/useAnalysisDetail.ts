import { useState, useEffect, useCallback } from 'react';
import { analysisApi, type AnalysisDetailResponse } from '@/features/analysis/api/analysisApi';

export function useAnalysisDetail(analysisId?: string) {
    const [detail, setDetail] = useState<AnalysisDetailResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(!!analysisId);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!analysisId) return;
        let isMounted = true;

        const fetchDetailData = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await analysisApi.getAnalysisDetail(analysisId);
                if (!isMounted) return;
                setDetail(data);
                setError(null);
            } catch {
                if (!isMounted) return;
                setDetail(null);
                setError("No se pudo establecer conexión con el servidor.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        void fetchDetailData();

        return () => {
            isMounted = false;
        };
    }, [analysisId]);

    const executeReload = useCallback(async (): Promise<void> => {
        if (!analysisId) return;
        setLoading(true);
        setError(null);
        setDetail(null);
        try {
            const data = await analysisApi.getAnalysisDetail(analysisId);
            setDetail(data);
        } catch {
            setError("No se pudo establecer conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    }, [analysisId]);

    const removeAnalysis = async (): Promise<boolean> => {
        if (!analysisId) return false;
        try {
            await analysisApi.deleteAnalysis(analysisId);
            setDetail(null);
            setError(null);
            return true;
        } catch {
            setError("No se pudo completar la eliminación del registro.");
            return false;
        }
    };

    return {
        detail,
        loading,
        error,
        retry: executeReload,
        removeAnalysis
    } as const;
}