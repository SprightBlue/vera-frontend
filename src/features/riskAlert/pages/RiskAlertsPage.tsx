import {useEffect, useState} from 'react';
import {getActiveAlerts, solveAlert} from '../services/riskAlert.service.ts';
import type {RiskAlertResponseDto} from '../types/riskAlert.types.ts';
import {RiskAlertListItem} from '../components/RiskAlertListItem.tsx';
import {RiskAlertDetail} from '../components/RiskAlertDetail.tsx';

const HARDCODED_CAREGIVER_ID = 2;

export function RiskAlertsPage() {
    const [alerts, setAlerts] = useState<RiskAlertResponseDto[]>([]);
    const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchAlerts = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const activeAlerts = await getActiveAlerts(HARDCODED_CAREGIVER_ID);

                if (isMounted) {
                    setAlerts(activeAlerts);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Error al conectar con el servidor.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchAlerts();

        return () => { isMounted = false; };
    }, []);

    const handleSolveAlert = async (alertId: string): Promise<void> => {
        try {
            setIsLoading(true);
            await solveAlert(alertId);
            setAlerts((prev) => prev.filter((a) => a.alertId !== alertId));
            setSelectedAlertId(null);
        } catch (err) {
            const errMsg = err instanceof Error ? err.message : 'Error de red';
            window.alert('No se pudo resolver la alerta: ' + errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const currentAlert = alerts.find((a) => a.alertId === selectedAlertId);

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
            <div className="mx-auto max-w-5xl">

                {!selectedAlertId && (
                    <div className="mb-8 border-b border-slate-800 pb-6 transition-all duration-300">
                        <h1 className="heading-xl tracking-tight">
                            Mensajes bajo revisión
                        </h1>
                        <p className="body-text text-sm mt-1">
                            Monitoreo en tiempo real para evitar posibles engaños o situaciones de riesgo.
                        </p>
                    </div>
                )}

                {error && (
                    <div
                        className="analysis-appear flex flex-col items-center justify-center text-center p-12 my-8 rounded-xl border border-red-500/30 bg-red-950/10 backdrop-blur-sm max-w-xl mx-auto">
                    <span className="material-symbols-rounded text-red-500 text-4xl mb-3">
                        error
                    </span>
                        <h3 className="heading-md text-red-400 mb-1">
                            Error de Conexión
                        </h3>
                        <p className="font-inter text-sm text-gray-400 leading-relaxed">
                            {error}
                        </p>
                    </div>
                )}

                {isLoading && selectedAlertId !== null && (
                    <div className="analysis-appear w-full animate-pulse space-y-6">
                        <div
                            className="relative rounded-xl border border-slate-800 bg-slate-900/20 p-6 pr-12 min-h-85">
                            <div className="mb-6 border-b border-slate-800 pb-4 space-y-3">
                                <div className="h-3 w-32 bg-slate-800 rounded"/>
                                <div className="h-6 w-3/5 bg-slate-800/60 rounded"/>
                            </div>
                            <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch mb-6">
                                <div
                                    className="lg:col-span-6 rounded-lg border border-slate-900 bg-slate-950 p-5 h-28 space-y-2">
                                    <div className="h-2.5 w-24 bg-slate-800 rounded"/>
                                    <div className="h-3 w-5/6 bg-slate-800/40 rounded"/>
                                </div>
                                <div
                                    className="lg:col-span-6 rounded-lg border border-slate-900 bg-slate-950 p-5 h-28 space-y-2">
                                    <div className="h-2.5 w-36 bg-slate-800 rounded"/>
                                    <div className="h-3 w-4/5 bg-slate-800/40 rounded"/>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                                <div className="h-10 w-32 bg-slate-800 rounded-lg"/>
                                <div className="h-10 w-36 bg-slate-800/60 rounded-lg"/>
                            </div>
                        </div>
                    </div>
                )}

                {isLoading && alerts.length === 0 && (
                    <div className="flex flex-col gap-3 animate-pulse">
                        {[1, 2, 3].map((n) => (
                            <div key={n}
                                 className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/20 p-4 min-h-18.5">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="h-3 w-3 shrink-0 rounded-full bg-slate-800"/>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-3 w-1/4 bg-slate-800 rounded"/>
                                        <div className="h-2.5 w-3/4 bg-slate-800/40 rounded"/>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-5 w-16 bg-slate-800 rounded"/>
                                    <div className="h-3 w-12 bg-slate-800/40 rounded"/>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!error && !isLoading && (
                    <div className="transition-all duration-300 ease-in-out">
                        {currentAlert ? (
                            <RiskAlertDetail
                                alert={currentAlert}
                                onBack={() => setSelectedAlertId(null)}
                                onSolve={handleSolveAlert}
                            />
                        ) : (
                            <div className="flex flex-col gap-3 fade-in-up">
                                {alerts.length > 0 ? (
                                    alerts.map((alert) => (
                                        <RiskAlertListItem
                                            key={alert.alertId}
                                            alert={alert}
                                            onSelect={(id) => setSelectedAlertId(id)}
                                        />
                                    ))
                                ) : (
                                    <div
                                        className="py-12 text-center text-sm text-gray-400 font-inter analysis-empty-appear">
                                        No hay alertas pendientes.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </main>
    );
}
