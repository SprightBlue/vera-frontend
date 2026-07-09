import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { uploadUserImage } from "../../../infrastructure/api/auth.repository";
import {
    getProfile,
    updateProfile,
    type UpdateProfileRequest
} from "../../../infrastructure/api/profile-api";
import ChangePasswordModal from "../../components/settings/ChangePasswordModal";
import ChangeEmailModal from "../../components/settings/ChangeEmailModal";
import DeleteAccountModal from "../../components/settings/DeleteAccountModal";
import toast from "react-hot-toast";
import {PersonAvatar} from "@/presentation/components/common/PersonAvatar.tsx";

function Settings() {

    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showPasswordModal, setShowPasswordModal] =
        useState(false);
    const [showEmailModal, setShowEmailModal] =
        useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] =
        useState(false);
    const [profile, setProfile] = useState<UpdateProfileRequest>({
        fullName: "",
        phone: "",
        country: ""
    });


    // 1. NUEVO: Agregamos los estados para los checkboxes
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [criticalAlerts, setCriticalAlerts] = useState(true);
    const [weeklySummary, setWeeklySummary] = useState(false);


    useEffect(() => {

        const loadProfile = async () => {

            try {

                const data = await getProfile();

                setProfile({
                    fullName: data.fullName,
                    phone: data.phone ?? "",
                    country: data.country ?? ""
                });

            } catch {

                toast.error("No se pudo cargar el perfil");

            }

        };

        loadProfile();

    }, []);



    const handleSaveChanges = async () => {

        try {

            const updatedProfile = await updateProfile(profile);

            setProfile({
                fullName: updatedProfile.fullName,
                phone: updatedProfile.phone ?? "",
                country: updatedProfile.country ?? ""
            });

            updateUser({
                ...user,
                fullName: updatedProfile.fullName
            });

            toast.success("Perfil actualizado correctamente");

            setIsEditing(false);

        } catch {

            toast.error("No se pudo actualizar el perfil");

        }

    };

    // Aca se guarda la imagen del usuario y se actualiza la sesion
    const handleSubmitImage = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        if (!user) return;

        const image = e.target.files?.[0];

        if (!image) return;

        try {

            setUploading(true);

            const imageUrl = await uploadUserImage(
                image,
                user.email
            );

            updateUser({
                image: imageUrl
            });

        } catch {

            toast.error("No se pudo subir la imagen");

        } finally {

            setUploading(false);

        }
    };

    return (
        <div className="flex min-h-screen bg-[#050816]">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 ml-[79.2px] lg:ml-[224px]">
                <Header
                    title="Configuración"
                    subtitle="Personaliza tu experiencia y gestiona tu cuenta."
                />

                <div className="p-8 flex-1 w-full max-w-4xl mx-auto">
                    {/* PAGE TITLE */}


                    {/* PROFILE CARD */}
                    <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-8 mb-8">
                        <div className="flex items-center justify-between flex-wrap gap-6">
                            <div className="flex items-center gap-5">
                                <PersonAvatar fullName={user?.fullName ?? "U"} image={user?.image} size="md" />
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
                                    className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium cursor-pointer"
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
                                    value={profile.fullName}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            fullName: e.target.value
                                        })
                                    }
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
                                    value={profile.phone}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            phone: e.target.value
                                        })
                                    }
                                    className="w-full bg-[#12141c] border border-[#1f2937] rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">Pais</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={profile.country}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            country: e.target.value
                                        })
                                    }
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

                    <div className="md:flex md:justify-between">
                        {/* PREFERENCIAS DE NOTIFICACIÓN */}
                        <div className="md:w-[48%] bg-[#0d1222] border border-[#182033] rounded-3xl p-8 mb-8">
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
                        <div className="md:w-[48%] bg-[#0d1222] border border-[#182033] rounded-3xl p-8 mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-6">Seguridad de cuenta</h2>
                            <div className="space-y-4">
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="w-full flex justify-between items-center bg-[#12141c] border border-[#1f2937] rounded-2xl px-5 py-4 text-white hover:border-blue-500 transition-colors cursor-pointer"
                                >
                                    <span>Cambiar contraseña</span>
                                    <span className="text-slate-400">→</span>
                                </button>
                                <button
                                    onClick={() => setShowEmailModal(true)}
                                    className="w-full flex justify-between items-center bg-[#12141c] border border-[#1f2937] rounded-2xl px-5 py-4 text-white hover:border-blue-500 transition-colors cursor-pointer"
                                >
                                    <span>Cambiar correo electrónico</span>
                                    <span className="text-slate-400">→</span>
                                </button>
                                <button
                                    onClick={() => setShowDeleteAccountModal(true)}
                                    className="w-full flex justify-between items-center border border-red-900 rounded-2xl px-5 py-4 text-red-500 hover:bg-red-950/20 transition-colors cursor-pointer"
                                >
                                    <span>Eliminar cuenta</span>
                                    <span>⚠</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />
            <ChangeEmailModal
                isOpen={showEmailModal}
                onClose={() => setShowEmailModal(false)}
            />
            <DeleteAccountModal
                isOpen={showDeleteAccountModal}
                onClose={() => setShowDeleteAccountModal(false)}
            />
        </div>
    );
}

export default Settings;