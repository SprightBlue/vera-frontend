import {useState, useEffect, useCallback, type ChangeEvent} from "react";
import {useAuth} from "@/presentation/context/AuthContext";
import {settingsApi, type ProfileResponse} from "@/features/settings/api/settingsApi";
import toast from "react-hot-toast";
import {AxiosError} from "axios";

interface BackendErrorResponse {
    message?: string;
    error?: string;
    details?: string;
    status?: number;
}

export type SettingsErrors = {
    fullName?: string;
    phone?: string;
    newEmail?: string;
    passwordConfirm?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
};

function parseBackendError(error: unknown): { rawMessage: string; cleanMessage: string } {
    let msg = "";

    if (error instanceof AxiosError) {
        const data = error.response?.data;

        if (data && typeof data === "object") {
            const errorObj = data as BackendErrorResponse;
            msg = errorObj.message || errorObj.error || errorObj.details || "";
        } else if (typeof data === "string") {
            msg = data;
        }

        if (!msg) {
            msg = error.message || "";
        }
    } else if (error instanceof Error) {
        msg = error.message;
    }

    const cleanMsg = msg
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    return {rawMessage: msg, cleanMessage: cleanMsg};
}

export function useSettings() {
    const {user, updateUser, logout} = useAuth();
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);

    const [uploading, setUploading] = useState<"upload" | "delete" | null>(null);

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const [savingProfile, setSavingProfile] = useState(false);
    const [savingEmail, setSavingEmail] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [savingDelete, setSavingDelete] = useState(false);

    const [profileForm, setProfileForm] = useState({fullName: "", phone: ""});
    const [emailForm, setEmailForm] = useState({newEmail: "", passwordConfirm: ""});
    const [passwordForm, setPasswordForm] = useState({currentPassword: "", newPassword: "", confirmPassword: ""});

    const [errors, setErrors] = useState<SettingsErrors>({});

    const loadProfile = useCallback(async () => {
        setIsLoadingProfile(true);
        try {
            const data = await settingsApi.getProfile();
            setProfile(data);
            setProfileForm({fullName: data.fullName, phone: data.phone ?? ""});
            setEmailForm({newEmail: data.email, passwordConfirm: ""});
        } catch {
            toast.error("No se pudo cargar el perfil");
        } finally {
            setIsLoadingProfile(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const initLoad = async () => {
            try {
                const data = await settingsApi.getProfile();
                if (!isMounted) return;

                setProfile(data);
                setProfileForm({fullName: data.fullName, phone: data.phone ?? ""});
                setEmailForm({newEmail: data.email, passwordConfirm: ""});
            } catch {
                toast.error("No se pudo cargar el perfil");
            } finally {
                if (isMounted) {
                    setIsLoadingProfile(false);
                }
            }
        };

        void initLoad();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleClearError = (field: keyof SettingsErrors) => {
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: undefined}));
        }
    };

    const setErrorField = (field: keyof SettingsErrors, message: string) => {
        setErrors(prev => ({...prev, [field]: message}));
    };

    const handleSaveProfile = async () => {
        setSavingProfile(true);
        setErrors(prev => ({...prev, fullName: undefined, phone: undefined}));
        try {
            const updated = await settingsApi.updateProfile(profileForm);
            setProfile(updated);
            if (user) updateUser({...user, fullName: updated.fullName});
            setIsEditingProfile(false);
            toast.success("Información personal actualizada con éxito.");
        } catch {
            toast.error("Error al actualizar la información personal");
        } finally {
            setSavingProfile(false);
        }
    };

    const handleSaveEmail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        setErrors(prev => ({...prev, newEmail: undefined, passwordConfirm: undefined}));

        if (!emailRegex.test(emailForm.newEmail)) {
            setErrorField("newEmail", "Por favor, ingresá un correo electrónico válido (ej: nombre@correo.com).");
            return;
        }

        setSavingEmail(true);
        try {
            await settingsApi.changeEmail({
                newEmail: emailForm.newEmail,
                password: emailForm.passwordConfirm
            });

            setEmailForm({newEmail: emailForm.newEmail, passwordConfirm: ""});
            setIsEditingEmail(false);

            toast.success("Correo actualizado con éxito. Por favor, iniciá sesión nuevamente.");

            logout();
            window.location.href = "/login";

        } catch (error: unknown) {
            const {rawMessage, cleanMessage} = parseBackendError(error);

            const isPasswordError =
                cleanMessage.includes("contrasena") ||
                cleanMessage.includes("incorrecta") ||
                cleanMessage.includes("no es correcta") ||
                cleanMessage.includes("password");

            const isEmailError =
                cleanMessage.includes("registrado") ||
                cleanMessage.includes("email") ||
                cleanMessage.includes("correo") ||
                cleanMessage.includes("exist") ||
                cleanMessage.includes("use");

            if (isEmailError) {
                setErrorField("newEmail", "Este correo ya está en uso por otra cuenta.");
            } else if (isPasswordError) {
                setErrorField("passwordConfirm", "La contraseña ingresada es incorrecta.");
            } else {
                toast.error(rawMessage || "No se pudo actualizar el correo");
            }
        } finally {
            setSavingEmail(false);
        }
    };

    const handleSavePassword = async () => {
        setErrors(prev => ({...prev, currentPassword: undefined, newPassword: undefined, confirmPassword: undefined}));

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setErrorField("confirmPassword", "Las contraseñas no coinciden.");
            return;
        }

        setSavingPassword(true);
        try {
            await settingsApi.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                confirmPassword: passwordForm.confirmPassword
            });

            setPasswordForm({currentPassword: "", newPassword: "", confirmPassword: ""});
            setIsEditingPassword(false);

            toast.success("Contraseña cambiada con éxito. Iniciá sesión con tus nuevas credenciales.");

            logout();
            window.location.href = "/login";

        } catch (error: unknown) {
            const {rawMessage, cleanMessage} = parseBackendError(error);

            if (cleanMessage.includes("actual es incorrecta") || cleanMessage.includes("no es correcta")) {
                setErrorField("currentPassword", "La contraseña actual es incorrecta.");
            } else if (cleanMessage.includes("distinta") || cleanMessage.includes("diferente")) {
                setErrorField("newPassword", "La nueva contraseña debe ser distinta a la actual.");
            } else {
                toast.error(rawMessage || "Error al modificar la contraseña");
            }
        } finally {
            setSavingPassword(false);
        }
    };

    const handleUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading("upload");
            const response = await settingsApi.uploadUserImage(file);
            if (profile) setProfile({...profile, imageUrl: response.image});
            if (user) updateUser({...user, image: response.image});
            toast.success("Foto de perfil actualizada.");
        } catch {
            toast.error("No se pudo subir la imagen");
        } finally {
            setUploading(null);
        }
    };

    const handleDeleteImage = async () => {
        try {
            setUploading("delete");
            await settingsApi.deleteUserImage();
            if (profile) setProfile({...profile, imageUrl: null});
            if (user) updateUser({...user, image: undefined});
            toast.success("Foto de perfil eliminada.");
        } catch {
            toast.error("No se pudo eliminar la foto de perfil");
        } finally {
            setUploading(null);
        }
    };

    const handleDeleteAccount = async (password?: string): Promise<void> => {
        setSavingDelete(true);
        try {
            await settingsApi.deleteAccount(password);
            toast.success("Tu cuenta ha sido eliminada correctamente.");
            logout();
            window.location.href = "/login";
        } catch (error: unknown) {
            const {rawMessage, cleanMessage} = parseBackendError(error);

            if (cleanMessage.includes("contrasena") || cleanMessage.includes("incorrecta")) {
                throw new Error("La contraseña ingresada no es correcta.", {cause: error});
            } else if (cleanMessage.includes("protegidas") || cleanMessage.includes("cuidador")) {
                throw new Error(rawMessage, {cause: error});
            } else {
                throw new Error(rawMessage || "No se pudo eliminar la cuenta. Intentalo más tarde.", {cause: error});
            }
        } finally {
            setSavingDelete(false);
        }
    };

    return {
        profile,
        isLoadingProfile,
        reloadProfile: loadProfile,
        uploading,
        isEditingProfile,
        setIsEditingProfile,
        savingProfile,
        profileForm,
        setProfileForm,
        handleSaveProfile,
        isEditingEmail,
        setIsEditingEmail,
        savingEmail,
        emailForm,
        setEmailForm,
        handleSaveEmail,
        isEditingPassword,
        setIsEditingPassword,
        savingPassword,
        passwordForm,
        setPasswordForm,
        handleSavePassword,
        handleUploadImage,
        handleDeleteImage,
        errors,
        handleClearError,
        savingDelete,
        handleDeleteAccount
    };
}