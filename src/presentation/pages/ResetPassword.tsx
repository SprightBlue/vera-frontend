import { useState, useEffect } from 'react';
import {
  Link,
  useNavigate,
  useSearchParams
} from 'react-router-dom';
import { authRepository } from '../../infrastructure/api/auth.repository';
import veraLogo from '../../assets/Isologo_Vera.png';

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

const SuccessIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 6L9 17L4 12"
      stroke="#22C55E"
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
    <circle
      cx="10"
      cy="9"
      r="3"
      stroke="#0D6EFD"
      strokeWidth="2"
    />
    <path
      d="M20 21V19C20 18.2 19.5 17.5 18.8 17.2"
      stroke="#0D6EFD"
      strokeWidth="2"
    />
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
      <div className="text-lg font-bold text-white">
        {text}
      </div>

      <div className="text-sm text-gray-400">
        {subtext}
      </div>
    </div>

  </div>
);

export default function ResetPassword() {

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get('token') ?? '';

  const [newPassword,
    setNewPassword] = useState('');

  const [confirmPassword,
    setConfirmPassword] = useState('');

  const [showPassword,
    setShowPassword] = useState(false);

  const [showConfirmPassword,
    setShowConfirmPassword] = useState(false);

  const [loading,
    setLoading] = useState(false);

  const [success,
    setSuccess] = useState(false);

  const [error,
    setError] = useState('');

  useEffect(() => {

    if (!success) return;

    const timer = setTimeout(() => {

      navigate('/login');

    }, 3000);

    return () => clearTimeout(timer);

  }, [success, navigate]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError('');

    if (
      newPassword !== confirmPassword
    ) {

      setError(
        'Las contraseñas no coinciden'
      );

      return;
    }

    try {

      setLoading(true);

      await authRepository.resetPassword(
        token,
        newPassword
      );

      setSuccess(true);

    } catch {

      setError(
        'No se pudo actualizar la contraseña'
      );

    } finally {

      setLoading(false);
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
            Protegé tu cuenta
          </h1>

          <p className="text-gray-400 text-[17px] leading-8 mb-10 max-w-[470px]">
            Elegí una contraseña segura para continuar utilizando Vera.
          </p>

          <div className="w-full h-px bg-white/10 mb-8" />

          <div className="space-y-6">

            <FeatureRow
              icon={<ShieldIcon />}
              text="Protección reforzada"
              subtext="Tus credenciales permanecen seguras"
            />

            <FeatureRow
              icon={<CheckIcon />}
              text="Cambio inmediato"
              subtext="La nueva contraseña se aplica al instante"
            />

            <FeatureRow
              icon={<UsersIcon />}
              text="Acceso protegido"
              subtext="Evitá accesos no autorizados"
            />

          </div>

        </div>

      </div>

      {/* DERECHA */}

      <div className="w-full lg:w-1/2 flex items-center justify-center px-14">

        <div className="w-full max-w-[420px]">

          {!success ? (

            <>
              <h2 className="text-[44px] font-bold mb-3">
                Nueva contraseña
              </h2>

              <p className="text-gray-400 mb-10">
                Ingresá una nueva contraseña para tu cuenta.
              </p>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                <div>

                  <label className="block mb-2 font-medium">
                    Nueva contraseña
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      placeholder="Ingresá tu nueva contraseña"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(
                          e.target.value
                        )
                      }
                      required
                      className="w-full h-14 rounded-2xl px-5 pr-14 bg-[#12141C] border border-white/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      👁
                    </button>

                  </div>

                </div>

                <div>

                  <label className="block mb-2 font-medium">
                    Confirmar contraseña
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      placeholder="Confirmá tu nueva contraseña"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      required
                      className="w-full h-14 rounded-2xl px-5 pr-14 bg-[#12141C] border border-white/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      👁
                    </button>

                  </div>

                </div>

                {error && (
                  <div className="text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-[#0D6EFD] hover:bg-[#0B5ED7] transition-all"
                >
                  {
                    loading
                      ? 'Actualizando...'
                      : 'Actualizar contraseña'
                  }
                </button>

                <div className="text-center">

                  <Link
                    to="/login"
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Volver al Login
                  </Link>

                </div>

              </form>
            </>

          ) : (

            <div className="flex flex-col items-center text-center">

              <div className="w-24 h-24 rounded-full border border-green-500/30 flex items-center justify-center mb-8">

                <SuccessIcon />

              </div>

              <h2 className="text-4xl font-bold mb-4">
                Contraseña actualizada
              </h2>

              <p className="text-gray-400 mb-6">
                Tu contraseña fue modificada correctamente.
              </p>

              <p className="text-blue-400">
                Redirigiendo al inicio de sesión...
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}