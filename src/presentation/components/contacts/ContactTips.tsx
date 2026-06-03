import { Heart, Phone, ShieldCheck } from "lucide-react";

const TIPS = [
    {
        Icon: Heart,
        iconClass: "text-pink-400",
        bg: "bg-pink-500/10",
        title: "Personas cercanas",
        description: "Elegí familiares o amigos que conozcas bien y en quienes confíes plenamente.",
    },
    {
        Icon: Phone,
        iconClass: "text-green-400",
        bg: "bg-green-500/10",
        title: "Disponibilidad",
        description: "Asegurate de que puedan responder rápidamente en caso de emergencia.",
    },
    {
        Icon: ShieldCheck,
        iconClass: "text-blue-400",
        bg: "bg-blue-500/10",
        title: "Conocimiento digital",
        description: "Es útil que entiendan sobre tecnología para ayudarte mejor.",
    },
];

function ContactTips() {
    return (
        <div className="p-6 rounded-2xl bg-[#070B1A] border border-[#182033]">
            <h3 className="text-white font-semibold text-sm mb-5">
                Consejos para elegir contactos de confianza
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {TIPS.map(({ Icon, iconClass, bg, title, description }) => (
                    <div key={title} className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl ${bg} flex-shrink-0`}>
                            <Icon size={18} className={iconClass} />
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium">{title}</p>
                            <p className="text-slate-400 text-xs mt-1 leading-relaxed">{description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ContactTips;