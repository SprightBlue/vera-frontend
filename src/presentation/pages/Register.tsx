import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authRepository } from '../../infrastructure/api/auth.repository';
import { useAuth } from '../context/AuthContext';
import veraLogo from '../../assets/Isologo_Vera.png';

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

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const data = await authRepository.register({
        fullName: form.fullName,
        email: form.email,
        password: form.password
      });

      login(data);
      navigate('/dashboard');
    } catch {
      setError('No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-[#05070D] text-white">

      {/* IZQUIERDA */}
      <div className="hidden lg:flex w-1/2 justify-center bg-[#0B0D17] border-r border-white/5">
        <div className="max-w-[550px] pt-[100px]">

          <img
            src={veraLogo}
            alt="Vera"
            className="w-[185px]"
          />

          <h1 className="text-[58px] font-bold leading-[1] mb-4 max-w-[550px]">
            Únete a miles de
            usuarios protegidos
          </h1>

          <p className="text-gray-400 text-[17px] leading-8 mb-10 max-w-[470px]">
            Crea tu cuenta y comienza a recibir protección inteligente
            contra estafas y phishing en segundos.
          </p>

          <div className="w-full h-px bg-white/10 mb-8" />

          <div className="space-y-6">

            <Feature
              icon={<ShieldIcon />}
              title="Protección inmediata"
              text="Activa desde el primer momento"
            />

            <Feature
              icon={<CheckIcon />}
              title="Sin configuración compleja"
              text="Funciona automáticamente"
            />

          </div>
        </div>
      </div>

      {/* DERECHA */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-14">
        <div className="w-full max-w-[420px]">

          <h2 className="text-[44px] font-bold mb-3">
            Crear cuenta
          </h2>

          <p className="text-gray-400 mb-10">
            Completá tus datos para comenzar
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <Input
              label="Nombre completo"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />

            <Input
              label="Correo electrónico"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <PasswordInput
              label="Contraseña"
              name="password"
              value={form.password}
              onChange={handleChange}
              show={showPassword}
              setShow={setShowPassword}
            />

            <PasswordInput
              label="Confirmar Contraseña"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              show={showConfirm}
              setShow={setShowConfirm}
            />

            <label className="flex items-start gap-3 text-sm text-gray-400">
              <input type="checkbox" className="mt-1" />
              <span>
                Acepto los términos y condiciones
              </span>
            </label>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-[#0D6EFD]"
            >
              {loading ? 'Creando...' : 'Crear cuenta'}
            </button>

            <p className="text-center text-sm text-gray-400 mt-8">
              ¿Ya tenés cuenta?{' '}
              <Link to="/login" className="text-blue-500">
                Iniciar sesión
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, text }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
        {icon}
      </div>

      <div>
        <div className="text-lg font-bold text-white">{title}</div>
        <div className="text-sm text-gray-400">{text}</div>
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="block mb-2 font-medium">{label}</label>
      <input
        {...props}
        className="w-full h-14 rounded-2xl px-5 bg-[#12141C] border border-white/10"
      />
    </div>
  );
}

function PasswordInput({ label, show, setShow, ...props }: any) {
  return (
    <div>
      <label className="block mb-2 font-medium">{label}</label>

      <div className="relative">
        <input
          {...props}
          type={show ? 'text' : 'password'}
          className="w-full h-14 rounded-2xl px-5 pr-14 bg-[#12141C] border border-white/10"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-5 top-1/2 -translate-y-1/2"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}