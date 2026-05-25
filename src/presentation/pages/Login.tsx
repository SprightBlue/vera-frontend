import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authRepository } from '../../infrastructure/api/auth.repository';
import { useAuth } from '../context/AuthContext';

// --- Íconos extraídos para el diseño ---
const ShieldIcon = () => (
  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  </div>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.365 14.708c-.012-3.328 2.653-4.908 2.768-4.985-1.523-2.257-3.864-2.57-4.68-2.616-1.99-.214-3.882 1.183-4.896 1.183-1.026 0-2.607-1.168-4.267-1.135-2.155.034-4.144 1.264-5.247 3.208-2.24 3.92-.572 9.702 1.597 12.879 1.062 1.554 2.308 3.3 3.93 3.238 1.562-.063 2.156-1.026 4.043-1.026 1.875 0 2.426 1.026 4.054.993 1.675-.03 2.756-1.583 3.805-3.134 1.214-1.79 1.713-3.522 1.737-3.612-.036-.016-3.232-1.258-3.244-4.593zM15.006 4.673c.844-1.034 1.413-2.47 1.257-3.905-1.192.05-2.68.803-3.542 1.826-.763.896-1.446 2.368-1.266 3.774 1.33.104 2.705-.66 3.55-1.695z" />
  </svg>
);

const FeatureRow = ({ icon, text, subtext }: { icon: string, text: string, subtext: string }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
      {icon === 'check' && (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      )}
      {icon === 'shield' && (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )}
      {icon === 'users' && (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )}
    </div>
    <div>
      <div className="text-lg font-bold text-white">{text}</div>
      <div className="text-sm text-gray-400 mt-1">{subtext}</div>
    </div>
  </div>
);

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authRepository.login(form);
      login(data);
      navigate('/dashboard');
    } catch {
      setError('Email o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor principal ocupando todo el ancho y alto
    <div className="w-full min-h-screen flex bg-[#0a0b10] text-white font-sans">

      {/* --- PANEL IZQUIERDO (Branding) --- */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-24 bg-[#0d0e15] border-r border-white/5 relative">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-12">
            <ShieldIcon />
            <span className="text-3xl font-bold text-blue-500 tracking-tight">vera</span>
          </div>

          <h1 className="text-[2.5rem] font-bold leading-tight mb-4">
            Tu guardián digital<br />contra estafas
          </h1>
          <p className="text-gray-400 text-base leading-relaxed mb-12">
            Protección inteligente que analiza mensajes, emails y links para mantenerte seguro online.
          </p>

          <div className="w-full h-px bg-white/5 mb-10" />

          <div className="space-y-8">
            <FeatureRow icon="check" text="99.2%" subtext="Precisión de detección" />
            <FeatureRow icon="shield" text="24/7" subtext="Protección activa" />
            <FeatureRow icon="users" text="50K+" subtext="Usuarios protegidos" />
          </div>
        </div>
      </div>

      {/* --- PANEL DERECHO (Formulario) --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24">
        <div className="w-full max-w-[400px] mx-auto">
          
          {/* Header del form */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Iniciar sesión</h2>
            <p className="text-gray-400 text-sm">
              Ingresá tus credenciales para acceder a tu cuenta
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-200">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-4 py-3
                           text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 
                           transition-colors"
              />
            </div>

            {/* Input Contraseña */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-200">Contraseña</label>
                <button type="button" className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#12141c] border border-white/10 rounded-xl px-4 py-3
                             text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 
                             transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {/* Ícono de ojito simplificado */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Checkbox Recordarme */}
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-600 bg-[#12141c] accent-blue-600" />
              <label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer">Recordarme por 30 días</label>
            </div>

            {/* Botón Principal */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0D6EFD] hover:bg-blue-600 disabled:opacity-50 
                         text-white font-medium py-3 rounded-xl transition-all mt-2"
            >
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </form>

          {/* Separador Redes Sociales */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs text-gray-500">O continuar con</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Botones Redes Sociales */}
          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#12141c] border border-white/10 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">
              <GoogleIcon /> Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#12141c] border border-white/10 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">
              <AppleIcon /> Apple
            </button>
          </div>

          {/* Link de Registro */}
          <p className="text-center text-sm text-gray-400 mt-8">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
              Crear cuenta gratis
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}