import { useState, useEffect, useCallback } from "react";
import { getDashboardData, type DashboardResponse } from "@/features/dashboard/api/dashboardApi";

export function useDashboard() {
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const result = await getDashboardData();
            setData(result);
        } catch (err) {
            console.error("Error al obtener los datos del Dashboard:", err);
            setError(true);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const timeoutId = setTimeout(() => {
            async function loadInitialData() {
                try {
                    const result = await getDashboardData();
                    if (isMounted) setData(result);
                } catch (err) {
                    console.error("Error al obtener los datos del Dashboard:", err);
                    if (isMounted) {
                        setError(true);
                        setData(null);
                    }
                } finally {
                    if (isMounted) setLoading(false);
                }
            }
            void loadInitialData();
        }, 0);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, []);

    return {
        data,
        loading,
        error,
        refetch
    } as const;
}