import { useState, type ChangeEvent, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/presentation/context/AuthContext.tsx';
import Sidebar from '@/presentation/components/Sidebar';
import Header from '@/presentation/components/Header';
import { useAnalysisList } from '@/features/analysis/hooks/useAnalysisList.ts';
import { type RiskLevel } from '@/features/analysis/api/analysisApi.ts';

import { getRiskVariant, RISK_LABELS_ES, RISK_FILTER_OPTIONS } from '@/features/shared/utils/typeConfig';

import { LoadingScreen } from '@/features/shared/components/LoadingScreen';
import { RetryScreen } from '@/features/shared/components/RetryScreen';
import { Pagination } from '@/features/shared/components/Pagination';
import { SearchInput } from '@/features/shared/components/SearchInput';
import { FilterToggleGroup } from '@/features/shared/components/FilterToggleGroup';
import { ItemCard } from '@/features/shared/components/ItemCard';
import { EmptyState } from '@/features/shared/components/EmptyState';

type RiskFilterType = RiskLevel | 'NONE';

export function AnalysisList() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [page, setPage] = useState<number>(0);
    const [inputValue, setInputValue] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [activeRisk, setActiveRisk] = useState<RiskFilterType>('NONE');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(inputValue);
            setPage(0);
        }, 350);

        return () => clearTimeout(timer);
    }, [inputValue]);

    const { analyses, totalPages, totalElements, loading, error, retry, forceLoading } = useAnalysisList({
        page,
        riskLevel: activeRisk === 'NONE' ? undefined : activeRisk,
        searchTerm: debouncedSearch
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

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050816] text-slate-100 font-sans antialiased select-none">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56">
                <Header userName={user?.fullName ?? "Usuario"} title="Historial de Análisis" />

                <main className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1rem,2vw,3rem)] py-[clamp(1rem,1.8vw,2.5rem)] flex flex-col justify-between">
                    <div className="mx-auto max-w-480 w-full flex-1 flex flex-col gap-[clamp(1.2rem,1.8vw,2rem)] animate-fade-in">

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 w-full border-b border-[#182033]/60 pb-5">
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
                            <div className="w-full flex-1">
                                {analyses.length > 0 ? (
                                    <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-4 auto-rows-max animate-fade-in">
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
                                    <EmptyState label="HISTORIAL VACÍO" />
                                )}
                            </div>
                        )}

                        {!error && (
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                totalElements={totalElements}
                                loading={loading}
                                onPageChange={handlePageChange}
                                onForceLoading={forceLoading}
                            />
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
}