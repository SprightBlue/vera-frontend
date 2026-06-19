import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../presentation/context/AuthContext';
import Sidebar from '../../../presentation/components/Sidebar';
import Header from '../../../presentation/components/Header';
import { useAlerts } from '../hooks/useAlerts.ts';
import { Inbox } from "lucide-react";

type FilterType = 'ALL' | 'UNRESOLVED' | 'RESOLVED';

export function AlertsView() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<FilterType>('ALL');

  const { alerts, totalPages, loading, error, loadAlerts } = useAlerts();

  useEffect(() => {
    const isResolved = filter === 'ALL' ? undefined : filter === 'RESOLVED';
    void loadAlerts(page, isResolved);
  }, [page, filter, loadAlerts]);

  return (
      <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-inter">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full ml-65 overflow-hidden">
          <Header
              userName={user?.fullName ?? "Usuario"}
              title="Historial de Alertas"
              subtitle="Monitorea y gestiona el registro completo de actividad."
          />

          <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl w-full">
              <div className="flex gap-2 mb-8">
                {(['ALL', 'UNRESOLVED', 'RESOLVED'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => { setFilter(f); setPage(0); }}
                        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                            filter === f
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                    >
                      {f === 'ALL' ? 'Todas' : f === 'UNRESOLVED' ? 'Pendientes' : 'Resueltas'}
                    </button>
                ))}
              </div>

              {error && (
                  <div className="p-4 mb-6 rounded-lg bg-red-950/30 border border-red-900 text-red-400 text-sm">
                    {error}
                  </div>
              )}

              <div className="flex flex-col gap-4 min-h-100">
                {loading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map((i) => (
                          <div key={i} className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 flex justify-between items-center">
                            <div className="space-y-3"><div className="h-4 w-48 bg-slate-800 rounded" /><div className="h-3 w-32 bg-slate-800/60 rounded" /></div>
                            <div className="h-8 w-24 bg-slate-800 rounded" />
                          </div>
                      ))}
                    </div>
                ) : alerts.length > 0 ? alerts.map((alert) => (
                    <div key={alert.id} className="group p-6 rounded-2xl bg-slate-900/20 border border-slate-900 flex items-center justify-between hover:border-slate-700 transition-all">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-slate-100">{alert.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${alert.isResolved ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"}`}>
                        {alert.isResolved ? "Resuelta" : "Pendiente"}
                      </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">Usuario: {alert.protectedFullName ?? "N/A"} • {new Date(alert.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button
                          onClick={() => navigate(`/alerts/${alert.id}`)}
                          className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500 rounded-lg text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                      >
                        Ver Detalles
                      </button>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center pt-20 gap-4 text-center">
                      <div className="p-4 rounded-full bg-slate-900 border border-slate-800">
                        <Inbox size={40} className="text-slate-600" />
                      </div>
                      <div>
                        <h3 className="text-slate-200 font-semibold text-lg">No hay alertas registradas</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
                          Actualmente no tienes alertas que coincidan con los criterios seleccionados.
                        </p>
                      </div>
                    </div>
                )}
              </div>

              {totalPages > 0 && (
                  <div className="flex justify-between mt-8 pt-6 border-t border-slate-900">
                    <span className="text-xs text-slate-500 font-mono">Página {page + 1} de {totalPages}</span>
                    <div className="flex gap-2">
                      <button
                          disabled={page <= 0}
                          onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                          className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs hover:bg-slate-800 disabled:opacity-30 cursor-pointer transition-all"
                      >Anterior</button>
                      <button
                          disabled={page >= totalPages - 1}
                          onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
                          className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs hover:bg-slate-800 disabled:opacity-30 cursor-pointer transition-all"
                      >Siguiente</button>
                    </div>
                  </div>
              )}
            </div>
          </main>
        </div>
      </div>
  );
}