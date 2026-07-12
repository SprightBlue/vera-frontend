import { useState, useEffect, useCallback } from 'react';
import { analysisApi, type AnalysisDetailResponse } from '@/features/analysis/api/analysisApi';

interface AxiosErrorLike {
    response?: {
        status: number;
    };
}

export function useAnalysisDetail(analysisId?: string) {
    const [detail, setDetail] = useState<AnalysisDetailResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(!!analysisId);
    const [error, setError] = useState<string | null>(null);

    const isAxiosError = (err: unknown): err is AxiosErrorLike => {
        return typeof err === 'object' && err !== null && 'response' in err;
    };

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
            } catch (requestError: unknown) {
                if (!isMounted) return;
                setDetail(null);

                if (isAxiosError(requestError) && requestError.response?.status === 404) {
                    setError("ERROR DE SISTEMA: NO SE ENCONTRÓ EL REGISTRO DE ANÁLISIS SOLICITADO EN LA BASE DE DATOS LOCAL.");
                } else {
                    setError("ERROR DE CONEXIÓN: NO SE PUDO ESTABLECER COMUNICACIÓN CON EL MOTOR DE SEGURIDAD. POR FAVOR, REINTENTÁ EL PROCESO.");
                }
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
        } catch (requestError: unknown) {
            if (isAxiosError(requestError) && requestError.response?.status === 404) {
                setError("ERROR DE SISTEMA: NO SE ENCONTRÓ EL REGISTRO DE ANÁLISIS SOLICITADO EN LA BASE DE DATOS LOCAL.");
            } else {
                setError("ERROR DE CONEXIÓN: NO SE PUDO ESTABLECER COMUNICACIÓN CON EL MOTOR DE SEGURIDAD. POR FAVOR, REINTENTÁ EL PROCESO.");
            }
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
        } catch (requestError: unknown) {
            if (isAxiosError(requestError) && requestError.response?.status === 403) {
                setError("ACCESO DENEGADO: NO CONTÁS CON LOS PERMISOS REQUERIDOS PARA ELIMINAR ESTE REGISTRO.");
            } else {
                setError("ERROR DE PROTOCOLO: NO SE PUDO COMPLETAR LA ELIMINACIÓN DEL REGISTRO EN EL SERVIDOR CENTRAL.");
            }
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