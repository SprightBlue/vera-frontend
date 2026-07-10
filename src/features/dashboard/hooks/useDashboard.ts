import { useState, useEffect, useCallback } from "react";
import { getDashboardData, type DashboardResponse } from "../api/dashboardApi";

export function useDashboard() {
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    // Función optimizada para traer o refrescar los datos del backend
    const fetchDashboardData = useCallback(async () => {
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

    // Efecto de carga inicial al montar el componente
    useEffect(() => {
        void fetchDashboardData();
    }, [fetchDashboardData]);

    return {
        data,
        loading,
        error,
        refetch: fetchDashboardData // Exponemos para refrescar manualmente tras acciones del usuario
    } as const;
}