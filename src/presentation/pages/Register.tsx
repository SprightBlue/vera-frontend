import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authRepository } from '../../infrastructure/api/auth.repository';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await authRepository.register(form);
      // Auto-login después del registro
      login(data);
      navigate('/dashboard');
    } catch {
      setError('No se pudo crear la cuenta. El email puede estar en uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0b10] text-white">

      {/* Panel izquierdo */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#0d0e15] border-r border-white/5">
        <div className="flex items-center gap-3">
          <ShieldIcon />
          <span className="text-2xl font-bold">Vera</span>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Empezá a protegerte<br />hoy mismo
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Creá tu cuenta gratuita y comenzá a analizar mensajes,
            emails y links con inteligencia artificial.
          </p>
          <div className="w-16 h-px bg-white/20" />
          <div className="space-y-4">
            <Feature text="Análisis ilimitado de mensajes sospechosos" />
            <Feature text="Alertas en tiempo real ante amenazas" />
            <Feature text="Historial completo de análisis" />
            <Feature text="Soporte 24/7 ante incidentes" />
          </div>
        </div>
        <p className="text-gray-600 text-sm">© 2026 Vera. Todos los derechos reservados.</p>
      </div>

      {/* Panel derecho */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">

          <div className="flex items-center gap-3 lg:hidden">
            <ShieldIcon />
            <span className="text-2xl font-bold">Vera</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold">Crear cuenta</h2>
            <p className="text-gray-400 mt-2">
              Completá tus datos para registrarte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Nombre completo</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-4 py-3
                           text-white placeholder-gray-600 focus:outline-none
                           focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-4 py-3
                           text-white placeholder-gray-600 focus:outline-none
                           focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 8 caracteres"
                  required
                  className="w-full bg-[#12141c] border border-white/10 rounded-xl px-4 py-3
                             text-white placeholder-gray-600 focus:outline-none
                             focus:border-blue-500 transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {/* Indicador de fortaleza de contraseña */}
              {form.password.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                      form.password.length >= (i + 1) * 2
                        ? form.password.length < 6 ? 'bg-red-500'
                        : form.password.length < 10 ? 'bg-yellow-500'
                        : 'bg-green-500'
                        : 'bg-white/10'
                    }`} />
                  ))}
                </div>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                         disabled:cursor-not-allowed text-white font-semibold py-3
                         rounded-xl transition-colors"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
        <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <span className="text-gray-400 text-sm">{text}</span>
    </div>
  );
}

// Reutilizamos los mismos íconos del Login
function ShieldIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}