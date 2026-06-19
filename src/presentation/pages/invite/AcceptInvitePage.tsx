import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, AlertTriangle, Clock, CheckCircle2, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../../infrastructure/api/auth.repository";

interface InvitationDetails {
    id: number;
    protectedFullName: string;
    carerFullName: string;
    relationship: string;
}

type PageState = "loading" | "ready" | "expired" | "accepted" | "error";

export default function AcceptInvitePage() {
    const { token } = useParams<{ token: string }>();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [state, setState] = useState<PageState>("loading");
    const [details, setDetails] = useState<InvitationDetails | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [accepting, setAccepting] = useState(false);

    useEffect(() => {
        if (!token) { setState("error"); return; }

        apiClient.get<InvitationDetails>(`/api/v1/trust/invite/${token}`)
            .then(res => {
                setDetails(res.data);
                setState("ready");
            })
            .catch((err: unknown) => {
                const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "";
                if (msg.includes("expirado") || msg.includes("expired")) {
                    setState("expired");
                } else if (msg.includes("utilizada") || msg.includes("aceptada")) {
                    setState("accepted");
                } else {
                    setState("error");
                    setErrorMsg(msg || "El enlace de invitación no es válido.");
                }
            });
    }, [token]);

    const handleAccept = async () => {
        if (!token) return;
        if (!isAuthenticated) {
            // Guardar el token y redirigir al login
            sessionStorage.setItem("pendingInviteToken", token);
            navigate("/login?redirect=/invite/" + token);
            return;
        }
        setAccepting(true);
        try {
            await apiClient.post(`/api/v1/trust/invite/${token}/accept`);
            setState("accepted");
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? null;
            setErrorMsg(msg ?? "No se pudo aceptar la invitación. Intentá de nuevo.");
        } finally {
            setAccepting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050816] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <ShieldCheck size={28} className="text-blue-400" />
                    <span className="text-white text-2xl font-bold tracking-tight">VERA</span>
                </div>

                <div className="bg-[#070B1A] border border-[#182033] rounded-2xl p-8 flex flex-col gap-6">

                    {/* Loading */}
                    {state === "loading" && (
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-400 text-sm">Verificando invitación...</p>
                        </div>
                    )}

                    {/* Lista para aceptar */}
                    {state === "ready" && details && (
                        <>
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="p-3 rounded-2xl bg-blue-500/10">
                                    <ShieldCheck size={32} className="text-blue-400" />
                                </div>
                                <h1 className="text-white text-xl font-bold">Invitación de confianza</h1>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    <span className="text-white font-medium">{details.carerFullName}</span> te invitó a ser contacto de confianza.
                                    VERA podrá notificarte ante situaciones de alto riesgo.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#0d1526] border border-white/5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Invitado por</span>
                                    <span className="text-white font-medium">{details.carerFullName}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Relación</span>
                                    <span className="text-white font-medium">{details.relationship}</span>
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    <AlertTriangle size={14} className="flex-shrink-0" />
                                    {errorMsg}
                                </div>
                            )}

                            {isAuthenticated ? (
                                <button
                                    onClick={() => void handleAccept()}
                                    disabled={accepting}
                                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {accepting ? (
                                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Aceptando...</>
                                    ) : (
                                        <><CheckCircle2 size={16} /> Aceptar invitación</>
                                    )}
                                </button>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <p className="text-slate-400 text-sm text-center">
                                        Necesitás iniciar sesión para aceptar la invitación.
                                    </p>
                                    <button
                                        onClick={() => void handleAccept()}
                                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        <LogIn size={16} />
                                        Iniciar sesión para aceptar
                                    </button>
                                    <Link
                                        to={`/register?redirect=/invite/${token}`}
                                        className="w-full py-3 rounded-xl border border-[#182033] text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-all text-center text-sm"
                                    >
                                        Crear cuenta en VERA
                                    </Link>
                                </div>
                            )}
                        </>
                    )}

                    {/* Aceptada exitosamente */}
                    {state === "accepted" && (
                        <div className="flex flex-col items-center gap-4 text-center py-4">
                            <div className="p-3 rounded-2xl bg-green-500/10">
                                <CheckCircle2 size={36} className="text-green-400" />
                            </div>
                            <h2 className="text-white text-lg font-bold">¡Invitación aceptada!</h2>
                            <p className="text-slate-400 text-sm">
                                Ahora sos contacto de confianza. VERA te notificará si se detecta una situación de riesgo.
                            </p>
                            <Link
                                to="/dashboard"
                                className="mt-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all"
                            >
                                Ir al Dashboard
                            </Link>
                        </div>
                    )}

                    {/* Expirada */}
                    {state === "expired" && (
                        <div className="flex flex-col items-center gap-4 text-center py-4">
                            <div className="p-3 rounded-2xl bg-yellow-500/10">
                                <Clock size={36} className="text-yellow-400" />
                            </div>
                            <h2 className="text-white text-lg font-bold">Invitación expirada</h2>
                            <p className="text-slate-400 text-sm">
                                El enlace ya no es válido. Pedile al cuidador que genere una nueva invitación.
                            </p>
                        </div>
                    )}

                    {/* Error genérico */}
                    {state === "error" && (
                        <div className="flex flex-col items-center gap-4 text-center py-4">
                            <div className="p-3 rounded-2xl bg-red-500/10">
                                <AlertTriangle size={36} className="text-red-400" />
                            </div>
                            <h2 className="text-white text-lg font-bold">Enlace inválido</h2>
                            <p className="text-slate-400 text-sm">
                                {errorMsg ?? "Este enlace de invitación no existe o ya fue utilizado."}
                            </p>
                            <Link
                                to="/login"
                                className="mt-2 px-6 py-2.5 rounded-xl border border-[#182033] text-slate-300 hover:text-white text-sm font-medium transition-all"
                            >
                                Ir al login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
