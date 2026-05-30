import {AlertTriangle} from "lucide-react";
import RiskGauge from "./RiskGauge";
import type {RiskConfig} from "./alert-ui.ts";

interface RiskLevelCardProps {
    risk: RiskConfig;
}

function RiskLevelCard({risk}: RiskLevelCardProps) {
    return (
        <div className="p-6 rounded-2xl bg-[#070B1A] border border-[#182033] flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Nivel de Riesgo
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <RiskGauge percent={risk.percent} color={risk.ring}/>

                <div className="flex flex-col gap-2 min-w-0">
                    <span className={`text-2xl font-bold ${risk.color}`}>
                        {risk.label}
                    </span>
                    <div
                        className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg ${risk.bg} ${risk.color} font-medium w-fit max-w-full break-words`}>
                        <AlertTriangle size={14}/>
                        Este mensaje es probablemente una estafa
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RiskLevelCard;