import { ChevronRight } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Header  from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { useIncidents } from "../../../features/incidents/hooks/useIncidents";
import { IncidentTable }       from "../../../features/incidents/components/IncidentTable";
import { IncidentDetailPanel } from "../../../features/incidents/components/IncidentDetailPanel";
import { IncidentInfoPanel }   from "../../../features/incidents/components/IncidentInfoPanel";

export default function IncidentsPage() {
    const { user } = useAuth();
    const {
        persons, selectedPersonId, selectedPerson, selectPerson,
        incidents, totalElements, totalPages, currentPage, loadingList, goToPage,
        selectedId, detail, loadingDetail, selectIncident, closeDetail,
    } = useIncidents();

    const firstName  = selectedPerson?.fullName?.split(" ")[0] ?? "";
    const showDetail = !!selectedId;

    return (
        <div className="flex min-h-screen bg-[#050816]">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 ml-[260px]">
                <Header
                    userName={user?.fullName ?? "Usuario"}
                    userRole="Cuidador/a"
                    title="Incidentes"
                    subtitle="Monitorea y acompañá a tus personas protegidas ante situaciones sospechosas"
                />

                <div className="p-6">

                    {/* Filtro de persona */}
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
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.fullName)}&background=1d4ed8&color=fff&size=28`}
                                        alt={p.fullName}
                                        className="w-7 h-7 rounded-full"
                                    />
                                    {p.fullName}
                                    <ChevronRight size={13} className="text-slate-500" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid principal */}
                    <div
                        className={`grid gap-5 items-start ${
                            showDetail
                                ? "grid-cols-1 lg:grid-cols-2 2xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_220px]"
                                : "grid-cols-1"
                        }`}>
                        <div className={showDetail ? "hidden lg:block" : ""}>
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
                            <IncidentInfoPanel />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}