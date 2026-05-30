import React from 'react';
import AlertsList from "../components/dashboard/RecentAlerts";

export default function Home() {
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
                        Sistema de Monitoreo de Seguridad
                    </p>
                </div>

                <div className="my-6 border-t border-slate-800" />

                <div className="flex flex-col items-center justify-center min-h-25">
                    <div className="rounded-xl bg-emerald-950/20 p-5 border border-emerald-900/40 text-center w-full">
                        <div className="flex justify-center text-emerald-400 mb-2">
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            Estado del Sistema
                        </h3>
                        <p className="mt-2 text-base font-semibold text-emerald-200 bg-slate-950/60 py-2 px-3 rounded-lg shadow-inner border border-emerald-500/10">
                            ¡Bienvenido a VERA!
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                        React + Vite + TypeScript + Tailwind
                    </p>
                </div>
                
                <div className="mt-4">
                    <AlertsList />
                </div>
            </div>
        </div>
    );
}