import { MessageSquareShare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { AnalysisDetailResponse } from '@/features/analysis/api/analysisApi';

import { getRiskVariant, RISK_LABELS_ES } from '@/features/shared/utils/typeConfig';
import { type RiskLevel } from '@/features/alerts/api/alertsApi';

import { DetailHeader } from '@/features/shared/components/DetailHeader';
import { DetailMetaRow } from '@/features/shared/components/DetailMetaRow';
import { DetailContentBox } from '@/features/shared/components/DetailContentBox';
import { ActionButton } from '@/features/shared/components/ActionButton';
import { LoadingScreen } from '@/features/shared/components/LoadingScreen';
import { RetryScreen } from '@/features/shared/components/RetryScreen';

type Props = {
    result: AnalysisDetailResponse | null;
    loading: boolean;
    error: string | null;
    isStartingChat: boolean;
    onStartChat: (id: string) => Promise<string | null>;
};

export function AnalysisResult({ result, loading, error, isStartingChat, onStartChat }: Props) {
    const navigate = useNavigate();

    if (loading) {
        return <LoadingScreen label="ANALIZANDO CONTENIDO MEDIANTE IA..." />;
    }

    if (error) {
        return <RetryScreen onRetry={() => window.location.reload()} label="REINTENTAR ANÁLISIS" />;
    }

    if (!result) return null;

    const riskLevel = (result.riskLevel?.toUpperCase()) as RiskLevel;
    const uiVariant = getRiskVariant(riskLevel);
    const labelES = riskLevel ? RISK_LABELS_ES[riskLevel] : 'General';
    const percentage = result.riskPercentage ?? 0;

    const handleStartAnalysisChat = async (): Promise<void> => {
        if (!result.id || isStartingChat) return;
        const chatId = await onStartChat(result.id);
        if (chatId) {
            navigate(`/chat?currentChatId=${chatId}`);
        }
    };

    const actionButton = uiVariant === 'danger' ? (
        <ActionButton
            variant="info"
            isLoading={isStartingChat}
            icon={MessageSquareShare}
            onClick={handleStartAnalysisChat}
        >
            Iniciar Chat IA
        </ActionButton>
    ) : undefined;

    return (
        <section className="w-full space-y-[clamp(1rem,1.5vw,1.8rem)] pt-[clamp(1.5rem,2vw,2.5rem)] pb-8 animate-fade-in relative">

            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#161f37]/90 to-transparent pointer-events-none" />

            <DetailHeader
                title={result.title || 'Contenido Analizado'}
                riskLevel={labelES}
                percentage={percentage}
                variant={uiVariant}
                actions={actionButton}
            />

            <DetailMetaRow
                source={result.source || 'NO ESPECIFICADO'}
                createdAt={result.createdAt}
                riskType={result.riskType || 'GENERAL'}
            />

            <div className="w-full space-y-[clamp(1rem,1.2vw,1.5rem)]">
                <DetailContentBox
                    title="RESUMEN ANALÍTICO DEL CONTENIDO"
                    content={result.contentSummary || 'No se pudo generar un resumen conceptual por parte del motor de IA.'}
                    variant="info"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1rem,1.2vw,1.5rem)] items-stretch">
                    <DetailContentBox
                        title="PATRONES SOSPECHOSOS DETECTADOS"
                        content={result.suspiciousPatterns || 'Sin patrones de riesgo explícitos identificados en el cuerpo del mensaje.'}
                        variant="danger"
                    />

                    <DetailContentBox
                        title="RECOMENDACIÓN SUGERIDA"
                        content={result.recommendation || 'No se requieren acciones complejas ni medidas de contingencia adicionales.'}
                        variant="success"
                    />
                </div>
            </div>
        </section>
    );
}