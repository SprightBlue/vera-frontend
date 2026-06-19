import { useState, useCallback } from 'react';
import { getAlertDetail, resolveAlert, deleteAlert, type AlertDetail } from '../api/alerts-api';

export function useAlertDetail(alertId?: string) {
    const [detail, setDetail] = useState<AlertDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadDetail = useCallback(async () => {
        if (!alertId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getAlertDetail(alertId);
            setDetail(data);
        } catch {
            setError("No se pudo cargar el detalle de la alerta.");
        } finally {
            setLoading(false);
        }
    }, [alertId]);

    const markAsResolved = async () => {
        if (!alertId) return;
        try {
            await resolveAlert(alertId);
            await loadDetail();
        } catch {
            setError("Error al marcar la alerta como resuelta.");
        }
    };

    const removeAlert = async () => {
        if (!alertId) return;
        try {
            await deleteAlert(alertId);
        } catch {
            setError("Error al eliminar la alerta.");
        }
    };

    return { detail, loading, error, loadDetail, markAsResolved, removeAlert };
}