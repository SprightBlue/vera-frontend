import { CreditCard, Link2, ArrowRightLeft, Download, HelpCircle } from "lucide-react";
import { INCIDENT_TYPE_CONFIG } from "../utils/incidentConfig";

export function StatusBadge({ status }: { status: string }) {
    if (status === "COMPLETED") {
        return (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Completado
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            En progreso
        </span>
    );
}

const TYPE_ICONS: Record<string, React.ElementType> = {
    SHARED_PERSONAL_OR_BANKING_DATA: CreditCard,
    CLICKED_SUSPICIOUS_LINK: Link2,
    TRANSFERRED_MONEY: ArrowRightLeft,
    DOWNLOADED_FILE_OR_APP: Download,
    OTHER_NOT_SURE: HelpCircle,
};

export function TypeChip({ actionType }: { actionType: string }) {
    const cfg = INCIDENT_TYPE_CONFIG[actionType] ?? INCIDENT_TYPE_CONFIG.OTHER_NOT_SURE;
    const Icon = TYPE_ICONS[actionType] ?? HelpCircle;
    return (
        <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-full border whitespace-nowrap ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            <Icon size={11} />
            {cfg.chipLabel}
        </span>
    );
}