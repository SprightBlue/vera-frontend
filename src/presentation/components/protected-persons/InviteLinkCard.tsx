import { useState } from "react";
import { apiClient } from "../../../infrastructure/api/auth.repository";

export default function InviteLinkCard() {
    const [loading, setLoading] = useState(false);
    const [inviteLink, setInviteLink] = useState<string | null>(null);

    async function handleGenerateLink() {
        setLoading(true);
        try {
            const payload = {
                fullName: "Invitado",
                relationship: "Familiar",
                sensitivityLevel: "ALTO"
            };

            const response = await apiClient.post('/api/v1/trust/invite', payload);
            setInviteLink(response.data.invitationLink);
            
        } catch (error) {
            console.error("Error al generar el link:", error);
            alert("No se pudo generar el enlace. Revisá la consola.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-6 mt-6 w-full">
            {!inviteLink ? (
                <button
                    onClick={handleGenerateLink}
                    disabled={loading}
                    className="
                        w-full px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 
                        transition-colors text-white font-semibold text-lg shadow-lg disabled:opacity-50
                    "
                >
                    {loading ? "Generando..." : "Generar enlace seguro"}
                </button>
            ) : (
                <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
                    <p className="text-slate-300 mb-3 font-medium">¡Enlace generado exitosamente!</p>
                    <div className="flex gap-3">
                        <input 
                            type="text" 
                            readOnly 
                            value={inviteLink} 
                            className="w-full bg-[#0b1220] border border-[#1e293b] rounded-xl px-4 py-3 text-white outline-none"
                        />
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(inviteLink);
                                alert("¡Copiado al portapapeles!");
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                        >
                            Copiar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}