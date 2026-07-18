import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authRepository } from '@/presentation/api/auth.repository';
import { useAuth } from '../context/AuthContext';
import veraLogo from '../../assets/Isologo_Vera.png';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import toast from "react-hot-toast";
import { Eye, EyeOff, Check, Shield, Users } from 'lucide-react';

/* ---------------- FEATURE ROW ---------------- */

const FeatureRow = ({ icon, text, subtext }: { icon: React.ReactNode; text: string; subtext: string }) => (
    <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 shrink-0 text-blue-500">
            {icon}
        </div>
        <div>
            <div className="heading-md !text-lg normal-case">{text}</div>
            <div className="text-sm text-gray-400 font-normal">{subtext}</div>
        </div>
    </div>
);

/* ---------------- LOGIN MAIN ---------------- */

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await authRepository.login(form);
            login(data, rememberMe);
            navigate('/dashboard');
        } catch {
            toast.error("El email o la contraseña no son correctos");
        }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            if (!credentialResponse.credential) {
                throw new Error('No se recibió credential');
            }
            const data = await authRepository.googleLogin(credentialResponse.credential);
            login(data, rememberMe);
            navigate('/dashboard');
        } catch {
            toast.error("Error al iniciar sesión con Google");
        }
    };

    return (
        // Unificamos el comportamiento: el scroll general se maneja de forma natural a nivel global
        <div className="w-full min-h-screen flex bg-[#05070D] text-white">

            {/* PANEL IZQUIERDO: Estático, se acopla al alto disponible */}
            <div className="hidden lg:flex lg:w-1/2 justify-center bg-[#0B0D17] border-r border-white/5 px-8 xl:px-16">
                <div className="max-w-[520px] w-full py-12 flex flex-col justify-between min-h-screen sticky top-0">
                    <div>
                        <img
                            src={veraLogo}
                            alt="Vera"
                            className="w-[160px] md:w-[185px] mb-8 lg:mb-12"
                        />

                        <h1 className="heading-xl normal-case mb-4">
                            Tu guardián digital contra estafas
                        </h1>

                        <p className="body-text max-w-[470px]">
                            Protección inteligente que analiza mensajes, emails y links para mantenerte seguro online.
                        </p>
                    </div>

                    <div className="w-full mt-6">
                        <div className="w-full h-px bg-white/10 mb-6" />
                        <div className="space-y-5">
                            <FeatureRow
                                icon={<Check className="w-5 h-5 stroke-[2.5]" />}
                                text="99.2%"
                                subtext="Precisión de detección"
                            />
                            <FeatureRow
                                icon={<Shield className="w-5 h-5 stroke-[2]" />}
                                text="24/7"
                                subtext="Protección activa"
                            />
                            <FeatureRow
                                icon={<Users className="w-5 h-5 stroke-[2]" />}
                                text="50K+"
                                subtext="Usuarios protegidos"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* PANEL DERECHO: Eliminados los overflows internos para matar el doble scroll */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 sm:px-16 md:px-24 lg:px-12 xl:px-20 min-h-screen">
                <div className="w-full max-w-[400px] flex flex-col justify-center">

                    {/* Logo Mobile */}
                    <img
                        src={veraLogo}
                        alt="Vera"
                        className="w-[130px] mb-6 lg:hidden self-start"
                    />

                    <h2 className="heading-lg normal-case mb-1">
                        Iniciar sesión
                    </h2>

                    <p className="body-text !text-gray-400 mb-8">
                        Ingresá tus credenciales para acceder a tu cuenta
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold tracking-wide text-gray-200">
                                Contraseña
                            </label>

                            <div className="relative flex items-center">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    required
                                    className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl px-4 pr-12 bg-[#12141C] border border-white/10 text-sm sm:text-base text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-2.5 z-10 focus:outline-none flex items-center justify-center"
                                    title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            <div className="flex justify-end mt-0.5">
                                <Link
                                    to="/forgot-password"
                                    className="text-xs sm:text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 pt-0.5">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-white/10 bg-[#12141C] text-blue-500 focus:ring-0 accent-blue-500 cursor-pointer"
                            />
                            <label htmlFor="rememberMe" className="text-xs sm:text-sm text-gray-400 cursor-pointer select-none">
                                Recordarme por 30 días
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-[#0D6EFD] font-semibold text-sm sm:text-base cursor-pointer hover:bg-[#0B5ED7] transition-all duration-300 shadow-lg shadow-blue-500/10 active:scale-[0.99]"
                        >
                            Iniciar sesión
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-6 sm:my-8">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-[10px] sm:text-xs text-gray-500 font-medium tracking-wider uppercase whitespace-nowrap">
                            O continuar con
                        </span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <div className="flex justify-center w-full min-h-[44px]">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Error al iniciar sesión con Google')}
                            theme="filled_black"
                            shape="pill"
                            size="large"
                            text="continue_with"
                            width="400px"
                        />
                    </div>

                    <p className="text-center text-xs sm:text-sm text-gray-400 mt-8">
                        ¿No tenés cuenta?{' '}
                        <Link to="/register" className="text-blue-500 font-semibold hover:text-blue-400 transition-colors">
                            Crear cuenta gratis
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ---------------- INTERFACE COMPONENTE INPUT ---------------- */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

function Input({ label, ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold tracking-wide text-gray-200">{label}</label>
            <input
                {...props}
                className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl px-4 sm:px-5 bg-[#12141C] border border-white/10 text-sm sm:text-base text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
        </div>
    );
}