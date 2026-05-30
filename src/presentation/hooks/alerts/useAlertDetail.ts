import { useEffect, useState } from "react";
import { getAlertDetail } from "../../../infrastructure/api/alerts-api";
import type { AlertDetail } from "../../../domain/models/AlertDetail";

interface UseAlertDetailResult {
    detail: AlertDetail | null;
    loading: boolean;
    error: string | null;
}

export function useAlertDetail(alertId: string | undefined): UseAlertDetailResult {
    const [detail, setDetail] = useState<AlertDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!alertId) return;

        setLoading(true);
        setError(null);

        getAlertDetail(alertId)
            .then(setDetail)
            .catch(() => setError("No se pudo cargar el detalle de la alerta."))
            .finally(() => setLoading(false));
    }, [alertId]);

    return { detail, loading, error };
}