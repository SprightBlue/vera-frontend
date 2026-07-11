import { useState, useRef, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import {
    getProfile,
    updateProfile,
    uploadUserImage,
    deleteUserImage,
    type UpdateProfileRequest
} from "../../../infrastructure/api/profile-api";
import ChangePasswordModal from "../../components/settings/ChangePasswordModal";
import ChangeEmailModal from "../../components/settings/ChangeEmailModal";
import DeleteAccountModal from "../../components/settings/DeleteAccountModal";
import toast from "react-hot-toast";
import {PersonAvatar} from "@/presentation/components/common/PersonAvatar.tsx";
import {ActionButton} from "@/features/shared/components/ActionButton.tsx";

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

    // Menu de boton "Cambiar foto"
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);


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

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);



    const handleSaveChanges = async () => {

        try {

            const updatedProfile = await updateProfile(profile);

            setProfile({
                fullName: updatedProfile.fullName,
                phone: updatedProfile.phone ?? "",
                country: updatedProfile.country ?? ""
            });

            if (user) {
                updateUser({
                    ...user,
                    fullName: updatedProfile.fullName
                });
            }

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

    // Elimina la imagen del usuario
    const handleDeleteImage = async () => {

        if (!user) return;

        const confirmed = window.confirm(
            "¿Estás seguro de que querés eliminar tu foto de perfil?"
        );
    
        if (!confirmed) return;
    
        try {
            setUploading(true);
    
            await deleteUserImage(user.id);

            updateUser({
                image: undefined
            });
    
        } catch (error) {

            toast.error("No se pudo eliminar la imagen");

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
                            
                            {/* BOTONES CAMBIAR FOTO Y EDITAR PERFIL */}
                            <div className="flex">
                                <div className="mr-6" ref={menuRef}>
                                    <ActionButton
                                        variant="neutral"
                                        onClick={() => setShowMenu(!showMenu)}
                                        isLoading={uploading}
                                    >
                                        {uploading ? "Actualizando..." : "Cambiar foto"}
                                    </ActionButton>

                                    {showMenu && (
                                        <div className="absolute mt-2 w-52 rounded-2xl border border-white/10 bg-[#0B1120] overflow-hidden z-50 animate-fade-in">
                                            <label className="flex items-center px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors">
                                                Actualizar foto
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        handleSubmitImage(e);
                                                        setShowMenu(false);
                                                    }}
                                                />
                                            </label>

                                            <button
                                                onClick={() => {
                                                    setShowMenu(false);
                                                    handleDeleteImage();
                                                }}
                                                className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                            >
                                                Eliminar foto
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <ActionButton
                                    variant={isEditing ? "neutral" : "info"}
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {isEditing ? "Cancelar" : "Editar perfil"}
                                </ActionButton>
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
                                <ActionButton variant="success" onClick={handleSaveChanges}>
                                    Guardar cambios
                                </ActionButton>
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
                                <ActionButton
                                    variant="neutral"
                                    onClick={() => setShowPasswordModal(true)}
                                    className="w-full justify-between"
                                >
                                    <span>Cambiar contraseña</span>
                                </ActionButton>
                                <ActionButton
                                    variant="neutral"
                                    onClick={() => setShowEmailModal(true)}
                                    className="w-full justify-between"
                                >
                                    <span>Cambiar correo electrónico</span>
                                </ActionButton>
                                <ActionButton
                                    variant="danger"
                                    onClick={() => setShowDeleteAccountModal(true)}
                                    className="w-full justify-between"
                                >
                                    <span>⚠ Eliminar cuenta</span>
                                </ActionButton>
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