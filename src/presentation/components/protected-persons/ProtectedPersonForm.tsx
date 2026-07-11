import { Info, Settings, User } from "lucide-react";
import { useState } from "react";
import { ActionButton } from "@/features/shared/components/ActionButton";

interface Props {
    onSubmit: (data: {
        fullName: string;
        relationshipType: string;
        phone: string;
        email: string;
        highRiskAlertsEnabled: boolean;
        weeklySummaryEnabled: boolean;
        notificationSensitivity: string;
    }) => void;
    onClose: () => void;
}

function ProtectedPersonForm({ onSubmit, onClose }: Props) {
    const [fullName, setFullName] = useState("");
    const [relationshipType, setRelationshipType] = useState("FAMILY_MEMBER");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [highRiskAlertsEnabled, setHighRiskAlertsEnabled] = useState(true);
    const [weeklySummaryEnabled, setWeeklySummaryEnabled] = useState(false);
    const [notificationSensitivity, setNotificationSensitivity] = useState("MEDIUM");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit({
            fullName,
            relationshipType,
            phone,
            email,
            highRiskAlertsEnabled,
            weeklySummaryEnabled,
            notificationSensitivity
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">
            {/* HEADER */}
            <div>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Configura el perfil de la persona que deseas acompañar y proteger.
                </p>
            </div>

            {/* PERSONAL INFO */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 flex flex-col gap-5">
                <div className="flex gap-2">
                    <User className="w-5 h-5 mt-[3.5px] text-slate-400" />
                    <h3 className="text-white font-semibold text-lg">Información Personal</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-slate-300 text-sm block mb-2">Nombre completo</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Ej. María García"
                            required
                            className="w-full bg-[#0b1220] border border-[#1e293b] rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-slate-300 text-sm block mb-2">Parentesco o relación</label>
                        <select
                            value={relationshipType}
                            onChange={(e) => setRelationshipType(e.target.value)}
                            className="w-full bg-[#0b1220] border border-[#1e293b] rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                        >
                            <option value="FAMILY_MEMBER">Familiar</option>
                            <option value="TRUSTED_CONTACT">Contacto de confianza</option>
                            <option value="PROFESSIONAL">Profesional</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-slate-300 text-sm block mb-2">Número de teléfono</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+54 11 5555 5555"
                            className="w-full bg-[#0b1220] border border-[#1e293b] rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-slate-300 text-sm block mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="correo@email.com"
                            required
                            className="w-full bg-[#0b1220] border border-[#1e293b] rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* PROTECTION SETTINGS */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 flex flex-col gap-6">
                <div className="flex gap-2">
                    <Settings className="w-5 h-5 mt-[3.5px] text-slate-400" />
                    <h3 className="text-white font-semibold text-lg">Configuración de Protección</h3>
                </div>

                {/* HIGH RISK */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium">Alertas de Riesgo Alto</p>
                        <p className="text-slate-400 text-sm">Notificaciones inmediatas ante amenazas.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setHighRiskAlertsEnabled(!highRiskAlertsEnabled)}
                        className={`w-14 h-8 rounded-full transition-all relative cursor-pointer ${
                            highRiskAlertsEnabled ? "bg-blue-600" : "bg-slate-700"
                        }`}
                    >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${
                            highRiskAlertsEnabled ? "left-7" : "left-1"
                        }`} />
                    </button>
                </div>

                {/* WEEKLY SUMMARY */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium">Resúmenes Semanales</p>
                        <p className="text-slate-400 text-sm">Recibir informes consolidados cada semana.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setWeeklySummaryEnabled(!weeklySummaryEnabled)}
                        className={`w-14 h-8 rounded-full transition-all relative cursor-pointer ${
                            weeklySummaryEnabled ? "bg-blue-600" : "bg-slate-700"
                        }`}
                    >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${
                            weeklySummaryEnabled ? "left-7" : "left-1"
                        }`} />
                    </button>
                </div>

                {/* SENSITIVITY */}
                <div>
                    <p className="text-white font-medium mb-2">Sensibilidad de Notificaciones</p>
                    <p className="text-slate-400 text-sm mb-4">Ajusta la frecuencia con la que VERA enviará alertas.</p>
                    <div className="flex gap-3">
                        {["LOW", "MEDIUM", "HIGH"].map((level) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => setNotificationSensitivity(level)}
                                className={`w-[100px] py-2 rounded-full border transition-all cursor-pointer ${
                                    notificationSensitivity === level
                                        ? "bg-blue-600 border-blue-500 text-white"
                                        : "border-[#1f2937] bg-[#0b1220] text-slate-300"
                                }`}
                            >
                                {level === "LOW" ? "Bajo" : level === "MEDIUM" ? "Medio" : "Alto"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between">
                <div className="flex items-start gap-3 text-gray-500 max-w-sm">
                    <Info className="w-6 h-6 text-green-600 mt-1" />
                    <p className="text-md leading-relaxed">
                    Al enviar la invitación, el protegido recibirá una solicitud
                    para instalar VERA.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <ActionButton type="button" variant="neutral" onClick={onClose}>
                        Cancelar
                    </ActionButton>
                    <ActionButton type="submit" variant="info">
                        Enviar Invitación
                    </ActionButton>
                </div>
            </div>
        </form>
    );
}

export default ProtectedPersonForm;