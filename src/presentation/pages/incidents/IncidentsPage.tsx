import Sidebar from "../../../features/shared/components/Sidebar.tsx";
import Header from "../../../features/shared/components/Header.tsx";
import { useAuth } from "../../context/AuthContext";
import { useIncidents } from "../../../features/incidents/hooks/useIncidents";
import { IncidentTable } from "../../../features/incidents/components/IncidentTable";
import { IncidentDetailPanel } from "../../../features/incidents/components/IncidentDetailPanel";
import { IncidentInfoPanel } from "../../../features/incidents/components/IncidentInfoPanel";
import {PersonAvatar} from "@/features/shared/components/PersonAvatar.tsx";

export default function IncidentsPage() {
    const { user } = useAuth();
    const {
        persons, selectedPersonId, selectedPerson, selectPerson,
        incidents, totalElements, totalPages, currentPage, loadingList, goToPage,
        selectedId, detail, loadingDetail, selectIncident, closeDetail,
    } = useIncidents();

    const firstName = selectedPerson?.fullName?.split(" ")[0] ?? "";
    const showDetail = !!selectedId;

    return (
        <div className="flex min-h-screen bg-[#050816]">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 ml-[79.2px] lg:ml-[224px]">
                <Header
                    userName={user?.fullName ?? "Usuario"}
                    userRole={user?.role === 'PROTECTED' ? "Protegido/a" : "Cuidador/a"}
                    title="Incidentes"
                    subtitle={user?.role === 'PROTECTED'
                        ? "Historial de situaciones sospechosas y guías de acción"
                        : "Monitorea y acompañá a tus personas protegidas ante situaciones sospechosas"}
                />

                <div className="p-6">

                    {/* ACÁ ESTÁ EL CAMBIO: Solo el CARER ve el filtro */}
                    {user?.role === 'CARER' && (
                        <div className="mb-5">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                                Filtrar por protegido
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {persons.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => selectPerson(p.id)}
                                        className={`flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                                            selectedPersonId === p.id
                                                ? "bg-blue-600/10 border-blue-500/30 text-white"
                                                : "bg-[#0d1222] border-[#182033] text-slate-400 hover:text-white hover:border-[#2a3550]"
                                        }`}
                                    >
                                        <PersonAvatar fullName={p.fullName} image={p.image} size="xs" />
                                        {p.fullName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Grid principal */}
                    <div
                        className={`grid gap-5 items-start ${
                            showDetail
                                ? "grid-cols-1 min-[1582px]:grid-cols-2 min-[1900px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_220px]"
                                : "grid-cols-1"
                        }`}>
                        <div className={showDetail ? "hidden min-[1582px]:block" : ""}>
                            <IncidentTable
                                incidents={incidents}
                                selectedId={selectedId}
                                loading={loadingList}
                                firstName={firstName}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalElements={totalElements}
                                onSelect={selectIncident}
                                onPageChange={goToPage}
                            />
                        </div>

                        {showDetail && (
                            <IncidentDetailPanel
                                detail={detail}
                                loading={loadingDetail}
                                firstName={firstName}
                                onClose={closeDetail}
                            />
                        )}

                        {showDetail && (
                            <div className="block min-[1582px]:hidden min-[1900px]:block">
                                <IncidentInfoPanel />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}