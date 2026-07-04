import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck, User } from "lucide-react";
import { getMyCarers } from "../../../infrastructure/api/protected-person-api"; 

export default function MyCarers() {
    const { user } = useAuth();
    const [carers, setCarers] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyCarers()
            .then(data => {
                setCarers(data);
            })
            .catch(err => console.error("Error cargando cuidadores:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex min-h-screen bg-[#050816]">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 ml-[79.2px] xl:ml-[224px]">
                <Header userName={user?.fullName || "Usuario"} userRole="Protegido/a" />

                <div className="p-8 flex-1">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <ShieldCheck className="text-blue-500" size={32} />
                            Mis Cuidadores
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Estas son las personas de confianza vinculadas a tu cuenta que reciben tus alertas de seguridad.
                        </p>
                    </div>

                    <div className="bg-[#0d1222] border border-[#182033] rounded-2xl p-6">
                        {loading ? (
                            <div className="flex justify-center items-center py-10">
                                <p className="text-slate-400 text-lg animate-pulse">Cargando cuidadores...</p>
                            </div>
                        ) : carers.length === 0 ? (
                            <div className="text-center py-14">
                                <ShieldCheck className="mx-auto text-slate-600 mb-4" size={48} />
                                <h3 className="text-xl font-medium text-white mb-2">Aún no tenés cuidadores asignados</h3>
                                <p className="text-slate-400">
                                    Un protector debe enviarte una invitación para vincular las cuentas.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {carers.map((carer, index) => (
                                    <div key={index} className="bg-[#131b2f] border border-[#1e293b] rounded-xl p-5 flex items-center gap-4 hover:border-blue-500/50 transition-colors">
                                        <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="text-blue-500" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold text-lg">{carer.fullName || "Cuidador"}</h4>
                                            <p className="text-slate-400 text-sm">{carer.email || "Email oculto"}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}