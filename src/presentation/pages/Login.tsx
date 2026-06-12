import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authRepository } from '../../infrastructure/api/auth.repository';
import { useAuth } from '../context/AuthContext';
import veraLogo from '../../assets/Isologo_Vera.png';


/* ---------------- ICONOS ---------------- */

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07z" fill="#EA4335" />
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M16.365 14.708c-.012-3.328 2.653-4.908 2.768-4.985-1.523-2.257-3.864-2.57-4.68-2.616-1.99-.214-3.882 1.183-4.896 1.183-1.026 0-2.607-1.168-4.267-1.135-2.155.034-4.144 1.264-5.247 3.208-2.24 3.92-.572 9.702 1.597 12.879z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 6L9 17L4 12"
      stroke="#0D6EFD"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3L19 6V11C19 16 15.5 20 12 21C8.5 20 5 16 5 11V6L12 3Z"
      stroke="#0D6EFD"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M16 21V19C16 17.9 15.1 17 14 17H6C4.9 17 4 17.9 4 19V21"
      stroke="#0D6EFD"
      strokeWidth="2"
    />
    <circle cx="10" cy="9" r="3" stroke="#0D6EFD" strokeWidth="2" />
    <path d="M20 21V19C20 18.2 19.5 17.5 18.8 17.2" stroke="#0D6EFD" strokeWidth="2" />
  </svg>
);

/* ---------------- FEATURE ---------------- */

const FeatureRow = ({
  icon,
  text,
  subtext
}: any) => (
  <div className="flex items-start gap-4">
    <div className="w-11 h-11 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
      {icon}
    </div>

    <div>
      <div className="text-lg font-bold text-white">{text}</div>
      <div className="text-sm text-gray-400">{subtext}</div>
    </div>
  </div>
);

/* ---------------- LOGIN ---------------- */

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await authRepository.login(form);
      login(data);
      navigate('/dashboard');
    } catch {
      alert('Email o contraseña incorrectos');
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-[#05070D] text-white">

      {/* IZQUIERDA */}
      <div className="hidden lg:flex w-1/2 justify-center bg-[#0B0D17] border-r border-white/5">
        <div className="max-w-[520px] pt-[100px]">

          <img
            src={veraLogo}
            alt="Vera"
            className="w-[185px]"
          />

          <h1 className="text-[58px] font-bold leading-[1] mb-3 max-w-[550px]">
            Tu guardián digital
            contra estafas
          </h1>

          <p className="text-gray-400 text-[17px] leading-8 mb-10 max-w-[470px]">
            Protección inteligente que analiza mensajes, emails y links
            para mantenerte seguro online.
          </p>

          <div className="w-full h-px bg-white/10 mb-8" />

          <div className="space-y-6">
            <FeatureRow
              icon={<CheckIcon />}
              text="99.2%"
              subtext="Precisión de detección"
            />

            <FeatureRow
              icon={<ShieldIcon />}
              text="24/7"
              subtext="Protección activa"
            />

            <FeatureRow
              icon={<UsersIcon />}
              text="50K+"
              subtext="Usuarios protegidos"
            />
          </div>
        </div>
      </div>

      {/* DERECHA */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-14">
        <div className="w-full max-w-[420px]">

          <h2 className="text-[44px] font-bold mb-3">
            Iniciar sesión
          </h2>

          <p className="text-gray-400 mb-10">
            Ingresá tus credenciales para acceder a tu cuenta
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <div>
              <label className="block mb-2 font-medium">
                Contraseña
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full h-14 rounded-2xl px-5 pr-14 bg-[#12141C] border border-white/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2"
                >
                  👁
                </button>
              </div>

              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-500 hover:text-blue-400"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" />
              <label className="text-sm text-gray-400">
                Recordarme por 30 días
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-14 rounded-2xl bg-[#0D6EFD] cursor-pointer hover:bg-[#0B5ED7] transition-all duration-300"
            >
              Iniciar sesión
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">
              O continuar con
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="flex gap-4">
            <SocialButton icon={<GoogleIcon />} text="Google" />
            <SocialButton icon={<AppleIcon />} text="Apple" />
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="text-blue-500">
              Crear cuenta gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Input(props: any) {
  return (
    <div>
      <label className="block mb-2 font-medium">{props.label}</label>
      <input
        {...props}
        className="w-full h-14 rounded-2xl px-5 bg-[#12141C] border border-white/10"
      />
    </div>
  );
}

function SocialButton({ icon, text }: any) {
  return (
    <button className="flex-1 h-14 rounded-2xl bg-[#12141C] border border-white/10 flex items-center justify-center gap-2">
      {icon}
      {text}
    </button>
  );
}