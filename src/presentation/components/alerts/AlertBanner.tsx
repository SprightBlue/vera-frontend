import {ShieldAlert} from "lucide-react";
import {type RiskConfig, SOURCE_LABELS} from "./alert-ui.ts";

interface AlertBannerProps {
    messageSource: string;
    risk: RiskConfig;
}

function AlertBanner({messageSource, risk}: AlertBannerProps) {

    return (
        <div className={`flex items-center gap-4 p-5 rounded-2xl border ${risk.border} ${risk.bg}`}>

            <div className={`p-2 rounded-lg shrink-0 ${risk.bg} ${risk.border} border`}>
                <ShieldAlert size={20} className={risk.color}/>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="text-white font-semibold text-base text-center sm:text-left">
                        Posible estafa detectada
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 uppercase tracking-wide">
                        {SOURCE_LABELS[messageSource] ?? messageSource}
                    </span>
                </div>
            </div>

        </div>
    );
}

export default AlertBanner;