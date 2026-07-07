import { useState, useEffect, useCallback } from 'react';
import { alertsApi, type AlertsResponse, type AlertFilters } from '@/features/alerts/api/alertsApi.ts';

interface UseAlertsProps extends Omit<AlertFilters, 'search'> {
    searchTerm: string;
}

export function useAlertsList({ searchTerm, ...otherFilters }: UseAlertsProps) {
    const [alerts, setAlerts] = useState<AlertsResponse[]>([]);
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

    const { page, resolved, riskLevel } = otherFilters;

    useEffect(() => {
        let isMounted = true;

        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const activeFilters: AlertFilters = {
                    page,
                    resolved,
                    riskLevel,
                    search: debouncedSearch || undefined
                };

                const data = await alertsApi.getAlertsHistory(activeFilters);

                if (!isMounted) return;

                setAlerts(data.content ?? []);
                setTotalPages(data.totalPages ?? 0);
                setTotalElements(data.totalElements ?? 0);
                setPageNumber(data.pageNumber ?? 0);
                setIsLastPage(data.last ?? true);
                setError(null);
            } catch {
                if (!isMounted) return;
                setError('No se pudo establecer conexión con el módulo de auditoría.');
                setAlerts([]);
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
    }, [page, resolved, riskLevel, debouncedSearch]);

    const handleRetry = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const activeFilters: AlertFilters = {
                page,
                resolved,
                riskLevel,
                search: debouncedSearch || undefined
            };
            const data = await alertsApi.getAlertsHistory(activeFilters);
            setAlerts(data.content ?? []);
            setTotalPages(data.totalPages ?? 0);
            setTotalElements(data.totalElements ?? 0);
            setPageNumber(data.pageNumber ?? 0);
            setIsLastPage(data.last ?? true);
        } catch {
            setError('No se pudo establecer conexión con el módulo de auditoría.');
        } finally {
            setLoading(false);
        }
    }, [page, resolved, riskLevel, debouncedSearch]);

    return {
        alerts,
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