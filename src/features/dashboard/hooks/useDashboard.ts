import {useState, useEffect, useCallback} from "react";
import {getDashboardData, type DashboardResponse} from "@/features/dashboard/api/dashboardApi";

interface AxiosErrorLike {
    response?: {
        status: number;
    };
}

export function useDashboard() {
    const [data, setData] = useState<DashboardResponse | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [isBackgroundLoading, setIsBackgroundLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const isAxiosError = (err: unknown): err is AxiosErrorLike => {
        return typeof err === "object" && err !== null && "response" in err;
    };

    const refetch = useCallback(async () => {
        if (data) {
            setIsBackgroundLoading(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const result = await getDashboardData();
            setData(result);
        } catch (err: unknown) {
            setData(null);
            if (isAxiosError(err) && err.response?.status === 403) {
                setError("ACCESO DENEGADO: SESIÓN INSUFICIENTE O EXPIRADA. VOLVÉ A INICIAR SESIÓN.");
            } else {
                setError("ERROR DE CONEXIÓN: NO SE PUDIERON OBTENER LOS DATOS DEL PANEL PRINCIPAL.");
            }
        } finally {
            setLoading(false);
            setIsBackgroundLoading(false);
        }
    }, [data]);

    useEffect(() => {
        let isMounted = true;

        async function loadInitialData() {
            setError(null);
            try {
                const result = await getDashboardData();
                if (isMounted) {
                    setData(result);
                }
            } catch (err: unknown) {
                if (isMounted) {
                    setData(null);
                    if (isAxiosError(err) && err.response?.status === 403) {
                        setError("ACCESO DENEGADO: SESIÓN INSUFICIENTE O EXPIRADA. VOLVÉ A INICIAR SESIÓN.");
                    } else {
                        setError("ERROR DE CONEXIÓN: NO SE PUDIERON OBTENER LOS DATOS DEL PANEL PRINCIPAL.");
                    }
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        void loadInitialData();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        data,
        loading,
        isBackgroundLoading,
        error,
        refetch
    } as const;
}