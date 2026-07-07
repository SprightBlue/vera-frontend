import { useState, useEffect, useCallback } from 'react';
import { analysisApi, type AnalysisResponse, type AnalysisFilters } from '@/features/analysis/api/analysisApi.ts';

interface UseAnalysisListProps extends Omit<AnalysisFilters, 'search'> {
    searchTerm: string;
}

export function useAnalysisList({ searchTerm, ...otherFilters }: UseAnalysisListProps) {
    const [analyses, setAnalyses] = useState<AnalysisResponse[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [isLastPage, setIsLastPage] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [debouncedSearch, setDebouncedSearch] = useState<string>('');

    const isDebouncing = searchTerm.trim() !== debouncedSearch;

    const forceLoading = useCallback(() => {
        setLoading(true);
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm.trim());
        }, 400);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { page, riskLevel } = otherFilters;

    useEffect(() => {
        let isMounted = true;

        const fetchInitialData = async () => {
            setLoading(true);
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
            } catch {
                if (!isMounted) return;
                setError('No se pudo establecer conexión con el módulo de auditoría de análisis.');
                setAnalyses([]);
                setTotalPages(0);
                setTotalElements(0);
            } finally {
                if (isMounted) setLoading(false);
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
        } catch {
            setError('No se pudo establecer conexión con el módulo de auditoría de análisis.');
        } finally {
            setLoading(false);
        }
    }, [page, riskLevel, debouncedSearch]);

    return {
        analyses,
        totalPages,
        totalElements,
        pageNumber,
        isLastPage,
        loading: loading || isDebouncing,
        error,
        retry: handleRetry,
        forceLoading
    } as const;
}