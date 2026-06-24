import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserCircle, Shield } from 'lucide-react';
import { authRepository } from '../../infrastructure/api/auth.repository';
import toast from 'react-hot-toast'; 
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

    } catch{
      toast.error('No se pudo crear la cuenta. Intentá nuevamente.');
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
            className="w-[185px] mb-8"
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
      <div className="w-full lg:w-1/2 flex items-center justify-center px-14 py-10 overflow-y-auto">
        <div className="w-full max-w-[420px]">

          <h2 className="text-[44px] font-bold mb-3">
            Crear cuenta
          </h2>

          <p className="text-gray-400 mb-8">
            Completá tus datos para comenzar
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* SELECCIÓN DE ROL */}
            <div className="space-y-3 mb-6">
              <label className="block font-medium text-sm text-gray-300">¿Cómo vas a usar VERA?</label>
              <div className="grid grid-cols-2 gap-3">
                
                {/* Botón Cuidador */}
                <div 
                  onClick={() => setSelectedRole('CARER')}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                    selectedRole === 'CARER' 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-white/10 bg-[#12141C] hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className={selectedRole === 'CARER' ? 'text-blue-500' : 'text-gray-400'} size={20} />
                    <span className={`font-semibold ${selectedRole === 'CARER' ? 'text-blue-500' : 'text-gray-300'}`}>
                      Protector
                    </span>
                  </div>
                  {selectedRole === 'CARER' && (
                    <p className="text-xs text-blue-200/70 mt-2 leading-relaxed animate-fade-in">
                      Monitoreá alertas, configurá sensibilidades y cuidá a las personas que te importan.
                    </p>
                  )}
                </div>

                {/* Botón Protegido */}
                <div 
                  onClick={() => setSelectedRole('PROTECTED')}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                    selectedRole === 'PROTECTED' 
                    ? 'border-emerald-500 bg-emerald-500/10' 
                    : 'border-white/10 bg-[#12141C] hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <UserCircle className={selectedRole === 'PROTECTED' ? 'text-emerald-500' : 'text-gray-400'} size={20} />
                    <span className={`font-semibold ${selectedRole === 'PROTECTED' ? 'text-emerald-500' : 'text-gray-300'}`}>
                      Protegido
                    </span>
                  </div>
                  {selectedRole === 'PROTECTED' && (
                    <p className="text-xs text-emerald-200/70 mt-2 leading-relaxed animate-fade-in">
                      Recibí asistencia automática ante estafas y mantené contacto directo con tus cuidadores.
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* RESTO DEL FORMULARIO */}
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

            <label className="flex items-start gap-3 text-sm text-gray-400 cursor-pointer pt-2">
              <input
                type="checkbox"
                className="mt-1 cursor-pointer"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <span>
                Acepto los{' '}
                <Link to="/terms" className="text-blue-500 underline">
                  términos y condiciones
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 mt-4 rounded-2xl bg-[#0D6EFD] cursor-pointer hover:bg-[#0B5ED7] transition-all duration-300 font-semibold"
            >
              {loading ? 'Creando...' : 'Crear cuenta'}
            </button>

            <p className="text-center text-sm text-gray-400 mt-8 pb-4">
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
      <label className="block mb-2 font-medium text-sm text-gray-300">{label}</label>
      <input
        {...props}
        className="w-full h-14 rounded-2xl px-5 bg-[#12141C] border border-white/10 focus:outline-none focus:border-blue-500 transition-colors"
      />
    </div>
  );
}

function PasswordInput({ label, show, setShow, ...props }: any) {
  return (
    <div>
      <label className="block mb-2 font-medium text-sm text-gray-300">{label}</label>
      <div className="relative">
        <input
          {...props}
          type={show ? 'text' : 'password'}
          className="w-full h-14 rounded-2xl px-5 pr-14 bg-[#12141C] border border-white/10 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}