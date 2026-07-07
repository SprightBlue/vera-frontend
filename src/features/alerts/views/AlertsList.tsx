import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/presentation/context/AuthContext.tsx';
import Sidebar from '@/presentation/components/Sidebar';
import Header from '@/presentation/components/Header';
import { useAlertsList } from '@/features/alerts/hooks/useAlertsList';
import { type RiskLevel } from '@/features/alerts/api/alertsApi.ts';
import { getRiskConfig } from '@/features/analysis/utils/riskConfig';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Search,
  ArrowRight
} from "lucide-react";

type RiskFilterType = RiskLevel | 'NONE';
type StatusFilterType = 'PENDING' | 'RESOLVED' | 'NONE';

function AlertsList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');

  const [activeRisk, setActiveRisk] = useState<RiskFilterType>('NONE');
  const [activeStatus, setActiveStatus] = useState<StatusFilterType>('NONE');

  const { alerts, totalPages, totalElements, loading, error, retry, forceLoading } = useAlertsList({
    page,
    resolved: activeStatus === 'NONE' ? undefined : activeStatus === 'RESOLVED',
    riskLevel: activeRisk === 'NONE' ? undefined : activeRisk,
    searchTerm: inputValue
  });

  const handleRiskToggle = (risk: RiskLevel) => {
    forceLoading();
    setActiveRisk(prev => prev === risk ? 'NONE' : risk);
    setPage(0);
  };

  const handleStatusToggle = (status: 'PENDING' | 'RESOLVED') => {
    forceLoading();
    setActiveStatus(prev => prev === status ? 'NONE' : status);
    setPage(0);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setPage(0);
  };

  const handleSearchSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
      <div className="flex h-screen w-screen overflow-hidden bg-[#050816] text-slate-100 font-sans antialiased select-none">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56">
          <Header
              userName={user?.fullName ?? "Usuario"}
              title="Historial de Alertas"
          />

          <main className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1rem,2vw,3rem)] py-[clamp(1rem,1.8vw,2.5rem)] flex flex-col justify-between">
            <div className="mx-auto max-w-480 w-full flex-1 flex flex-col gap-[clamp(1.2rem,1.8vw,2rem)] animate-fade-in">

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 w-full border-b border-[#182033]/60 pb-5">

                <form
                    onSubmit={handleSearchSubmit}
                    className="flex flex-col gap-2 md:w-1/2 w-full"
                >
                  <span className="text-[clamp(9px,0.55vw,11px)] font-bold tracking-widest text-slate-500 uppercase">Motor de Búsqueda</span>
                  <div className="relative flex items-center w-full group">
                    <Search size={13} className="absolute left-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Buscar por Titulo o Contenido..."
                        className="h-10 w-full bg-[#0a0f24]/50 border border-[#182033] rounded-xl pl-10 pr-4 text-[clamp(9px,0.55vw,11px)] font-semibold tracking-widest text-slate-200 placeholder-slate-600 outline-hidden hover:border-slate-700 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all uppercase"
                    />
                  </div>
                </form>

                <div className="flex flex-wrap items-center gap-[clamp(1rem,1.5vw,2rem)]">

                  <div className="flex flex-col gap-2">
                    <span className="text-[clamp(9px,0.55vw,11px)] font-bold tracking-widest text-slate-500 uppercase">Estado De Alerta</span>
                    <div className="flex items-center gap-2">
                      <button
                          onClick={() => handleStatusToggle('PENDING')}
                          className={`px-4 py-2 rounded-xl border text-[clamp(10px,0.65vw,12px)] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                              activeStatus === 'PENDING'
                                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-md shadow-amber-500/3'
                                  : 'bg-[#0a0f24]/40 border-[#182033] text-slate-400 hover:text-slate-200 hover:bg-[#131b35]/20'
                          }`}
                      >
                        Pendientes
                      </button>

                      <button
                          onClick={() => handleStatusToggle('RESOLVED')}
                          className={`px-4 py-2 rounded-xl border text-[clamp(10px,0.65vw,12px)] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                              activeStatus === 'RESOLVED'
                                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-500/3'
                                  : 'bg-[#0a0f24]/40 border-[#182033] text-slate-400 hover:text-slate-200 hover:bg-[#131b35]/20'
                          }`}
                      >
                        Resueltas
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[clamp(9px,0.55vw,11px)] font-bold tracking-widest text-slate-500 uppercase">Nivel de Riesgo</span>
                    <div className="flex items-center gap-2">
                      <button
                          onClick={() => handleRiskToggle('LOW')}
                          className={`px-4 py-2 rounded-xl border text-[clamp(10px,0.65vw,12px)] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                              activeRisk === 'LOW'
                                  ? 'bg-green-500/10 border-green-500/40 text-green-400 shadow-md shadow-green-500/3'
                                  : 'bg-[#0a0f24]/40 border-[#182033] text-slate-400 hover:text-slate-200 hover:bg-[#131b35]/20'
                          }`}
                      >
                        Bajo
                      </button>

                      <button
                          onClick={() => handleRiskToggle('MEDIUM')}
                          className={`px-4 py-2 rounded-xl border text-[clamp(10px,0.65vw,12px)] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                              activeRisk === 'MEDIUM'
                                  ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400 shadow-md shadow-yellow-500/3'
                                  : 'bg-[#0a0f24]/40 border-[#182033] text-slate-400 hover:text-slate-200 hover:bg-[#131b35]/20'
                          }`}
                      >
                        Medio
                      </button>

                      <button
                          onClick={() => handleRiskToggle('HIGH')}
                          className={`px-4 py-2 rounded-xl border text-[clamp(10px,0.65vw,12px)] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                              activeRisk === 'HIGH'
                                  ? 'bg-red-500/10 border-red-500/40 text-red-400 shadow-md shadow-red-500/3'
                                  : 'bg-[#0a0f24]/40 border-[#182033] text-slate-400 hover:text-slate-200 hover:bg-[#131b35]/20'
                          }`}
                      >
                        Alto
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {loading ? (
                  <div className="w-full flex-1 flex flex-col items-center justify-center py-36 select-none animate-fade-in">
                    <Loader2 size={22} className="text-blue-500 animate-spin stroke-[1.5] mb-2" />
                    <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase animate-pulse">
                      Cargando
                    </span>
                  </div>
              ) : error ? (
                  <div className="w-full flex-1 flex items-center justify-center py-24 select-none animate-fade-in">
                    <button
                        onClick={retry}
                        className="flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-slate-200 tracking-widest uppercase transition-colors cursor-pointer group"
                    >
                      <RefreshCw size={12} className="stroke-[2.5] text-slate-500 group-hover:text-slate-200 transition-colors" />
                      <span>Reintentar</span>
                    </button>
                  </div>
              ) : (
                  <div className="w-full flex-1">
                    {alerts.length > 0 ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-4 auto-rows-max animate-fade-in">
                          {alerts.map((alert) => {
                            const level: RiskLevel = alert.riskLevel || 'LOW';
                            const config = getRiskConfig(level); // Consumiendo Helper Unificado

                            const permanentBorderColor =
                                level === 'HIGH' ? 'border-red-500/40' :
                                    level === 'MEDIUM' ? 'border-yellow-500/40' :
                                        'border-green-500/40';

                            return (
                                <div
                                    key={alert.id}
                                    className={`group rounded-2xl border-y border-r border-l-4 bg-linear-to-b from-[#0a0f24] to-[#070B1A] ${permanentBorderColor} ${config.borderLeft} p-[clamp(0.9rem,1.3vw,1.5rem)] shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-stretch justify-between gap-5 transition-all duration-300`}
                                >
                                  <div className={`absolute top-0 right-0 w-[clamp(140px,14vw,260px)] h-[clamp(140px,14vw,260px)] rounded-full filter blur-[70px] opacity-10 pointer-events-none ${config.glowColor}`} />

                                  <div className="flex flex-col justify-between min-w-0 flex-1 relative z-10 gap-2">
                                    <span className="text-[clamp(0.75rem,0.8vw,0.86rem)] font-medium text-slate-400 leading-relaxed tracking-normal select-text">
                                      {alert.protectedFullName ?? "Sistema Central"}
                                    </span>

                                    <h3 className="text-[clamp(0.95rem,1.1vw,1.2rem)] font-bold tracking-tight text-white truncate max-w-70 sm:max-w-xs md:max-w-md select-text">
                                      {alert.title}
                                    </h3>

                                    <p className="text-[clamp(0.75rem,0.8vw,0.86rem)] text-slate-400 leading-relaxed line-clamp-2 pr-2 select-text font-medium">
                                      {alert.contentSummary || 'Sin sumario descriptivo de anomalías anexado al registro.'}
                                    </p>
                                  </div>

                                  <div className="flex flex-col items-start sm:items-end justify-between gap-3 shrink-0 w-full sm:w-auto border-t sm:border-t-0 border-[#182033]/40 pt-3 sm:pt-0 relative z-10">
                                    <span className="text-[clamp(0.72rem,0.76vw,0.82rem)] font-medium text-slate-500 leading-relaxed tracking-normal sm:text-right select-text mt-1 sm:mt-0">
                                      {alert.createdAt}
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border shrink-0 ${config.bgColor} ${config.borderColor} ${config.textColor}`}>
                                        Riesgo {config.label}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border shrink-0 ${
                                          alert.isResolved
                                              ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                                              : "bg-amber-500/5 text-amber-400 border-amber-500/20"
                                      }`}>
                                        {alert.isResolved ? "Resuelta" : "Pendiente"}
                                      </span>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/alerts/${alert.id}`)}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl border border-[#182033] bg-[#0a0f24]/60 text-[#94a3b8] hover:text-white text-[10px] font-bold uppercase tracking-widest cursor-pointer group/btn transition-all duration-150 active:scale-[0.98]"
                                    >
                                      <span>Ver Detalles</span>
                                      <ArrowRight size={12} className="transform group-hover/btn:translate-x-0.5 transition-transform text-slate-400 group-hover/btn:text-white" />
                                    </button>
                                  </div>
                                </div>
                            );
                          })}
                        </div>
                    ) : (
                        <div className="w-full flex-1 flex items-center justify-center py-36 select-none animate-fade-in">
                          <span className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">
                            No hay alertas disponibles
                          </span>
                        </div>
                    )}
                  </div>
              )}

              {!error && (
                  <div className="flex items-center justify-between mt-auto pt-5 border-t border-[#182033]/40 select-none w-full">
                    <span className="text-[clamp(9px,0.6vw,11px)] text-slate-500 font-bold tracking-wider uppercase">
                      Página {page + 1} de {Math.max(1, totalPages)} • Registros: {totalElements}
                    </span>

                    <div className="flex gap-2">
                      <button
                          disabled={page <= 0 || loading}
                          onClick={() => { forceLoading(); setPage((prev) => Math.max(0, prev - 1)); }}
                          className="p-2 bg-[#0a0f24] hover:bg-[#131b35]/60 border border-[#182033] rounded-xl disabled:opacity-10 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        <ChevronLeft size={14} className="text-slate-400" />
                      </button>
                      <button
                          disabled={page >= totalPages - 1 || totalPages <= 1 || loading}
                          onClick={() => { forceLoading(); setPage((prev) => Math.min(totalPages - 1, prev + 1)); }}
                          className="p-2 bg-[#0a0f24] hover:bg-[#131b35]/60 border border-[#182033] rounded-xl disabled:opacity-10 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        <ChevronRight size={14} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
              )}

            </div>
          </main>
        </div>
      </div>
  );
}

export default AlertsList;