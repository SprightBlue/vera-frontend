import { ArrowLeft, Heart, Link, Clock3, Settings, Activity, ShieldCheck, MapPin, Smartphone, Wifi, MessageCircle, Phone, Mail, MessageSquare, Image, Bell, Info, BatteryCharging, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import { useAuth } from "../../context/AuthContext";
import { getProtectedPersonById, updateProtectedPersonInfo, type ProtectedPerson, type UpdateProtectedInfo } from "../../../infrastructure/api/protected-person-api";
import EditPersonModal from "../../components/persons/EditPersonModal";

function PersonDetail() {

    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const [person, setPerson] = useState<ProtectedPerson | null>(null);
    const [cargando, setCargando] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Se obtienen los datos del usuario protejido
    useEffect(() => {
        const fetchPerson = async () => {
            try {
                const personId = Number(id);
                if (!id || isNaN(personId)) return;
                const protectedPerson = await getProtectedPersonById(personId);
                setPerson(protectedPerson);
                console.log(protectedPerson)
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

    // Se actualizan los datos del protejido al enviar el formulario
    const handleEditPerson = async (id:number, updatedPerson: UpdateProtectedInfo) => {
        const protectedPerson = await updateProtectedPersonInfo(id, updatedPerson);
        setPerson(protectedPerson);
    };

    return (
        <div className="flex min-h-screen bg-[#050816]">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 ml-[260px]">
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

                            {/* Perfil */}
                            <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-8 mb-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                                    {/* Izquierda */}
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="py-2">
                                            {person?.image ? (
                                                <img
                                                src={person.image}
                                                alt="Perfil"
                                                className="w-28 h-28 rounded-full object-cover border-4 border-[#182033] bg-blue-600 flex items-center justify-center text-3xl font-bold text-white"
                                                />
                                            ) : (
                                                <div className="w-28 h-28 rounded-full object-cover border-4 border-[#182033] bg-blue-600 flex items-center justify-center text-3xl font-bold text-white">
                                                    {person?.fullName?.charAt(0) || "U"}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h2 className="text-xl font-bold">
                                                    {person?.fullName}
                                                </h2>

                                                <div className="flex items-center gap-2 bg-[#182033] px-4 py-2 rounded-full text-gray-300">
                                                    <Heart className="w-4 h-4" />
                                                    <span>{person?.relationship}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-5 mt-3">
                                                <div className="flex items-center gap-2 text-gray-300 text-md">
                                                    <Mail className="w-4 h-4 text-blue-400" />
                                                    {person.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-300 text-md">
                                                    <Phone className="w-4 h-4 text-blue-400" />
                                                    {person.contactNumber}
                                                </div>
                                            </div>

                                            <p className="text-gray-400 mt-4 max-w-xl leading-relaxed">
                                                Conexión establecida de forma segura. Todos los sistemas están funcionando correctamente.
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

                            {/* Cards */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                {/* Sensibilidad */}
                                <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-8">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="bg-[#182033] p-3 rounded-full">
                                            <Activity size={20} />
                                        </div>

                                        <h3 className="font-semibold text-xl">Sensibilidad</h3>
                                    </div>

                                    <div className="mt-12">
                                        <div className="flex flex-wrap justify-center ">
                                            <h2 className="text-4xl font-bold px-5 text-center">
                                                {person?.status === 'PENDING' ? 'Invitación Pendiente' : 'Protección Activa'}
                                            </h2>

                                            <p className="text-gray-400 leading-relaxed mb-5 mt-4">
                                                Monitoreo equilibrado
                                            </p>
                                        </div>

                                        <div className="mt-10">
                                            <div className="w-full h-4 bg-[#182033] rounded-full overflow-hidden">
                                                <div className="w-[50%] h-full bg-blue-600 rounded-full" />
                                            </div>

                                            <div className="flex justify-between mt-3 text-gray-500">
                                                <span>Bajo</span>
                                                <span>Alto</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Permisos */}
                                <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-[#182033] p-3 rounded-full">
                                            <ShieldCheck size={20} />
                                        </div>

                                        <h3 className="font-semibold text-xl">Permisos</h3>
                                    </div>

                                    <p className="text-gray-400 leading-relaxed mb-10">
                                        Marta ha aceptado cómodamente estas conexiones.
                                    </p>

                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <MapPin className="text-blue-400" size={20} />

                                                <span className="text-md text-gray-300">
                                                    Zonas seguras
                                                </span>
                                            </div>

                                            <CheckCircle2 className="text-gray-400" size={20} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Smartphone className="text-blue-400" size={20} />

                                                <span className="text-md text-gray-300">
                                                    Actividad del dispositivo
                                                </span>
                                            </div>

                                            <CheckCircle2 className="text-gray-400" size={20} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Wifi className="text-blue-400" size={20} />

                                                <span className="text-md text-gray-300">
                                                    Estado de la red
                                                </span>
                                            </div>

                                            <CheckCircle2 className="text-gray-400" size={20} />
                                        </div>
                                    </div>
                                </div>

                                {/* Apps */}
                                <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-[#182033] p-3 rounded-full">
                                            <Settings size={20} />
                                        </div>

                                        <h3 className="font-semibold text-xl">
                                            Aplicaciones monitoreadas
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-10">
                                        <div className="bg-[#111827] border border-[#182033] rounded-2xl p-3 flex flex-col items-center justify-center gap-2 hover:border-blue-500 transition">
                                            <div className="bg-[#182033] p-4 rounded-2xl">
                                                <MessageCircle className="text-green-400" size={20} />
                                            </div>

                                            <span className="text-gray-300">WhatsApp</span>
                                        </div>

                                        <div className="bg-[#111827] border border-[#182033] rounded-2xl p-3 flex flex-col items-center justify-center gap-2 hover:border-blue-500 transition">
                                            <div className="bg-[#182033] p-4 rounded-2xl">
                                                <Mail className="text-pink-400" size={20} />
                                            </div>

                                            <span className="text-gray-300">Correo</span>
                                        </div>

                                        <div className="bg-[#111827] border border-[#182033] rounded-2xl p-3 flex flex-col items-center justify-center gap-2 hover:border-blue-500 transition">
                                            <div className="bg-[#182033] p-4 rounded-2xl">
                                                <MessageSquare className="text-blue-400" size={20} />
                                            </div>

                                            <span className="text-gray-300">Mensajes</span>
                                        </div>

                                        <div className="bg-[#111827] border border-[#182033] rounded-2xl p-3 flex flex-col items-center justify-center gap-2 hover:border-blue-500 transition">
                                            <div className="bg-[#182033] p-4 rounded-2xl">
                                                <Image className="text-violet-400" size={20} />
                                            </div>

                                            <span className="text-gray-300">Fotos</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información reciente */}
                            <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-[#182033] p-3 rounded-full">
                                            <Bell size={20} />
                                        </div>

                                        <h3 className="font-semibold text-xl">
                                            Información reciente
                                        </h3>
                                    </div>

                                    <button className="text-blue-400 hover:text-blue-300 transition">
                                        Ver todo
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    {/* Card 1 */}
                                    <div className="rounded-3xl border border-[#182033] bg-[#111827] p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                        <div className="flex gap-5">
                                            <div className="bg-[#182033] p-3 rounded-full h-fit">
                                                <Info className="text-blue-400" size={18} />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h4 className="text-md">
                                                        Copia de seguridad completada
                                                    </h4>

                                                    <span className="text-xs tracking-wider bg-[#182033] px-3 py-1 rounded-md text-gray-300">
                                                        RUTINA
                                                    </span>
                                                </div>

                                                <p className="text-gray-400 leading-relaxed text-sm mt-2">
                                                    El teléfono de Marta se ha guardado en la nube con éxito.
                                                </p>
                                            </div>
                                        </div>

                                        <span className="text-gray-400 whitespace-nowrap">
                                            Hoy, 9:00 AM
                                        </span>
                                    </div>

                                    {/* Card 2 */}
                                    <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                        <div className="flex gap-5">
                                            <div className="bg-yellow-500/20 p-3 rounded-full h-fit">
                                                <Info className="text-yellow-400" size={18} />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h4 className="text-md">
                                                        Red no reconocida conectada
                                                    </h4>

                                                    <span className="text-xs tracking-wider bg-yellow-500/20 px-3 py-1 rounded-md text-yellow-200">
                                                        COMPROBACIÓN
                                                    </span>
                                                </div>

                                                <p className="text-gray-400 leading-relaxed mt-2 text-yellow-100/80 text-sm">
                                                    Dispositivo conectado a "CoffeeShop_FreeWiFi". Por favor,
                                                    verifique amablemente si era la intención.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="text-yellow-100/70 whitespace-nowrap">
                                                Ayer, 3:15 PM
                                            </span>

                                            <button className="bg-yellow-500/20 hover:bg-yellow-500/30 transition px-5 py-3 rounded-xl text-yellow-200">
                                                Descartar
                                            </button>
                                        </div>
                                    </div>

                                    {/* Card 3 */}
                                    <div className="rounded-3xl border border-[#182033] bg-[#111827] p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                        <div className="flex gap-5">
                                            <div className="bg-[#182033] p-3 rounded-full h-fit">
                                                <BatteryCharging className="text-gray-400" size={18} />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h4 className="text-md">
                                                        Batería saludable
                                                    </h4>

                                                    <span className="text-xs tracking-wider bg-[#182033] px-3 py-1 rounded-md text-gray-300">
                                                        RUTINA
                                                    </span>
                                                </div>

                                                <p className="text-gray-400 leading-relaxed text-sm mt-2">
                                                    El dispositivo se ha cargado durante la noche y está listo
                                                    para el día.
                                                </p>
                                            </div>
                                        </div>

                                        <span className="text-gray-400 whitespace-nowrap">
                                            Ayer, 7:00 AM
                                        </span>
                                    </div>
                                </div>
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