import { useState } from "react";
import { CheckCircle2, Phone, ChevronDown, ChevronUp, Shield, ChevronLeft } from "lucide-react";
import type { IncidentDetail } from "../../../domain/models/Incident";
import { ACTION_TYPE_LABELS, SHARED_DATA_TYPE_LABELS } from "../../../domain/models/Incident";
import { BANK_STEP_KEYS, BANK_CATALOG, fmtDateTime, fmtTime } from "../utils/incidentConfig";
import { StatusBadge } from "./IncidentBadges";

interface Props {
    detail:    IncidentDetail | null;
    loading:   boolean;
    firstName: string;
    onClose:   () => void;
}

function BankCatalogPanel() {
    const [open, setOpen] = useState(false);

    return (
        <div className="mt-2 ml-6">
            <button onClick={() => setOpen(v => !v)} className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">
                <Phone size={11} />
                Ver números de bancos
                {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>

            {open && (
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                    {BANK_CATALOG.map(b => (
                        <a
                            key={b.name}
                            href={`tel:${b.phone.replace(/-/g, "")}`}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15 hover:bg-emerald-500/15 transition-colors text-[11px] text-emerald-300"
                        >
                            <Phone size={10} className="shrink-0" />
                            <span className="font-medium truncate">{b.name}</span>
                            <span className="text-emerald-500 ml-auto shrink-0">{b.phone}</span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

export function IncidentDetailPanel({ detail, loading, firstName, onClose }: Props) {

    const allSteps = detail
        ? [...detail.prioritySteps, ...detail.recommendedSteps]
            .sort((a, b) => a.stepOrder - b.stepOrder)
        : [];

    return (
        <div className="bg-[#070B1A] border border-[#182033] rounded-2xl overflow-hidden">

            {/* Nav */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#182033]">
                <button
                    onClick={onClose}
                    className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                    <ChevronLeft size={13} />
                    Volver a incidentes
                </button>
                {detail && (
                    <span className="text-[11px] text-slate-500">{fmtDateTime(detail.createdAt)}</span>
                )}
            </div>

            {loading && (
                <div className="py-16 text-center text-sm text-slate-400">Cargando...</div>
            )}

            {!loading && !detail && (
                <div className="py-16 text-center text-sm text-slate-500">No se pudo cargar el detalle.</div>
            )}

            {!loading && detail && (
                <div className="p-5">

                    {/* Título */}
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Detalle del incidente
                    </p>
                    <StatusBadge status={detail.status} />
                    <h2 className="text-lg font-semibold text-white mt-3 mb-3 leading-snug">
                        {ACTION_TYPE_LABELS[detail.actionType] ?? detail.actionType}
                    </h2>

                    {/* Datos comprometidos */}
                    {detail.sharedDataTypes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {detail.sharedDataTypes.map(dt => (
                                <span
                                    key={dt}
                                    className="text-xs px-2.5 py-1 rounded-full bg-[#111827] border border-[#2a3550] text-slate-300"
                                >
                                    {SHARED_DATA_TYPE_LABELS[dt] ?? dt}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Descripción */}
                    {detail.description && (
                        <div className="mb-4 p-3 rounded-xl bg-[#111827] border border-[#182033]">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Descripción
                            </p>
                            <p className="text-base text-slate-300 leading-relaxed">{detail.description}</p>
                        </div>
                    )}

                    {/* Steps */}
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 mt-4">
                        Acciones tomadas por {firstName}
                    </p>

                    <div className="flex flex-col">
                        {allSteps.map((step, idx) => (
                            <div
                                key={step.id ?? idx}
                                className={`py-3 border-b border-[#182033] last:border-b-0 ${!step.completed ? "opacity-55" : ""}`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                        {step.completed
                                            ? <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                                            : <div className="w-4 h-4 rounded-full border-2 border-slate-600 mt-0.5 shrink-0" />
                                        }
                                        <div className="min-w-0">
                                            <p className={`text-sm font-medium leading-snug ${step.completed ? "text-slate-200" : "text-slate-400"}`}>
                                                {step.title}
                                            </p>
                                            {step.completed && (
                                                <p className="text-sm text-slate-500 mt-0.5 leading-snug">
                                                    {step.description.length > 80
                                                        ? step.description.slice(0, 80) + "…"
                                                        : step.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[11px] shrink-0 mt-0.5 whitespace-nowrap">
                                        {step.completed && step.completedAt
                                            ? <span className="text-slate-400">{fmtTime(step.completedAt)}</span>
                                            : <span className="text-slate-600">Pendiente</span>
                                        }
                                    </span>
                                </div>

                                {/* Panel de bancos — solo en steps bancarios */}
                                {BANK_STEP_KEYS.has(step.stepKey) && (
                                    <BankCatalogPanel />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pie */}
                    <div className="mt-5 flex items-center gap-2.5 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
                        <Shield size={14} className="text-blue-400 shrink-0" />
                        <p className="text-sm text-slate-400 leading-relaxed">
                            VERA te guía paso a paso para que {firstName} recupere el control.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}