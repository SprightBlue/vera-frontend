import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authRepository } from '../../infrastructure/api/auth.repository';
import veraLogo from '../../assets/Isologo_Vera.png';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando tu cuenta...');

  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No se encontró ningún token de verificación.');
      return;
    }

    const verify = async () => {
      if (hasAttempted.current) return;
      
      hasAttempted.current = true;

      try {
        await authRepository.verifyEmail(token);
        setStatus('success');
        setMessage('¡Cuenta verificada con éxito! Ya podés acceder a VERA.');
      } catch (error: any) {
        setStatus('error');
        setMessage('El enlace es inválido o ya expiró.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#05070D] text-white px-4">
      <img src={veraLogo} alt="Vera" className="w-[150px] mb-8" />
      
      <div className="bg-[#0B0D17] border border-white/10 p-8 rounded-2xl max-w-[400px] w-full text-center">
        {status === 'loading' && (
          <div className="animate-pulse text-blue-400 font-medium">
            Procesando tu verificación...
          </div>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 className="text-xl font-bold mb-2">¡Todo listo!</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            <Link to="/login" className="block w-full h-12 leading-[3rem] rounded-xl bg-[#0D6EFD] font-medium hover:bg-[#0B5ED7] transition-all">
              Ir a Iniciar Sesión
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Ups, algo falló</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            <Link to="/register" className="block w-full h-12 leading-[3rem] rounded-xl bg-white/10 font-medium hover:bg-white/20 transition-all">
              Volver al registro
            </Link>
          </>
        )}
      </div>
    </div>
  );
}