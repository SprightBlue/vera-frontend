import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { uploadUserImage } from "../../../infrastructure/api/auth.repository";

function Settings() {
    
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);

    // 1. NUEVO: Agregamos los estados para los checkboxes
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [criticalAlerts, setCriticalAlerts] = useState(true);
    const [weeklySummary, setWeeklySummary] = useState(false);

    // Función para simular el guardado en el backend
    const handleSaveChanges = () => {
        // Aquí empaquetamos los datos que luego enviaremos a Spring Boot
        const preferencesPayload = {
            emailAlertsEnabled: emailAlerts,
            criticalAlertsEnabled: criticalAlerts,
            weeklySummaryEnabled: weeklySummary
        };

        console.log("Datos listos para enviar al backend:", preferencesPayload);
        alert("Cambios guardados correctamente");
        setIsEditing(false);
    };

    // Aca se guarda la imagen del usuario y se actualiza la sesion
    const handleSubmitImage = async (e) => {
        try {
            const image = e.target.files[0];
            if (!image) return;

            setUploading(true);

            const imageUrl = await uploadUserImage(image, user.email);

            user.image = imageUrl;
            updateUser(user);

        } catch(error) {
            console.error(error);
        }
        finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#050816]">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 ml-[260px]">
                <Header userName={user?.fullName || "Usuario"} />

                <div className="p-8 flex-1">
                    {/* PAGE TITLE */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white">Configuración</h1>
                        <p className="text-slate-400 mt-2 text-lg">Personaliza tu experiencia y gestiona tu cuenta</p>
                    </div>

                    {/* PROFILE CARD */}
                    <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-8 mb-8">
                        <div className="flex items-center justify-between flex-wrap gap-6">
                            <div className="flex items-center gap-5">
                                {user?.image ? (
                                    <img
                                    src={user.image}
                                    alt="Perfil"
                                    className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white">
                                        {user?.fullName?.charAt(0) || "U"}
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{user?.fullName || "Usuario"}</h2>
                                    <p className="text-slate-400">{user?.email || "correo@ejemplo.com"}</p>
                                    <p className="text-sm text-slate-500 mt-1">Cuenta protegida activa</p>
                                </div>
                            </div>
                            <div>
                                <label className="px-5 py-3 mr-6 rounded-2xl bg-white/14 border border-white/20 backdrop-blur-sm text-white font-medium cursor-pointer hover:bg-white/20 hover:border-white/30 transition-all duration-300 active:scale-95">
                                    {uploading ? "Actualizando.." : "Cambiar foto"}
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleSubmitImage}
                                    />
                                </label>

                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium"
                                >
                                    {isEditing ? "Cancelar" : "Editar perfil"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* PERSONAL INFO */}
                    <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-8 mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-6">Información personal</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">Nombre completo</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    defaultValue={user?.fullName || ""}
                                    className="w-full bg-[#12141c] border border-[#1f2937] rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">Correo electrónico</label>
                                <input
                                    type="email"
                                    disabled={!isEditing}
                                    defaultValue={user?.email || ""}
                                    className="w-full bg-[#12141c] border border-[#1f2937] rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">Teléfono</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    placeholder="+54 11 1234 5678"
                                    className="w-full bg-[#12141c] border border-[#1f2937] rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">Zona horaria</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    defaultValue="Argentina (GMT-3)"
                                    className="w-full bg-[#12141c] border border-[#1f2937] rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end mt-8">
                                <button
                                    onClick={handleSaveChanges}
                                    className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium"
                                >
                                    Guardar cambios
                                </button>
                            </div>
                        )}
                    </div>

                    {/* PREFERENCIAS DE NOTIFICACIÓN */}
                    <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-8 mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-6">Preferencias de notificación</h2>
                        <div className="space-y-5">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-white font-medium">Alertas por correo</h3>
                                    <p className="text-slate-400 text-sm">Recibir notificaciones importantes por email</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    checked={emailAlerts}
                                    onChange={(e) => setEmailAlerts(e.target.checked)}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-white font-medium">Alertas críticas inmediatas</h3>
                                    <p className="text-slate-400 text-sm">Notificar eventos de alto riesgo en tiempo real</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    checked={criticalAlerts}
                                    onChange={(e) => setCriticalAlerts(e.target.checked)}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-white font-medium">Resumen semanal</h3>
                                    <p className="text-slate-400 text-sm">Recibir resumen de actividad y análisis</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    checked={weeklySummary}
                                    onChange={(e) => setWeeklySummary(e.target.checked)}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SEGURIDAD DE CUENTA */}
                    <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-8">
                        <h2 className="text-2xl font-semibold text-white mb-6">Seguridad de cuenta</h2>
                        <div className="space-y-4">
                            <button className="w-full flex justify-between items-center bg-[#12141c] border border-[#1f2937] rounded-2xl px-5 py-4 text-white hover:border-blue-500 transition-colors">
                                <span>Cambiar contraseña</span>
                                <span className="text-slate-400">→</span>
                            </button>
                            <button className="w-full flex justify-between items-center bg-[#12141c] border border-[#1f2937] rounded-2xl px-5 py-4 text-white hover:border-blue-500 transition-colors">
                                <span>Ver sesiones activas</span>
                                <span className="text-slate-400">→</span>
                            </button>
                            <button className="w-full flex justify-between items-center bg-[#12141c] border border-red-500/30 rounded-2xl px-5 py-4 text-red-400 hover:bg-red-500/10 transition-colors">
                                <span>Cerrar todas las sesiones</span>
                                <span>⚠</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Settings;