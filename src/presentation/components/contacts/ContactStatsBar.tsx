import { Users, ShieldCheck, Clock } from "lucide-react";

interface Props {
    total: number;
    active: number;
    pending: number;
}

const ITEMS = [
    { key: "total" as const, label: "Total contactos", Icon: Users, color: "text-blue-400",   bg: "bg-blue-500/10" },
    { key: "active" as const, label: "Activos", Icon: ShieldCheck, color: "text-green-400",  bg: "bg-green-500/10" },
    { key: "pending" as const, label: "Pendiente", Icon: Clock, color: "text-purple-400", bg: "bg-purple-500/10" },
];

function ContactStatsBar({ total, active, pending }: Props) {
    const values = { total, active, pending };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ITEMS.map(({ key, label, Icon, color, bg }) => (
                <div key={key} className="flex items-center gap-4 p-4 rounded-2xl bg-[#070B1A] border border-[#182033]">
                    <div className={`p-2.5 rounded-xl ${bg}`}>
                        <Icon size={20} className={color} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{values[key]}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ContactStatsBar;