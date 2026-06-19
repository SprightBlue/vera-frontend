import React, { useState, useEffect } from 'react';
import Sidebar from '../presentation/components/Sidebar';
import Header from '../presentation/components/Header';
import { useAuth } from '../presentation/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAlerts } from '../infrastructure/api/alerts-api';

interface Alert {
  id: string;
  title: string;
  description: string;
  riskLevel: string;
  source: string;
  timestamp: string;
}

const AlertsView: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const navigate = useNavigate();



  useEffect(() => {
    getAlerts()
        .then((data) => {
          if (data && data.content) {
              setAlerts(data.content);
          } else if (Array.isArray(data)) {
              setAlerts(data);
          } else {
              setAlerts([]);
          }
        })
        .catch((err) => {
          console.error('Error cargando alertas:', err);
          setAlerts([]);
        });
  }, []);
  
  const getRiskColorClass = (level: string) => {
    switch(level) {
      case 'HIGH': return 'text-red-500';
      case 'MEDIUM': return 'text-yellow-500';
      case 'LOW': return 'text-emerald-500';
      case 'UNDEFINED': return 'text-slate-500';
      default: return 'text-slate-500';
    }
  };

  const getRiskBadgeClass = (level: string) => {
    switch(level) {
      case 'HIGH': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'LOW': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'UNDEFINED': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getRiskLabel = (level: string) => {
    switch(level) {
      case 'HIGH': return 'Alto Riesgo';
      case 'MEDIUM': return 'Riesgo Medio';
      case 'LOW': return 'Bajo Riesgo';
      case 'UNDEFINED': return 'Sin Definir';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050816] text-slate-200 font-sans selection:bg-indigo-500/30">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 ml-[260px]">
        <Header 
          userName={user?.fullName || "Usuario"} 
          title="Historial de Alertas 🚨"
          subtitle="Monitorea y gestiona el registro completo de actividad sospechosa detectada."
        />
        <div className="p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/60 shadow-lg shadow-black/20">
              <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1">Alertas Totales</p>
              <h3 className="text-3xl font-bold text-slate-100">{alerts.length}</h3>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/60 shadow-lg shadow-black/20">
              <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1">Alto Riesgo</p>
              <h3 className="text-3xl font-bold text-red-500">{alerts.filter(a => a.riskLevel === 'HIGH').length}</h3>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/60 shadow-lg shadow-black/20">
              <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1">Riesgo Medio</p>
              <h3 className="text-3xl font-bold text-yellow-500">{alerts.filter(a => a.riskLevel === 'MEDIUM').length}</h3>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/60 shadow-lg shadow-black/20">
              <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1">Bajo Riesgo</p>
              <h3 className="text-3xl font-bold text-emerald-500">{alerts.filter(a => a.riskLevel === 'LOW').length}</h3>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 transition-colors">Todas</button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors">Alto Riesgo</button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors">Riesgo Medio</button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors">Bajo Riesgo</button>
          </div>

          <div className="flex flex-col gap-4">
            {alerts.map(alert => (
              <div key={alert.id} className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/60 shadow-lg shadow-black/20 transition-all hover:border-slate-700 group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center ${getRiskColorClass(alert.riskLevel)} shadow-inner`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">{alert.title}</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskBadgeClass(alert.riskLevel)}`}>
                    {getRiskLabel(alert.riskLevel)}
                  </span>
                </div>
                
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {alert.description}
                </p>
                
                <div className="p-3 rounded-lg bg-[#0B0F19] border border-slate-800/60 text-xs font-medium text-slate-500 mb-5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Fuente detectada: <span className="text-slate-400">{alert.source}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={() => navigate(`/alerts/${alert.id}`)} className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white ...">
                    Ver Detalles
                  </button>
                  <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-950 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                    Marcar Seguro
                  </button>
                </div>
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="p-12 rounded-xl bg-slate-900/50 border border-slate-800/60 text-center flex flex-col items-center">
                <svg className="w-12 h-12 text-emerald-500/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-slate-300">Todo tranquilo</h3>
                <p className="text-sm text-slate-500 mt-1">No se han registrado nuevas alertas en el sistema.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlertsView;