import { useState, useCallback } from 'react';
import { getAlerts, type AlertSummary } from '../api/alerts-api';

export function useAlerts() {
    const [alerts, setAlerts] = useState<AlertSummary[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadAlerts = useCallback(async (page: number, resolved?: boolean): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const data = await getAlerts(page, resolved);
            setAlerts(data.content ?? []);
            setTotalPages(data.totalPages ?? 0);
        } catch (requestError: unknown) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : 'Error al cargar las alertas'
            );
            setAlerts([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, []);

    return { alerts, totalPages, loading, error, loadAlerts } as const;
}