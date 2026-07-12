import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/presentation/context/AuthContext";
import Sidebar from "@/features/shared/components/Sidebar.tsx";
import Header from "@/features/shared/components/Header.tsx";
import { useAnalysisDetail } from "@/features/analysis/hooks/useAnalysisDetail";
import { getRiskVariant, RISK_LABELS_ES } from "@/features/shared/utils/typeConfig";
import { type RiskLevel } from "@/features/alerts/api/alertsApi";
import { Trash2 } from "lucide-react";

import { LoadingScreen } from "@/features/shared/components/LoadingScreen";
import { RetryScreen } from "@/features/shared/components/RetryScreen";
import { DetailHeader } from "@/features/shared/components/DetailHeader";
import { DetailMetaRow } from "@/features/shared/components/DetailMetaRow";
import { DetailContentBox } from "@/features/shared/components/DetailContentBox";
import { ActionButton } from "@/features/shared/components/ActionButton";
import { ListButton } from "@/features/shared/components/ListButton.tsx";

export function AnalysisDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { detail, loading, error, retry, removeAnalysis } = useAnalysisDetail(id!);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

    const riskLevel = detail?.riskLevel as RiskLevel;
    const variant = getRiskVariant(riskLevel);
    const percentage = detail?.riskPercentage ?? 0;
    const labelES = riskLevel ? RISK_LABELS_ES[riskLevel] : 'General';

    const riskSubtitle = variant === 'danger'
        ? 'Se detectó un peligro inminente bajo indicadores críticos de fraude. Te recomendamos de forma tajante cortar comunicación y resguardar tus credenciales.'
        : variant === 'warning'
            ? 'Se identificaron patrones irregulares o sospechosos en la estructura del mensaje. Procedé con precaución.'
            : 'El contenido cumple con los parámetros básicos de seguridad analizados.';

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050814] text-slate-100 font-sans antialiased select-none">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56">
                <Header userName={user?.fullName ?? "Usuario"} title="Detalle del Análisis" />

                <main className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1.5rem,3vw,3.5rem)] py-[clamp(1.5rem,2.5vw,3rem)] flex flex-col justify-between">
                    <div className="mx-auto max-w-7xl w-full flex-1 flex flex-col gap-[clamp(1.2rem,1.8vw,2rem)] animate-fade-in">

                        <ListButton to="/analysis-list" />

                        {loading ? (
                            <LoadingScreen />
                        ) : error ? (
                            <RetryScreen onRetry={retry} />
                        ) : detail ? (
                            <>
                                <DetailHeader
                                    title={detail.title}
                                    riskLevel={labelES}
                                    percentage={percentage}
                                    variant={variant}
                                    subtitle={riskSubtitle}
                                    actions={
                                        <ActionButton
                                            variant="danger"
                                            onClick={async () => {
                                                setDeleteLoading(true);
                                                const success = await removeAnalysis();
                                                if (success) {
                                                    navigate('/analysis-list');
                                                } else {
                                                    setDeleteLoading(false);
                                                }
                                            }}
                                            isLoading={deleteLoading}
                                            icon={Trash2}
                                        >
                                            Eliminar
                                        </ActionButton>
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

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.2rem,1.5vw,2rem)] items-stretch">
                                        <DetailContentBox
                                            title="Patrones Sospechosos Detectados"
                                            content={detail.suspiciousPatterns || 'Sin patrones de riesgo explícitos identificados.'}
                                            variant="danger"
                                        />
                                        <DetailContentBox
                                            title="Recomendación Sugerida"
                                            content={detail.recommendation || 'No se requieren acciones complejas.'}
                                            variant="success"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : null}

                    </div>
                </main>
            </div>
        </div>
    );
}