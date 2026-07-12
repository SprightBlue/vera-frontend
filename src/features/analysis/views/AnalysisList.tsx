import { useState, type ChangeEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/presentation/context/AuthContext.tsx';
import Sidebar from '@/features/shared/components/Sidebar.tsx';
import Header from '@/features/shared/components/Header.tsx';
import { useAnalysisList } from '@/features/analysis/hooks/useAnalysisList.ts';
import { type RiskLevel } from '@/features/analysis/api/analysisApi.ts';

import { getRiskVariant, RISK_LABELS_ES, RISK_FILTER_OPTIONS } from '@/features/shared/utils/typeConfig';

import { LoadingScreen } from '@/features/shared/components/LoadingScreen';
import { RetryScreen } from '@/features/shared/components/RetryScreen';
import { EmptyScreen } from '@/features/shared/components/EmptyScreen';
import { Pagination } from '@/features/shared/components/Pagination';
import { SearchInput } from '@/features/shared/components/SearchInput';
import { FilterToggleGroup } from '@/features/shared/components/FilterToggleGroup';
import { ItemCard } from '@/features/shared/components/ItemCard';

type RiskFilterType = RiskLevel | 'NONE';

export function AnalysisList() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [page, setPage] = useState<number>(0);
    const [inputValue, setInputValue] = useState<string>('');
    const [activeRisk, setActiveRisk] = useState<RiskFilterType>('NONE');

    const {
        analyses,
        totalPages,
        totalElements,
        loading,
        isBackgroundLoading,
        error,
        retry,
        forceLoading
    } = useAnalysisList({
        page,
        riskLevel: activeRisk === 'NONE' ? undefined : activeRisk,
        searchTerm: inputValue
    });

    const handleRiskToggle = useCallback((risk: RiskLevel) => {
        forceLoading();
        setActiveRisk(prev => prev === risk ? 'NONE' : risk);
        setPage(0);
    }, [forceLoading]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const hasData = analyses.length > 0;

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050814] text-slate-100 font-sans antialiased select-none">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56">
                <Header userName={user?.fullName ?? "Usuario"} title="Historial de Análisis" />

                <main className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1.5rem,3vw,3.5rem)] py-[clamp(1.5rem,2.5vw,3rem)] flex flex-col justify-between">
                    <div className="mx-auto max-w-7xl w-full flex-1 flex flex-col gap-[clamp(1.5rem,2.5vw,3rem)] animate-fade-in">

                        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-5 w-full pb-6">
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#161f37]/90 to-transparent pointer-events-none" />

                            <SearchInput
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder="Buscar por título o resumen..."
                            />

                            <div className="flex flex-wrap items-center gap-[clamp(1rem,1.5vw,2rem)]">
                                <FilterToggleGroup
                                    title="Nivel de Riesgo"
                                    options={RISK_FILTER_OPTIONS}
                                    activeValue={activeRisk}
                                    onToggle={handleRiskToggle}
                                />
                            </div>
                        </div>

                        {loading ? (
                            <LoadingScreen />
                        ) : error ? (
                            <RetryScreen onRetry={retry} />
                        ) : (
                            <div className={`w-full flex-1 flex flex-col transition-opacity duration-200 ${isBackgroundLoading ? 'opacity-40 pointer-events-none' : ''}`}>
                                {hasData ? (
                                    <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-4 auto-rows-max">
                                        {analyses.map((analysis) => {
                                            const level: RiskLevel = analysis.riskLevel || 'LOW';
                                            const riskVariant = getRiskVariant(level);

                                            return (
                                                <ItemCard
                                                    key={analysis.id}
                                                    title={analysis.title}
                                                    subtitle={user?.fullName ?? "Usuario"}
                                                    description={analysis.contentSummary || 'Sin resumen descriptivo anexado al registro.'}
                                                    timestamp={analysis.createdAt}
                                                    primaryVariant={riskVariant}
                                                    badges={[
                                                        { label: `Riesgo ${RISK_LABELS_ES[level]}`, variant: riskVariant }
                                                    ]}
                                                    onActionClick={() => navigate(`/analysis/${analysis.id}`)}
                                                />
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <EmptyScreen label="NO SE ENCONTRARON ANÁLISIS EN EL HISTORIAL" />
                                )}
                            </div>
                        )}

                        {!error && hasData && (
                            <div className="relative w-full mt-auto pt-6">
                                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#161f37]/90 to-transparent pointer-events-none" />
                                <Pagination
                                    page={page}
                                    totalPages={totalPages}
                                    totalElements={totalElements}
                                    loading={loading || isBackgroundLoading}
                                    onPageChange={handlePageChange}
                                    onForceLoading={forceLoading}
                                />
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
}