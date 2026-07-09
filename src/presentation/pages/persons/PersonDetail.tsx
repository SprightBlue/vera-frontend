import { ArrowLeft, Heart, Link, Clock3, Settings, Activity, ShieldCheck, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import { useAuth } from "../../context/AuthContext";
import type { ProtectedPerson, UpdateProtectedInfo } from "../../../domain/models/ProtectedPerson.ts";
import { getProtectedPersonById, updateProtectedPersonInfo } from "../../../infrastructure/api/protected-person-api";
import EditPersonModal from "../../components/persons/EditPersonModal";
import { LocationCard } from "../../../features/location/component/LocationCard.tsx";
import toast from "react-hot-toast";
import {PersonAvatar} from "@/presentation/components/common/PersonAvatar.tsx";

function PersonDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const [person, setPerson] = useState<ProtectedPerson | null>(null);
    const [cargando, setCargando] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status") ?? "ACTIVE";

    // Se obtienen los datos del usuario protejido
    useEffect(() => {
        const fetchPerson = async () => {
            try {
                const personId = Number(id);
                if (!id || isNaN(personId)) return;
                const protectedPerson = await getProtectedPersonById(personId, status);
                setPerson(protectedPerson);
                console.log(protectedPerson)
            }
            catch {
                toast.error("No se pudo cargar la información de la persona");
            }
            finally {
                setCargando(false);
            }
        };
        fetchPerson();
    }, [id]);

    // Se actualizan los datos del protejido al enviar el formulario
    const handleEditPerson = async (id:number, updatedPerson: UpdateProtectedInfo) => {
        const protectedPerson = await updateProtectedPersonInfo(id, updatedPerson);
        setPerson(protectedPerson);
    };

    return (
        <div className="flex min-h-screen bg-[#050816]">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 ml-[79.2px] lg:ml-[224px]">
                <Header
                    userName={user?.fullName || "Usuario"}
                    title="Personas que cuido"
                    subtitle="Observa los detalles de cada persona a la que protejes"
                />
                <div className="w-full max-w-6xl mx-auto p-8">
                    {/* Cabecera con botón volver */}
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => navigate('/persons')}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-semibold text-white">Detalles de perfil</h1>
                        </div>
                    </div>
                    {/* Pantalla de carga */}
                    {cargando ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 py-8 flex justify-between items-center">
                                    <div className="animate-pulse space-y-4">
                                        <div className="h-4 w-48 bg-slate-800 rounded" />
                                        <div className="h-3 w-32 bg-slate-800/60 rounded" />
                                    </div>
                                    <div className="h-8 w-24 bg-slate-800 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            {/* Tarjeta Principal: Perfil */}
                            <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-8 mb-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Foto */}
                                        <div className="py-2">
                                            <PersonAvatar fullName={person?.fullName ?? ""} image={person?.image} size="lg" />
                                        </div>

                                        {/* Info Básica */}
                                        <div>
                                            <div className="flex items-center gap-3 flex-wrap mb-2">
                                                <h2 className="text-xl font-bold">{person?.fullName}</h2>
                                                <div className="flex items-center gap-2 bg-[#182033] px-4 py-2 rounded-full text-gray-300">
                                                    <Heart className="w-4 h-4" />
                                                    <span>{person?.relationship}</span>
                                                </div>
                                                {person?.status === 'PENDING' && (
                                                    <span className="bg-yellow-500/20 text-yellow-500 text-sm px-4 py-1 rounded-full border border-yellow-500/30">
                                                        Invitación Pendiente
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-5 mt-3">
                                                <div className="flex items-center gap-2 text-gray-300 text-md">
                                                    <Mail className="w-4 h-4 text-blue-400" />
                                                    {person?.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-300 text-md">
                                                    <Phone className="w-4 h-4 text-blue-400" />
                                                    {person?.contactNumber}
                                                </div>
                                            </div>

                                            <p className="text-gray-400 mt-4 max-w-xl leading-relaxed">
                                                Información personal y configuración asociada a este perfil.
                                            </p>

                                            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                                <div className="flex items-center gap-3 bg-[#111827] border border-[#182033] px-4 py-3 rounded-2xl">
                                                    <Link className="w-4 h-4 text-blue-400" />

                                                    <span className="text-gray-300 text-sm">
                                                        Conectado desde Ago 2023
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 bg-[#111827] border border-[#182033] px-4 py-3 rounded-2xl">
                                                    <Clock3 className="w-4 h-4 text-blue-400" />

                                                    <span className="text-gray-300 text-sm">
                                                        Última actividad: Sin actividad reciente
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="flex flex-row">
                                        <button
                                            id="add-protected-btn"
                                            onClick={() => setShowModal(true)}
                                            className="px-5 py-3 mr-5 rounded-2xl bg-white/14 border border-white/20 backdrop-blur-sm text-white font-medium cursor-pointer hover:bg-white/20 hover:border-white/30 transition-all duration-300 active:scale-95 whitespace-nowrap"
                                        >
                                            Editar perfil
                                        </button>
                                        <button onClick={() => navigate('/persons/personConfig', { state: { personId: person?.id } })} className="flex items-center gap-3 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold cursor-pointer">
                                            <Settings className="w-5 h-5" />
                                            Ajustes
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tarjetas de Estado */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                                {/* Tarjeta: Sensibilidad Actual */}
                                <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-[#182033] p-3 rounded-full">
                                            <Activity size={20} className="text-blue-400" />
                                        </div>
                                        <h3 className="font-semibold text-xl">Sensibilidad configurada</h3>
                                    </div>

                                    <div className="flex justify-center mb-6">
                                        <h2 className="text-3xl font-bold px-5 text-center text-white capitalize">
                                            {person?.sensitivityLevel?.toLowerCase() || 'No definida'}
                                        </h2>
                                    </div>

                                    <div className="mt-8">
                                        <div className="w-full h-3 bg-[#182033] rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${person?.sensitivityLevel === 'BAJO' ? 'w-1/3 bg-emerald-500' :
                                                        person?.sensitivityLevel === 'MEDIO' ? 'w-1/2 bg-blue-500' :
                                                            person?.sensitivityLevel === 'ALTO' ? 'w-full bg-red-500' : 'w-0'
                                                    }`}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-2 text-gray-500 text-sm">
                                            <span>Bajo</span>
                                            <span>Medio</span>
                                            <span>Alto</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tarjeta: Alertas Urgentes Actuales */}
                                <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-8 md:col-span-2 lg:col-span-1">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-[#182033] p-3 rounded-full">
                                            <ShieldCheck size={20} className={person?.notifyHighRisk ? "text-emerald-400" : "text-gray-500"} />
                                        </div>
                                        <h3 className="font-semibold text-xl">Alertas Urgentes</h3>
                                    </div>

                                    <div className="flex flex-col items-center justify-center h-32">
                                        <h2 className={`text-2xl font-bold mb-2 ${person?.notifyHighRisk ? 'text-emerald-400' : 'text-gray-500'}`}>
                                            {person?.notifyHighRisk ? 'Monitoreo Activo' : 'Monitoreo Pausado'}
                                        </h2>
                                        <p className="text-gray-400 text-center text-sm">
                                            {person?.notifyHighRisk
                                                ? 'Las notificaciones inmediatas ante riesgos altos están habilitadas.'
                                                : 'No recibirás notificaciones inmediatas si se detecta un riesgo alto.'}
                                        </p>
                                    </div>
                                </div>
                                {/* 💡 MAPA COMPLETO INTEGRADO: Toma todo el ancho de la grilla */}
                                {person && (
                                    <LocationCard
                                        trustContactId={person.id}
                                        personName={person.fullName}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {showModal && person && (
                    <EditPersonModal
                        person={person}
                        onClose={() => setShowModal(false)}
                        onSuccess={() => setShowModal(false)}
                        onSubmit={handleEditPerson}
                    />
                )}
            </main>
        </div>
    );
}

export default PersonDetail;