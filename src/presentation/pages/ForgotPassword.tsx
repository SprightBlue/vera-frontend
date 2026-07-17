import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authRepository } from '@/presentation/api/auth.repository';
import veraLogo from '../../assets/Isologo_Vera.png';
import toast from "react-hot-toast";

/* ---------------- ICONOS ---------------- */

const CheckIcon = () => (
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
  </svg>
);

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

export default function ForgotPassword() {

  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      await authRepository.forgotPassword(email);

      setEmailSent(true);

    } catch {

      toast.error("No se pudo enviar el correo de recuperación");
      

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
            Recuperá el acceso
            a tu cuenta
          </h1>

          <p className="text-gray-400 text-[17px] leading-8 mb-10 max-w-[470px]">
            Te enviaremos un enlace seguro para que
            puedas restablecer tu contraseña.
          </p>

          <div className="w-full h-px bg-white/10 mb-8" />

          <div className="space-y-6">

            <FeatureRow
              icon={<ShieldIcon />}
              text="100% Seguro"
              subtext="Enlace temporal protegido"
            />

            <FeatureRow
              icon={<UsersIcon />}
              text="Recuperación rápida"
              subtext="Acceso en pocos minutos"
            />

          </div>

        </div>

      </div>

      {/* DERECHA */}

      <div className="w-full lg:w-1/2 flex items-center justify-center px-14">

        <div className="w-full max-w-[420px]">

          {!emailSent ? (

            <>
              <h2 className="text-[44px] font-bold mb-3">
                Recuperar contraseña
              </h2>

              <p className="text-gray-400 mb-10">
                Ingresá el correo asociado a tu cuenta.
              </p>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                <div>
                  <label className="block mb-2 font-medium">
                    Correo electrónico
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    className="w-full h-14 rounded-2xl px-5 bg-[#12141C] border border-white/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-[#0D6EFD] hover:bg-[#0B5ED7] transition-all"
                >
                  {loading
                    ? 'Enviando...'
                    : 'Enviar enlace'}
                </button>

                <div className="text-center">

                  <Link
                    to="/login"
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Volver al inicio de sesión
                  </Link>

                </div>

              </form>
            </>

          ) : (

            <div className="flex flex-col items-center text-center">

              <div className="w-24 h-24 rounded-full border border-green-500/30 flex items-center justify-center mb-8">
                <CheckIcon />
              </div>

              <h2 className="text-4xl font-bold mb-4">
                Correo enviado
              </h2>

              <p className="text-gray-400 mb-8">
                Revisá tu bandeja de entrada y seguí
                las instrucciones para recuperar tu
                contraseña.
              </p>

              <Link
                to="/login"
                className="bg-[#0D6EFD] px-8 py-3 rounded-xl hover:bg-[#0B5ED7]"
              >
                Volver al Login
              </Link>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}