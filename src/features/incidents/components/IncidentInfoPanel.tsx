import { Shield, AlertTriangle, ExternalLink } from "lucide-react";

const RESOURCES = [
    { Icon: Shield, label: "Cómo hacer una denuncia", href: "https://www.argentina.gob.ar/justicia/convosenlaweb/denuncia" },
    { Icon: AlertTriangle, label: "Señales de estafas", href: "https://www.argentina.gob.ar/justicia/convosenlaweb/situaciones/phishing" },
    { Icon: ExternalLink, label: "Consejos de seguridad", href: "https://www.argentina.gob.ar/justicia/convosenlaweb/situaciones/como-proteger-mis-datos-personales" },
];

export function IncidentInfoPanel() {
    return (
        <div className="flex flex-col gap-4">

            <div className="bg-[#070B1A] border border-[#182033] rounded-2xl p-4">
                <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Información útil
                </h3>
                <div className="flex flex-col gap-2">
                    {RESOURCES.map(r => (
                        <a
                            key={r.label}
                            href={r.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#111827] border border-[#182033] hover:border-blue-500/30 transition-colors text-xs text-slate-300 hover:text-white"
                        >
                            <r.Icon size={13} className="text-blue-400 shrink-0" />
                            {r.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}