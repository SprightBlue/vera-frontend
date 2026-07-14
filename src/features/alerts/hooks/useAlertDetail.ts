import {useState, useEffect, useCallback} from 'react';
import {alertsApi, type AlertsDetailResponse} from '@/features/alerts/api/alertsApi';

interface AxiosErrorLike {
    response?: {
        status: number;
    };
}

export function useAlertDetail(alertId?: string) {
    const [detail, setDetail] = useState<AlertsDetailResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(!!alertId);
    const [error, setError] = useState<string | null>(null);

    const isAxiosError = (err: unknown): err is AxiosErrorLike => {
        return typeof err === 'object' && err !== null && 'response' in err;
    };

    useEffect(() => {
        if (!alertId) return;
        let isMounted = true;

        const fetchDetailData = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await alertsApi.getAlertDetail(alertId);
                if (!isMounted) return;
                setDetail(data);
                setError(null);
            } catch (requestError: unknown) {
                if (!isMounted) return;
                setDetail(null);

                if (isAxiosError(requestError) && requestError.response?.status === 404) {
                    setError("ERROR DE SISTEMA: NO SE ENCONTRÓ EL REGISTRO DE ALERTA SOLICITADO EN LA BASE DE DATOS LOCAL.");
                } else {
                    setError("ERROR DE CONEXIÓN: NO SE PUDO ESTABLECER COMUNICACIÓN CON EL SERVIDOR CENTRAL.");
                }
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
        } catch (requestError: unknown) {
            if (isAxiosError(requestError) && requestError.response?.status === 404) {
                setError("ERROR DE SISTEMA: NO SE ENCONTRÓ EL REGISTRO DE ALERTA SOLICITADO EN LA BASE DE DATOS LOCAL.");
            } else {
                setError("ERROR DE CONEXIÓN: NO SE PUDO ESTABLECER COMUNICACIÓN CON EL SERVIDOR CENTRAL.");
            }
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
        } catch (requestError: unknown) {
            if (isAxiosError(requestError) && requestError.response?.status === 403) {
                setError("ACCESO DENEGADO: NO POSEÉS CREDENCIALES VÁLIDAS PARA MARCAR ESTA ALERTA COMO RESUELTA.");
            } else {
                setError("ERROR DE PROTOCOLO: NO SE PUDO PROCESAR LA SOLICITUD DE ACTUALIZACIÓN EN EL NÚCLEO DE SEGURIDAD.");
            }
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
        markAsResolved,
        removeAlert
    } as const;
}