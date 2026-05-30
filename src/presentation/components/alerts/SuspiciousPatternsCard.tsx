import { ShieldAlert } from "lucide-react";
import type {RiskConfig} from "./alert-ui.ts";

interface SuspiciousPatternsCardProps {
    patterns: string;
    risk: RiskConfig;
}

function SuspiciousPatternsCard({ patterns, risk }: SuspiciousPatternsCardProps) {
    return (
        <div className="p-6 rounded-2xl bg-[#070B1A] border border-[#182033]">
            <div className="flex items-center gap-2 mb-4">
                <ShieldAlert size={16} className={risk.color} />
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    Patrones Sospechosos Detectados
                </h2>
            </div>
            <div className={`p-4 rounded-xl ${risk.bg} border ${risk.border}`}>
                <p className={`text-sm leading-relaxed ${risk.color}`}>{patterns}</p>
            </div>
        </div>
    );
}

export default SuspiciousPatternsCard;