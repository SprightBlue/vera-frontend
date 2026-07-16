import {useRef, type ChangeEvent, type ComponentType} from "react";
import Sidebar from "@/features/shared/components/Sidebar";
import Header from "@/features/shared/components/Header";
import {LoadingScreen} from "@/features/shared/components/LoadingScreen";
import {RetryScreen} from "@/features/shared/components/RetryScreen";
import {useSettings} from "@/features/settings/hooks/useSettings";
import {User, ContactRound, Mail, KeyRound, Trash2} from "lucide-react";
import {ProfileImageSection} from "@/features/settings/components/ProfileImageSection";
import {ProfileDataSection} from "@/features/settings/components/ProfileDataSection";
import {ProfileEmailSection} from "@/features/settings/components/ProfileEmailSection";
import {ProfilePasswordSection} from "@/features/settings/components/ProfilePasswordSection";
import {ProfileDeleteSection} from "@/features/settings/components/ProfileDeleteSection";

type SectionKey = "imagen" | "datos" | "correo" | "clave" | "eliminar";

interface NavigationItem {
    id: SectionKey;
    label: string;
    icon: ComponentType<{ className?: string }>;
    isDanger?: boolean;
}

export function SettingsView() {
    const {
        profile,
        isLoadingProfile,
        reloadProfile,
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
    } = useSettings();

    const elementsRef = useRef<Map<SectionKey, HTMLDivElement | null>>(new Map());

    const registerRef = (key: SectionKey, node: HTMLDivElement | null) => {
        if (node) {
            elementsRef.current.set(key, node);
        } else {
            elementsRef.current.delete(key);
        }
    };

    const handleScrollTo = (key: SectionKey) => {
        const element = elementsRef.current.get(key);
        element?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const navItems: NavigationItem[] = [
        {id: "imagen", label: "Imagen de Perfil", icon: User},
        {id: "datos", label: "Datos Personales", icon: ContactRound},
        {id: "correo", label: "Correo Electrónico", icon: Mail},
        {id: "clave", label: "Contraseña de Ingreso", icon: KeyRound},
        {id: "eliminar", label: "Eliminar Cuenta", icon: Trash2, isDanger: true}
    ];

    if (isLoadingProfile) {
        return (
            <div className="flex h-screen w-screen bg-[#050816] text-slate-100 font-sans antialiased">
                <Sidebar/>
                <div className="flex-1 flex flex-col min-w-0 h-full ml-20 lg:ml-56">
                    <Header title="Configuración de Cuenta"/>
                    <main className="flex-1 flex items-center justify-center">
                        <LoadingScreen/>
                    </main>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex h-screen w-screen bg-[#050816] text-slate-100 font-sans antialiased">
                <Sidebar/>
                <div className="flex-1 flex flex-col min-w-0 h-full ml-20 lg:ml-56">
                    <Header title="Configuración de Cuenta"/>
                    <main className="flex-1 flex items-center justify-center">
                        <RetryScreen onRetry={reloadProfile}/>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex h-screen w-screen overflow-hidden bg-[#050816] text-slate-100 font-sans antialiased select-none">
            <Sidebar/>

            <div
                className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56">
                <Header
                    userName={profile.fullName}
                    title="Configuración de Cuenta"
                />

                <main
                    className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1rem,2vw,3rem)] py-[clamp(1rem,1.8vw,2.5rem)] flex flex-col">
                    <div className="mx-auto max-w-7xl w-full flex-1 flex flex-col">

                        <div
                            className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-[clamp(1.5rem,3vw,4rem)] items-start w-full">

                            <div
                                className="relative w-full overflow-hidden px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1.5rem,4vw,3.5rem)]">
                                <div
                                    className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(circle_at_center,white_60%,transparent_95%)] opacity-30 pointer-events-none"/>
                                <div
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-blue-500/5 rounded-full filter blur-[120px] pointer-events-none"/>

                                <div className="flex flex-col gap-[clamp(3.5rem,5vw,6rem)] w-full relative z-10">

                                    <div ref={(el) => registerRef("imagen", el)} className="scroll-mt-10">
                                        <ProfileImageSection
                                            fullName={profile.fullName}
                                            imageUrl={profile.imageUrl}
                                            uploading={uploading}
                                            onUpload={(e: ChangeEvent<HTMLInputElement>) => handleUploadImage(e)}
                                            onDelete={handleDeleteImage}
                                        />
                                    </div>

                                    <div
                                        className="h-px bg-linear-to-r from-transparent via-slate-800/45 to-transparent"/>

                                    <div ref={(el) => registerRef("datos", el)} className="scroll-mt-10">
                                        <ProfileDataSection
                                            isEditing={isEditingProfile}
                                            saving={savingProfile}
                                            form={profileForm}
                                            staticName={profile.fullName}
                                            staticPhone={profile.phone ?? null}
                                            errors={errors}
                                            onClearError={handleClearError}
                                            onEditToggle={setIsEditingProfile}
                                            onChange={setProfileForm}
                                            onSave={handleSaveProfile}
                                        />
                                    </div>

                                    <div
                                        className="h-px bg-linear-to-r from-transparent via-slate-800/45 to-transparent"/>

                                    <div ref={(el) => registerRef("correo", el)} className="scroll-mt-10">
                                        <ProfileEmailSection
                                            isEditing={isEditingEmail}
                                            saving={savingEmail}
                                            form={emailForm}
                                            staticEmail={profile.email}
                                            errors={errors}
                                            onEditToggle={setIsEditingEmail}
                                            onChange={setEmailForm}
                                            onClearError={handleClearError}
                                            onSave={handleSaveEmail}
                                        />
                                    </div>

                                    <div
                                        className="h-px bg-linear-to-r from-transparent via-slate-800/45 to-transparent"/>

                                    <div ref={(el) => registerRef("clave", el)} className="scroll-mt-10">
                                        <ProfilePasswordSection
                                            isEditing={isEditingPassword}
                                            saving={savingPassword}
                                            form={passwordForm}
                                            errors={errors}
                                            onEditToggle={setIsEditingPassword}
                                            onChange={setPasswordForm}
                                            onClearError={handleClearError}
                                            onSave={handleSavePassword}
                                        />
                                    </div>

                                    <div
                                        className="h-px bg-linear-to-r from-transparent via-slate-800/45 to-transparent"/>

                                    <div ref={(el) => registerRef("eliminar", el)} className="scroll-mt-10">
                                        <ProfileDeleteSection
                                            onDeleteAccount={handleDeleteAccount}
                                            isDeleting={savingDelete}
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="hidden lg:block sticky top-6 space-y-4 w-full">
                                <div
                                    className="rounded-xl border border-slate-800/80 bg-linear-to-b from-[#0f172a] to-[#020617] p-[clamp(1.1rem,1.5vw,1.8rem)] shadow-2xl relative overflow-hidden ring-1 ring-inset ring-slate-700/10 w-full select-none">
                                    <div
                                        className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(circle_at_center,white_45%,transparent_85%)] opacity-30 pointer-events-none"/>
                                    <div
                                        className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-slate-500 filter blur-3xl opacity-10 pointer-events-none"/>
                                    <div
                                        className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"/>

                                    <div className="flex items-center select-none mb-4 relative z-10">
                                        <span
                                            className="text-[clamp(10px,0.58vw,11px)] font-display font-extrabold text-slate-500 tracking-widest uppercase leading-none">
                                            Índice • Configuración
                                        </span>
                                    </div>

                                    <div
                                        className="h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none mb-4 relative z-10"/>

                                    <nav className="flex flex-col gap-2 relative z-10">
                                        {navItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleScrollTo(item.id)}
                                                    className={`group w-full flex items-center gap-[clamp(0.5rem,0.8vw,0.88rem)] px-[clamp(0.75rem,1vw,1.2rem)] py-[clamp(0.65rem,0.8vw,0.85rem)] rounded-lg text-left text-[clamp(10px,0.58vw,11px)] font-display font-black tracking-wider uppercase border relative select-none cursor-pointer active:scale-[0.97] transition-all duration-300 z-10 overflow-hidden outline-hidden
                                                        ${item.isDanger
                                                        ? "text-slate-400 border-transparent hover:border-red-950/40 hover:bg-linear-to-b hover:from-red-950/10 hover:to-red-950/5 hover:text-red-400"
                                                        : "text-slate-400 border-transparent hover:border-[#161f37] hover:bg-linear-to-b hover:from-[#080d20]/50 hover:to-[#040714]/30 hover:text-slate-200"
                                                    }`}
                                                >
                                                    <div
                                                        className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-500 z-20 ${item.isDanger ? "group-hover:via-red-500/20" : "group-hover:via-slate-500/20"}`}/>
                                                    <div
                                                        className={`absolute -top-6 -right-6 w-16 h-16 rounded-full filter blur-md pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 opacity-0 scale-75 ${item.isDanger ? "bg-red-500 group-hover:opacity-10 group-hover:scale-110" : "bg-blue-500 group-hover:opacity-10 group-hover:scale-110"}`}/>
                                                    <span
                                                        className={`absolute left-0 top-1.5 bottom-1.5 w-0.75 rounded-r transition-all duration-300 z-20 bg-transparent ${item.isDanger ? "group-hover:bg-red-500 group-hover:shadow-[0_0_12px_#ef4444]" : "group-hover:bg-blue-500 group-hover:shadow-[0_0_12px_#3b82f6]"}`}/>

                                                    <span
                                                        className="shrink-0 transition-all duration-300 relative z-10">
                                                        <Icon
                                                            className={`w-3.5 h-3.5 transition-all duration-300 ${item.isDanger ? "text-slate-500 group-hover:text-red-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "text-slate-500 group-hover:text-blue-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"}`}/>
                                                    </span>
                                                    <span
                                                        className="truncate relative z-10 transition-colors duration-300">
                                                        {item.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </nav>
                                </div>
                            </div>

                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}