import { ArrowLeft, Heart, Settings, Activity, ShieldCheck, Phone, Mail } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProtectedPersons } from "../../../infrastructure/api/protected-person-api";
import { LocationCard } from "../../../features/location/component/LocationCard.tsx";

interface ProtectedPerson {
    id: number; // Este ID representa el trustContactId (vínculo relacional)
    fullName: string;
    email: string;
    contactNumber: string;
    relationship: string;
    status: string;
    sensitivityLevel: string;
    notifyHighRisk: boolean;
    photo?: string;
}

function PersonDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const [person, setPerson] = useState<ProtectedPerson | null>(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchPerson = async () => {
            try {
                const data = await getProtectedPersons();
                const foundPerson = data.find((p: { id: number }) => p.id === Number(id));
                setPerson((foundPerson as unknown as ProtectedPerson) || null);
            }
            catch (error) {
                console.error("Error al cargar la persona:", error);
            }
            finally {
                setCargando(false);
            }
        };

        fetchPerson();
    }, [id]);

    return (
        <div className="flex min-h-screen bg-[#050816]">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 ml-65">
                <Header
                    userName={user?.fullName || "Usuario"}
                    title="Personas que cuido"
                    subtitle="Observa los detalles de cada persona a la que protejes"
                />
                <div className="w-full max-w-7xl p-8">
                    {cargando ? (
                        <p className="bg-slate-900/50 border border-slate-800/60 px-8 py-6 rounded-2xl text-gray-400 text-lg">Cargando perfil...</p>
                    ) : (
                        <div>
                            {/* Cabecera con botón volver */}
                            <div className="flex items-center gap-3 mb-6">
                                <button
                                    onClick={() => navigate('/persons')}
                                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-semibold text-white">Detalles de {person?.fullName}</h1>
                                </div>
                            </div>

                            {/* Tarjeta Principal: Perfil */}
                            <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-8 mb-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Foto */}
                                        <div className="py-2">
                                            <img
                                                src={person?.photo || `https://ui-avatars.com/api/?name=${person?.fullName}&background=0D8ABC&color=fff`}
                                                alt={person?.fullName}
                                                className="w-28 h-28 rounded-full object-cover border-4 border-[#182033]"
                                            />
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

                                            {/* Contacto Real */}
                                            <div className="flex flex-col gap-2 mt-4">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Mail size={16} />
                                                    <span>{person?.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Phone size={16} />
                                                    <span>{person?.contactNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botón de Configuración */}
                                    <button
                                        onClick={() => navigate('/persons/personConfig', { state: { personId: person?.id } })}
                                        className="flex items-center gap-3 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold cursor-pointer h-fit"
                                    >
                                        <Settings className="w-5 h-5" />
                                        Ajustar configuración
                                    </button>
                                </div>
                            </div>

                            {/* Tarjetas de Estado */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                                {/* 💡 MAPA COMPLETO INTEGRADO: Toma todo el ancho de la grilla */}
                                {person && (
                                    <LocationCard
                                        trustContactId={person.id}
                                        personName={person.fullName}
                                    />
                                )}

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
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    person?.sensitivityLevel === 'BAJO' ? 'w-1/3 bg-emerald-500' :
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

                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default PersonDetail;