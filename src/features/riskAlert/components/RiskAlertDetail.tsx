import type {RiskAlertResponseDto} from '../types/riskAlert.types.ts';
import {getContactLink} from '../services/riskAlert.service.ts';

type Props = {
    alert: RiskAlertResponseDto;
    onBack: () => void;
    onSolve: (alertId: string) => void | Promise<void>;
};

export function RiskAlertDetail({alert, onBack, onSolve}: Props) {

    const handleContactClick = async (): Promise<void> => {
        try {
            const data = await getContactLink(alert.alertId);

            if (data && data.link) {
                const emailMatch = data.link.match(/mailto:([^?]+)/);
                const targetEmail = emailMatch ? emailMatch[1] : '';

                const subjectMatch = data.link.match(/subject=([^&]+)/);
                const subject = subjectMatch ? subjectMatch[1] : '';

                const myGmailAccount = 'ttpezrealkaisa@gmail.com';
                const gmailWebUrl = `https://mail.google.com/mail/u/${myGmailAccount}/?view=cm&fs=1&to=${targetEmail}&su=${subject}`;

                window.open(gmailWebUrl, '_blank', 'noopener,noreferrer');
            } else {
                window.alert('El servidor no devolvió un enlace de contacto válido.');
            }
        } catch (error) {
            console.error(error);
            window.alert('No se pudo abrir Gmail.');
        }
    };

    const handleSolveClick = () => {
        if (!alert.alertId) return;
        const result = onSolve(alert.alertId);
        if (result instanceof Promise) {
            result.catch((error) => console.error(error));
        }
    };

    return (
        <div className="relative font-inter space-y-6 analysis-appear transition-all duration-300 ease-out">

            <div
                className="relative rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm pr-12 transition-all duration-300 ease-in-out">

                <button
                    onClick={onBack}
                    className="absolute top-5 right-5 flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer rounded-lg p-1 hover:bg-slate-800/50"
                    title="Volver al listado"
                >
                    <span className="material-symbols-rounded">close</span>
                </button>

                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                        <span className="text-xs text-gray-400">
                            <span className="text-white font-medium">{alert.source}</span>
                        </span>
                        <h2 className="heading-lg mt-2">
                            <span className="text-gray-300 font-normal">{alert.protectedUserName}</span>
                        </h2>
                    </div>
                    <p className="text-xs text-gray-500 self-end lg:pr-4">
                        Detectado: {new Date(alert.createdAt).toLocaleString('es-AR')}
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch mb-6">
                    <div
                        className="lg:col-span-6 rounded-lg border border-slate-800 bg-slate-950 p-5 flex flex-col justify-start">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 font-montserrat">
                            Mensaje Interceptado
                        </p>
                        <p className="text-sm text-white italic leading-relaxed">
                            "{alert.messageContent}"
                        </p>
                    </div>

                    <div
                        className="lg:col-span-6 rounded-lg border border-slate-800 bg-slate-950 p-5 flex flex-col justify-start">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 font-montserrat">
                            Patrones Sospechosos Detectados
                        </p>
                        <p className="text-sm text-white leading-relaxed">
                            {alert.suspiciousPatterns || 'Patrón sospechoso detectado en la comunicación.'}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                    <button
                        onClick={handleContactClick}
                        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition duration-300 ease-in-out hover:brightness-110 active:scale-98 cursor-pointer"
                    >
                        Contactar al Usuario
                    </button>

                    <button
                        onClick={handleSolveClick}
                        className="rounded-lg bg-risk-low px-5 py-2.5 text-sm font-semibold text-white transition duration-300 ease-in-out hover:brightness-110 active:scale-98 shadow-md cursor-pointer"
                    >
                        Marcar como Resuelta
                    </button>
                </div>

            </div>
        </div>
    );
}
