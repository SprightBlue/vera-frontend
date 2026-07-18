import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserCircle, Shield, Check } from 'lucide-react';
import { authRepository } from '@/presentation/api/auth.repository';
import toast from 'react-hot-toast';
import veraLogo from '../../assets/Isologo_Vera.png';

/* ---------------- FEATURE ROW ---------------- */

const FeatureRow = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => (
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 shrink-0 text-blue-500">
        {icon}
      </div>
      <div>
        <div className="heading-md !text-lg normal-case">{title}</div>
        <div className="text-sm text-gray-400 font-normal">{text}</div>
      </div>
    </div>
);

/* ---------------- REGISTER MAIN ---------------- */

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'CARER' | 'PROTECTED' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      toast.error('Por favor, seleccioná qué tipo de cuenta querés crear.');
      return;
    }

    if (form.password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (!acceptTerms) {
      toast.error('Debes aceptar los términos y condiciones para continuar.');
      return;
    }

    // CORREGIDO: Ahora sí llama a la función del useState correctamente
    setLoading(true);

    try {
      await authRepository.register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: selectedRole,
        acceptedTerms: acceptTerms
      });

      toast.success('¡Cuenta creada! Por favor, revisá tu correo electrónico para verificar tu cuenta.');
      navigate('/login');
    } catch {
      toast.error('No se pudo crear la cuenta. Intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="w-full min-h-screen flex bg-[#05070D] text-white">

        {/* PANEL IZQUIERDO */}
        <div className="hidden lg:flex lg:w-1/2 justify-center bg-[#0B0D17] border-r border-white/5 px-8 xl:px-16">
          <div className="max-w-[520px] w-full py-12 flex flex-col justify-between min-h-screen sticky top-0">
            <div>
              <img
                  src={veraLogo}
                  alt="Vera"
                  className="w-[160px] md:w-[185px] mb-8 lg:mb-12"
              />

              <h1 className="heading-xl normal-case mb-4">
                Únete a miles de usuarios protegidos
              </h1>

              <p className="body-text max-w-[470px]">
                Crea tu cuenta y comienza a recibir protección inteligente contra estafas y phishing en segundos.
              </p>
            </div>

            <div className="w-full mt-6">
              <div className="w-full h-px bg-white/10 mb-6" />
              <div className="space-y-5">
                <FeatureRow
                    icon={<Shield className="w-5 h-5 stroke-[2]" />}
                    title="Protección inmediata"
                    text="Activa desde el primer momento"
                />
                <FeatureRow
                    icon={<Check className="w-5 h-5 stroke-[2.5]" />}
                    title="Sin configuración compleja"
                    text="Funciona automáticamente"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 sm:px-16 md:px-24 lg:px-12 xl:px-20 min-h-screen">
          <div className="w-full max-w-[400px] flex flex-col justify-center">

            {/* Logo Mobile */}
            <img
                src={veraLogo}
                alt="Vera"
                className="w-[130px] mb-4 lg:hidden self-start"
            />

            <h2 className="heading-lg normal-case mb-0.5">
              Crear cuenta
            </h2>

            <p className="body-text !text-gray-400 mb-5">
              Completá tus datos para comenzar
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* SELECCIÓN DE ROL */}
              <div className="flex flex-col gap-1.5 mb-1">
                <label className="text-xs font-semibold tracking-wide text-gray-300">
                  ¿Cómo vas a usar VERA?
                </label>
                <div className="grid grid-cols-2 gap-3">

                  {/* Botón Protector */}
                  <div
                      onClick={() => setSelectedRole('CARER')}
                      className={`cursor-pointer rounded-xl p-3.5 border transition-all select-none flex flex-col justify-start min-h-[105px] ${
                          selectedRole === 'CARER'
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-white/10 bg-[#12141C] hover:border-white/20'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className={selectedRole === 'CARER' ? 'text-blue-500' : 'text-gray-400'} size={16} />
                      <span className={`text-xs font-bold tracking-wide ${selectedRole === 'CARER' ? 'text-blue-400' : 'text-gray-300'}`}>
                                            Protector
                                        </span>
                    </div>
                    <p className={`text-[10.5px] text-blue-200/60 mt-1.5 leading-tight transition-opacity duration-300 ${selectedRole === 'CARER' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                      Monitoreá alertas y cuidá a las personas que te importan.
                    </p>
                  </div>

                  {/* Botón Protegido */}
                  <div
                      onClick={() => setSelectedRole('PROTECTED')}
                      className={`cursor-pointer rounded-xl p-3.5 border transition-all select-none flex flex-col justify-start min-h-[105px] ${
                          selectedRole === 'PROTECTED'
                              ? 'border-emerald-500 bg-emerald-500/10'
                              : 'border-white/10 bg-[#12141C] hover:border-white/20'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCircle className={selectedRole === 'PROTECTED' ? 'text-emerald-500' : 'text-gray-400'} size={16} />
                      <span className={`text-xs font-bold tracking-wide ${selectedRole === 'PROTECTED' ? 'text-emerald-400' : 'text-gray-300'}`}>
                                            Protegido
                                        </span>
                    </div>
                    <p className={`text-[10.5px] text-emerald-200/60 mt-1.5 leading-tight transition-opacity duration-300 ${selectedRole === 'PROTECTED' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                      Recibí asistencia automática y manté contacto.
                    </p>
                  </div>

                </div>
              </div>

              {/* INPUTS */}
              <Input
                  label="Nombre completo"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
              />

              <Input
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
              />

              <PasswordInput
                  label="Contraseña"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  show={showPassword}
                  setShow={setShowPassword}
                  required
              />

              <PasswordInput
                  label="Confirmar Contraseña"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  show={showConfirm}
                  setShow={setShowConfirm}
                  required
              />

              {/* TÉRMINOS Y CONDICIONES */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-white/10 bg-[#12141C] text-blue-500 focus:ring-0 accent-blue-500 cursor-pointer shrink-0"
                />
                <label htmlFor="acceptTerms" className="text-xs text-gray-400 select-none cursor-pointer leading-tight">
                  Acepto los{' '}
                  <Link to="/terms" className="text-blue-500 font-medium hover:text-blue-400 transition-colors underline">
                    términos y condiciones
                  </Link>
                </label>
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 sm:h-12 rounded-xl bg-[#0D6EFD] font-semibold text-sm cursor-pointer hover:bg-[#0B5ED7] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/10 active:scale-[0.99]"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4 pt-1">
                ¿Ya tenés cuenta?{' '}
                <Link to="/login" className="text-blue-500 font-semibold hover:text-blue-400 transition-colors">
                  Iniciar sesión
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
  );
}

/* ---------------- INTERFACES Y COMPONENTES REUTILIZABLES ---------------- */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Input({ label, ...props }: InputProps) {
  return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold tracking-wide text-gray-200">{label}</label>
        <input
            {...props}
            className="w-full h-10 sm:h-11 rounded-xl px-4 bg-[#12141C] border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
        />
      </div>
  );
}

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  show: boolean;
  setShow: (show: boolean) => void;
}

function PasswordInput({ label, show, setShow, ...props }: PasswordInputProps) {
  return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold tracking-wide text-gray-200">{label}</label>
        <div className="relative flex items-center">
          <input
              {...props}
              type={show ? 'text' : 'password'}
              className="w-full h-10 sm:h-11 rounded-xl px-4 pr-12 bg-[#12141C] border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-2 z-10 focus:outline-none flex items-center justify-center"
              title={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
  );
}