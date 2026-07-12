import { useState, useEffect, useCallback, useRef } from 'react';
import { analysisApi, type AnalysisResponse, type AnalysisFilters } from '@/features/analysis/api/analysisApi';

interface UseAnalysisListProps extends Omit<AnalysisFilters, 'search'> {
    searchTerm: string;
}

interface AxiosErrorLike {
    response?: {
        status: number;
    };
}

export function useAnalysisList({ searchTerm, ...otherFilters }: UseAnalysisListProps) {
    const [analyses, setAnalyses] = useState<AnalysisResponse[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [isLastPage, setIsLastPage] = useState<boolean>(true);

    const [loading, setLoading] = useState<boolean>(true);
    const [backgroundLoading, setBackgroundLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [debouncedSearch, setDebouncedSearch] = useState<string>('');

    const analysesRef = useRef(analyses);
    useEffect(() => {
        analysesRef.current = analyses;
    }, [analyses]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm.trim());
        }, 350);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const forceLoading = useCallback(() => {
        if (analysesRef.current.length === 0) {
            setLoading(true);
        } else {
            setBackgroundLoading(true);
        }
    }, []);

    const isAxiosError = (err: unknown): err is AxiosErrorLike => {
        return typeof err === 'object' && err !== null && 'response' in err;
    };

    const { page, riskLevel } = otherFilters;

    useEffect(() => {
        let isMounted = true;

        const fetchInitialData = async () => {
            if (analysesRef.current.length === 0) {
                setLoading(true);
            } else {
                setBackgroundLoading(true);
            }

            try {
                const activeFilters: AnalysisFilters = {
                    page,
                    riskLevel,
                    search: debouncedSearch || undefined
                };

                const data = await analysisApi.getAnalysisHistory(activeFilters);

                if (!isMounted) return;

                setAnalyses(data.content ?? []);
                setTotalPages(data.totalPages ?? 0);
                setTotalElements(data.totalElements ?? 0);
                setPageNumber(data.pageNumber ?? 0);
                setIsLastPage(data.last ?? true);
                setError(null);
            } catch (requestError: unknown) {
                if (!isMounted) return;

                if (isAxiosError(requestError) && requestError.response?.status === 403) {
                    setError("ACCESO DENEGADO: SESIÓN INSUFICIENTE O EXPIRADA. VOLVÉ A INICIAR SESIÓN PARA REINTENTAR LA ACCIÓN.");
                } else {
                    setError("ERROR DE CONEXIÓN: NO SE PUDO ESTABLECER COMUNICACIÓN CON EL MÓDULO DE ANÁLISIS. POR FAVOR, REINTENTÁ EL PROCESO.");
                }

                setAnalyses([]);
                setTotalPages(0);
                setTotalElements(0);
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setBackgroundLoading(false);
                }
            }
        };

        void fetchInitialData();

        return () => {
            isMounted = false;
        };
    }, [page, riskLevel, debouncedSearch]);

    const handleRetry = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const activeFilters: AnalysisFilters = {
                page,
                riskLevel,
                search: debouncedSearch || undefined
            };
            const data = await analysisApi.getAnalysisHistory(activeFilters);
            setAnalyses(data.content ?? []);
            setTotalPages(data.totalPages ?? 0);
            setTotalElements(data.totalElements ?? 0);
            setPageNumber(data.pageNumber ?? 0);
            setIsLastPage(data.last ?? true);
        } catch (requestError: unknown) {
            if (isAxiosError(requestError) && requestError.response?.status === 403) {
                setError("ACCESO DENEGADO: SESIÓN INSUFICIENTE O EXPIRADA. VOLVÉ A INICIAR SESIÓN PARA REINTENTAR LA ACCIÓN.");
            } else {
                setError("ERROR DE CONEXIÓN: NO SE PUDO ESTABLECER COMUNICACIÓN CON EL MÓDULO DE ANÁLISIS. POR FAVOR, REINTENTÁ EL PROCESO.");
            }
        } finally {
            setLoading(false);
            setBackgroundLoading(false);
        }
    }, [page, riskLevel, debouncedSearch]);

    const isDebouncing = searchTerm.trim() !== debouncedSearch;
    const isBackgroundLoading = backgroundLoading || isDebouncing;

    return {
        analyses,
        totalPages,
        totalElements,
        pageNumber,
        isLastPage,
        loading,
        isBackgroundLoading,
        error,
        retry: handleRetry,
        forceLoading
    } as const;
}