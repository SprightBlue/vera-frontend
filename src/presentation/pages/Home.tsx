import { useEffect, useState } from 'react';
import { authRepository } from '../../infrastructure/api/auth.repository';

export default function Home() {
    const [saludo, setSaludo] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [cargando, setCargando] = useState<boolean>(true);

    useEffect(() => {
        authRepository.obtenerHolaMundo()
            .then((data) => {
                setSaludo(data.mensaje);
                setError(null);
            })
            .catch(() => {
                setError("No se pudo establecer conexión con el Backend.");
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 font-sans antialiased selection:bg-indigo-500/30">

            <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl shadow-black/40 ring-1 ring-slate-800 transition-all duration-300 hover:shadow-indigo-950/20 hover:ring-slate-700">

                <div className="text-center">
                    <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20 mb-3">
                        Arquitectura Hexagonal
                    </span>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-100">
                        Vera App
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Estado del puente de comunicación
                    </p>
                </div>

                <div className="my-6 border-t border-slate-800" />

                <div className="flex flex-col items-center justify-center min-h-25">

                    {cargando && (
                        <div className="flex flex-col items-center space-y-3">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                            <p className="text-sm font-medium text-slate-400 animate-pulse">
                                Consultando API remota...
                            </p>
                        </div>
                    )}

                    {!cargando && error && (
                        <div className="rounded-xl bg-red-950/20 p-4 border border-red-900/50 text-center w-full">
                            <div className="flex justify-center text-red-400 mb-2">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-semibold text-red-400">Error de conexión</h3>
                            <p className="mt-1 text-xs text-red-300/80 leading-relaxed">
                                {error}
                            </p>
                            <p className="mt-2 text-[10px] text-red-500/70 font-mono">
                                Comprobá si el backend en Render está activo.
                            </p>
                        </div>
                    )}

                    {!cargando && !error && (
                        <div className="rounded-xl bg-emerald-950/20 p-5 border border-emerald-900/40 text-center w-full">
                            <div className="flex justify-center text-emerald-400 mb-2">
                                <svg className="h-7 w-7 animate-bounce" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                                Respuesta del Servidor
                            </h3>
                            <p className="mt-2 text-base font-semibold text-emerald-200 bg-slate-950/60 py-2 px-3 rounded-lg shadow-inner border border-emerald-500/10">
                                {saludo}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center">
                    <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                        React + Vite + TypeScript + Tailwind
                    </p>
                </div>
            </div>
        </div>
    );
}