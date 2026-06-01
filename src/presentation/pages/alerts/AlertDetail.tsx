import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import AlertBanner from "../../components/alerts/AlertBanner";
import RiskLevelCard from "../../components/alerts/RiskLevelCard";
import DetectionSummaryCard from "../../components/alerts/DetectionSummaryCard";
import MessageCard from "../../components/alerts/MessageCard";
import SuspiciousPatternsCard from "../../components/alerts/SuspiciousPatternsCard";
import RecommendationCard from "../../components/alerts/RecommendationCard";

import { useAlertDetail } from "../../hooks/alerts/useAlertDetail";
import { RISK_CONFIG } from "../../components/alerts/alert-ui.ts";

function AlertDetail() {
    const { alertId } = useParams<{ alertId: string }>();
    const navigate = useNavigate();
    const { detail, loading, error } = useAlertDetail(alertId);

    const risk = RISK_CONFIG[detail?.riskLevel ?? "UNDEFINED"];

    return (
        <div className="flex min-h-screen bg-[#050816]">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 ml-[260px]">
                <Header
                    userName="Usuario"
                    title="Alertas y Notificaciones"
                    subtitle="Monitorea actividad sospechosa y amenazas detectadas"
                />

                <div className="p-8 max-w-7xl w-full mx-auto">

                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => navigate('/alerts')}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-semibold text-white">Detalles de Alerta</h1>
                        </div>
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-slate-400">Cargando...</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                            {error}
                        </div>
                    )}

                    {detail && (
                        <div className="flex flex-col gap-5">
                            <AlertBanner
                                messageSource={detail.messageSource}
                                risk={risk}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <RiskLevelCard risk={risk} />
                                <DetectionSummaryCard
                                    messageSource={detail.messageSource}
                                    createdAt={detail.createdAt}
                                    risk={risk}
                                />
                            </div>

                            <MessageCard content={detail.messageContent} />
                            <SuspiciousPatternsCard patterns={detail.suspiciousPatterns} risk={risk} />
                            <RecommendationCard recommendation={detail.recommendation} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AlertDetail;