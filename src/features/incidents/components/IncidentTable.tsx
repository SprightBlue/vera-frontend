import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import type { IncidentSummary } from "@/presentation/api/Incident.ts";
import { ACTION_TYPE_LABELS } from "@/presentation/api/Incident.ts";
import { PAGE_SIZE } from "../hooks/useIncidents";
import { fmtDate, fmtTime } from "../utils/incidentConfig";
import { StatusBadge, TypeChip } from "./IncidentBadges";

const ROW = "grid grid-cols-[110px_minmax(0,1fr)_130px_115px_90px] gap-3";

interface Props {
    incidents:     IncidentSummary[];
    selectedId:    string | null;
    loading:       boolean;
    firstName:     string;
    currentPage:   number;
    totalPages:    number;
    totalElements: number;
    onSelect:      (id: string) => void;
    onPageChange:  (page: number) => void;
}

export function IncidentTable({incidents, selectedId, loading, firstName, currentPage, totalPages, totalElements, onSelect, onPageChange,}: Props) {
    return (
        <div className="bg-[#070B1A] border border-[#182033] rounded-2xl overflow-hidden">

            <div className="px-5 py-3.5 border-b border-[#182033]">
                <h2 className="text-base font-semibold text-white">Historial de incidentes</h2>
            </div>

            <div className={`${ROW} px-5 py-2.5 bg-[#070B1A] border-b border-[#182033]`}>
                {["Fecha", `Qué hizo ${firstName}`, "Tipo de incidente", "Estado", "Acciones"].map(h => (
                    <span key={h} className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {h}
                    </span>
                ))}
            </div>

            {loading && (
                <div className="py-14 text-center">
                    <p className="text-sm text-slate-400">Cargando...</p>
                </div>
            )}

            {!loading && incidents.length === 0 && (
                <div className="py-14 text-center">
                    <AlertTriangle size={26} className="text-slate-700 mx-auto mb-2" />
                    <p className="text-base text-slate-500">No hay incidentes registrados.</p>
                </div>
            )}

            {!loading && incidents.map(inc => (
                <div
                    key={inc.id}
                    className={`${ROW} items-center px-5 py-3.5 border-b border-[#182033] last:border-b-0 transition-colors ${
                        selectedId === inc.id ? "bg-blue-500/5" : "hover:bg-[#111827]"
                    }`}
                >
                    <div>
                        <p className="text-sm text-slate-300">{fmtDate(inc.createdAt)}</p>
                        <p className="text-sm text-slate-500">{fmtTime(inc.createdAt)}</p>
                    </div>

                    <p className="min-w-0 truncate text-base text-slate-300" title={ACTION_TYPE_LABELS[inc.actionType]}>
                        {ACTION_TYPE_LABELS[inc.actionType]}
                    </p>

                    <TypeChip actionType={inc.actionType} />

                    <StatusBadge status={inc.status} />

                    <button onClick={() => onSelect(inc.id)} className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer whitespace-nowrap">
                        Ver detalles
                        <ChevronRight size={12} />
                    </button>
                </div>
            ))}

            {totalElements > 0 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-[#182033]">
                    <p className="text-[11px] text-slate-500">
                        Mostrando {currentPage * PAGE_SIZE + 1}–
                        {Math.min((currentPage + 1) * PAGE_SIZE, totalElements)} de {totalElements} incidentes
                    </p>
                    <div className="flex items-center gap-1">
                        <button onClick={() => onPageChange(Math.max(0, currentPage - 1))} disabled={currentPage === 0} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer">
                            <ChevronLeft size={14} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => onPageChange(i)}
                                className={`w-7 h-7 text-xs rounded-lg transition-all cursor-pointer ${
                                    currentPage === i ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage >= totalPages - 1} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer">
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}