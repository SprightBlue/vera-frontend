import {useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useAuth} from "@/presentation/context/AuthContext";
import Sidebar from "@/features/shared/components/Sidebar";
import Header from "@/features/shared/components/Header";
import {useAlertDetail} from "@/features/alerts/hooks/useAlertDetail";
import {getRiskVariant, RISK_LABELS_ES} from "@/features/shared/utils/typeConfig";
import {type RiskLevel} from "@/features/alerts/api/alertsApi";
import {AlertCircle, CheckCircle, Trash2} from "lucide-react";

import {LoadingScreen} from "@/features/shared/components/LoadingScreen";
import {RetryScreen} from "@/features/shared/components/RetryScreen";
import {DetailHeader} from "@/features/shared/components/DetailHeader";
import {DetailMetaRow} from "@/features/shared/components/DetailMetaRow";
import {DetailContentBox} from "@/features/shared/components/DetailContentBox";
import {ActionButton} from "@/features/shared/components/ActionButton";
import {ListButton} from "@/features/shared/components/ListButton";

export function AlertDetail() {
    const {alertId} = useParams<{ alertId: string }>();
    const navigate = useNavigate();
    const {user} = useAuth();
    const {detail, loading, error, retry, markAsResolved, removeAlert} = useAlertDetail(alertId!);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [actionLoading, setActionLoading] = useState<boolean>(false);

    const riskLevel = detail?.riskLevel as RiskLevel;
    const variant = getRiskVariant(riskLevel);
    const percentage = detail?.riskPercentage ?? 0;
    const labelES = riskLevel ? RISK_LABELS_ES[riskLevel] : 'General';

    return (
        <div
            className="flex h-screen w-screen overflow-hidden bg-[#050814] text-slate-100 font-sans antialiased select-none">
            <Sidebar/>

            <div
                className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56">
                <Header userName={user?.fullName ?? "Usuario"} title="Detalle de la Alerta"/>

                <main
                    className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1.5rem,3vw,3.5rem)] py-[clamp(1.5rem,2.5vw,3rem)] flex flex-col justify-between">
                    <div
                        className="mx-auto max-w-7xl w-full flex-1 flex flex-col gap-[clamp(1.2rem,1.8vw,2rem)] animate-fade-in">

                        <ListButton to="/alerts"/>

                        {loading ? (
                            <LoadingScreen/>
                        ) : error ? (
                            <RetryScreen onRetry={retry}/>
                        ) : detail ? (
                            <>
                                <DetailHeader
                                    title={detail.title}
                                    riskLevel={labelES}
                                    percentage={percentage}
                                    variant={variant}
                                    actions={
                                        <>
                                            <ActionButton
                                                variant={detail.isResolved ? "success" : "warning"}
                                                onClick={async () => {
                                                    if (detail.isResolved) return;
                                                    setActionLoading(true);
                                                    await markAsResolved();
                                                    setActionLoading(false);
                                                }}
                                                isLoading={actionLoading}
                                                disabled={detail.isResolved || deleteLoading}
                                                icon={detail.isResolved ? CheckCircle : AlertCircle}
                                            >
                                                {detail.isResolved ? "Resuelta" : "Pendiente"}
                                            </ActionButton>

                                            <ActionButton
                                                variant="danger"
                                                onClick={async () => {
                                                    setDeleteLoading(true);
                                                    const success = await removeAlert();
                                                    if (success) {
                                                        navigate('/alerts');
                                                    } else {
                                                        setDeleteLoading(false);
                                                    }
                                                }}
                                                isLoading={deleteLoading}
                                                disabled={actionLoading}
                                                icon={Trash2}
                                            >
                                                Eliminar
                                            </ActionButton>
                                        </>
                                    }
                                />

                                <DetailMetaRow
                                    source={detail.source}
                                    createdAt={detail.createdAt}
                                    riskType={detail.riskType}
                                />

                                <div className="w-full space-y-[clamp(1.2rem,1.5vw,2rem)]">
                                    <DetailContentBox
                                        title="Resumen analítico del Contenido"
                                        content={detail.contentSummary || 'No se pudo generar un resumen conceptual.'}
                                        variant="info"
                                    />

                                    <DetailContentBox
                                        title="Patrones Sospechosos Detectados"
                                        content={detail.suspiciousPatterns || 'Sin patrones de riesgo explícitos identificados.'}
                                        variant="danger"
                                    />
                                </div>
                            </>
                        ) : null}

                    </div>
                </main>
            </div>
        </div>
    );
}