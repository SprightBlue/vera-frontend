import { ArrowLeft, Heart, Link, Clock3, Settings, Activity, ShieldCheck, MapPin, Smartphone, Wifi, Building2, Mail, MessageSquare, Image, Bell, Info, BatteryCharging, CheckCircle2 } from "lucide-react";

import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import "material-symbols";


function PersonDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const people = [
        {
            id: 1,
            photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
            fullName: "Sophia Williams",
            relationshipType: "Familiar",
            lastActivity: "2 minutes ago",
            phone: "+1 202 555 0123",
            email: "sophia@example.com",
            notificationSensitivity: "Estándar"
        }
    ];

    const person = people.find(
        (p) => p.id === Number(id)
    );

    return (
        <div className="flex min-h-screen bg-[#050816]">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 ml-[260px]">
                <Header
                    userName="Usuario"
                    title="Personas que cuido"
                    subtitle="Observa los detalles de cada persona a la que protejes"
                />
                <div className="w-full max-w-7xl p-8">
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
                    <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-6 md:p-8 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                            {/* Izquierda */}
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="py-4">
                                    <img
                                        src={person?.photo}
                                        alt="Marta"
                                        className="w-28 h-28 rounded-full object-cover border-4 border-[#182033]"
                                    />
                                </div>


                                <div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h2 className="text-3xl font-bold">
                                            {person?.fullName}
                                        </h2>

                                        <div className="flex items-center gap-2 bg-[#182033] px-4 py-2 rounded-full text-gray-300">
                                            <Heart className="w-4 h-4" />
                                            <span>{person?.relationshipType}</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 mt-4 max-w-xl leading-relaxed">
                                        Conexión establecida de forma segura. Todos los sistemas están cuidando de Marta.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                        <div className="flex items-center gap-3 bg-[#111827] border border-[#182033] px-5 py-3 rounded-2xl">
                                            <Link className="w-5 h-5 text-blue-400" />

                                            <span className="text-gray-300">
                                                Conectado desde Ago 2023
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 bg-[#111827] border border-[#182033] px-5 py-3 rounded-2xl">
                                            <Clock3 className="w-5 h-5 text-blue-400" />

                                            <span className="text-gray-300">
                                                Última actividad {person?.lastActivity}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botón */}
                            <button onClick={() => navigate('/persons/personConfig')} className="flex items-center gap-3 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold cursor-pointer">
                                <Settings className="w-5 h-5" />
                                Ajustar configuración
                            </button>
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

                                <h3 className="font-semibold text-lg">Sensibilidad</h3>
                            </div>

                            <div className="mt-16">
                                <div className="flex flex-wrap justify-center ">
                                    <h2 className="text-4xl font-bold px-5">
                                        {person?.notificationSensitivity}
                                    </h2>

                                    <p className="text-gray-400 leading-relaxed mb-10 mt-4">
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

                                <h3 className="font-semibold text-lg">Permisos</h3>
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

                                <h3 className="font-semibold text-lg">
                                    Aplicaciones monitoreadas
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-5 mt-10">
                                <div className="bg-[#111827] border border-[#182033] rounded-2xl p-4 flex flex-col items-center justify-center gap-4 hover:border-blue-500 transition">
                                    <div className="bg-[#182033] p-4 rounded-2xl">
                                        <Building2 className="text-blue-400" size={20} />
                                    </div>

                                    <span className="text-gray-300">Banca</span>
                                </div>

                                <div className="bg-[#111827] border border-[#182033] rounded-2xl p-4 flex flex-col items-center justify-center gap-4 hover:border-blue-500 transition">
                                    <div className="bg-[#182033] p-4 rounded-2xl">
                                        <Mail className="text-pink-400" size={20} />
                                    </div>

                                    <span className="text-gray-300">Correo</span>
                                </div>

                                <div className="bg-[#111827] border border-[#182033] rounded-2xl p-4 flex flex-col items-center justify-center gap-4 hover:border-blue-500 transition">
                                    <div className="bg-[#182033] p-4 rounded-2xl">
                                        <MessageSquare className="text-green-400" size={20} />
                                    </div>

                                    <span className="text-gray-300">Mensajes</span>
                                </div>

                                <div className="bg-[#111827] border border-[#182033] rounded-2xl p-4 flex flex-col items-center justify-center gap-4 hover:border-blue-500 transition">
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

                                <h3 className="font-semibold text-lg">
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

                                        <p className="text-gray-400 leading-relaxed mt-2">
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

                                        <p className="text-gray-400 leading-relaxed mt-2 text-yellow-100/80">
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

                                        <p className="text-gray-400 leading-relaxed mt-2">
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
            </main>
        </div>
    );
}

export default PersonDetail;