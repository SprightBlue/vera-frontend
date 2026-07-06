import { useState, useEffect, useCallback } from 'react';
import { alertsApi, type AlertsDetailResponse } from '@/features/alerts/api/alertsApi.ts';

export function useAlertDetail(alertId?: string) {
    const [detail, setDetail] = useState<AlertsDetailResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(!!alertId);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!alertId) return;
        let isMounted = true;

        const fetchDetailData = async () => {
            try {
                const data = await alertsApi.getAlertDetail(alertId);
                if (!isMounted) return;
                setDetail(data);
                setError(null);
            } catch {
                if (!isMounted) return;
                setDetail(null);
                setError("No se pudo recuperar el informe forense de la alerta.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        void fetchDetailData();

        return () => {
            isMounted = false;
        };
    }, [alertId]);

    const executeReload = useCallback(async (): Promise<void> => {
        if (!alertId) return;
        setLoading(true);
        setError(null);
        setDetail(null);
        try {
            const data = await alertsApi.getAlertDetail(alertId);
            setDetail(data);
        } catch {
            setError("No se pudo recuperar el informe forense de la alerta.");
        } finally {
            setLoading(false);
        }
    }, [alertId]);

    const markAsResolved = async (): Promise<boolean> => {
        if (!alertId) return false;
        try {
            await alertsApi.resolveAlert(alertId);
            const data = await alertsApi.getAlertDetail(alertId);
            setDetail(data);
            setError(null);
            return true;
        } catch {
            setError("No se pudo actualizar el vector a estado resuelto.");
            return false;
        }
    };

    const removeAlert = async (): Promise<boolean> => {
        if (!alertId) return false;
        try {
            await alertsApi.deleteAlert(alertId);
            setDetail(null);
            setError(null);
            return true;
        } catch {
            setError("No se pudo purgar la alerta seleccionada.");
            return false;
        }
    };

    return {
        detail,
        loading,
        error,
        retry: executeReload,
        markAsResolved,
        removeAlert
    } as const;
}