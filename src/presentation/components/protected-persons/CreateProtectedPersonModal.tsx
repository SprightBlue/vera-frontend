import { useState } from "react";
import InviteOptions from "./InviteOptions";
import ProtectedPersonForm from "./ProtectedPersonForm";
import InviteLinkCard from "./InviteLinkCard";

export default function CreateProtectedPersonModal() {
    const [selectedTab, setSelectedTab] = useState<"manual" | "invite">("manual");

    const handleManualSubmit = async (data: any) => {
       console.log("Datos del formulario manual:", data);
       alert("Perfil guardado manual (Aún no conectado al back)");
    };

    return (
        <div className="bg-[#0b1220] p-8 w-full max-w-2xl mx-auto rounded-3xl border border-[#1f2937]">
            {/* Cabecera */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-white text-3xl font-bold">Añadir protegido</h1>
                <button className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>

            {/* Botones selectores */}
            <InviteOptions selected={selectedTab} onChange={setSelectedTab} />

            {/* Contenido dinámico */}
            {selectedTab === "manual" ? (
                <ProtectedPersonForm onSubmit={handleManualSubmit} />
            ) : (
                <InviteLinkCard />
            )}
        </div>
    );
}