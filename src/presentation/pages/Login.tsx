import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authRepository } from '../../infrastructure/api/auth.repository';
import { useAuth } from '../context/AuthContext';
import veraLogo from '../../assets/Isologo_Vera.png';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';


/* ---------------- ICONOS ---------------- */

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
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  });
};

const handleSubmit = async (
  e: React.FormEvent
) => {

  e.preventDefault();

  try {

    const data =
  await authRepository.login(form);

login(
  data,
  rememberMe
);

navigate('/dashboard');

  } catch {

    alert(
      'Email o contraseña incorrectos'
    );
  }
};

const handleGoogleSuccess = async (
  credentialResponse: CredentialResponse
) => {

  try {

    if (!credentialResponse.credential) {

      throw new Error(
        'No se recibió credential'
      );
    }

    const data =
  await authRepository.googleLogin(
    credentialResponse.credential
  );

login(
  data,
  rememberMe
);

navigate('/dashboard');

  } catch (error) {

    console.error(error);

    alert(
      'Error al iniciar sesión con Google'
    );
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

  <input
    type="checkbox"
    checked={rememberMe}
    onChange={(e) =>
      setRememberMe(
        e.target.checked
      )
    }
  />

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

          <div className="flex justify-center">

  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() =>
      alert(
        'Error al iniciar sesión con Google'
      )
    }
    theme="filled_black"
    shape="pill"
    size="large"
    text="continue_with"
  />

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


