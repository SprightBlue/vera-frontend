import type {RiskAlertResponseDto} from '../types/riskAlert.types.ts';

type Props = {
    alert: RiskAlertResponseDto;
    onSelect: (alertId: string) => void;
};

function formatRelativeTime(dateString: string): string {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Hace un instante';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
}

export function RiskAlertListItem({alert, onSelect}: Props) {
    return (
        <div
            onClick={() => onSelect(alert.alertId)}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm cursor-pointer transition-colors duration-300 ease-out"
        >
            <div className="flex items-center gap-4">
                <span
                    className="flex h-3 w-3 shrink-0 rounded-full bg-risk-high shadow-[0_0_10px_2px_rgba(239,68,68,0.3)]"/>

                <div>
                    <h3 className="text-sm font-bold text-white">
                        {alert.protectedUserName}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-xl font-inter">
                        {alert.messageContent}
                    </p>
                </div>
            </div>

            <div
                className="flex items-center justify-between sm:justify-end gap-4 border-t border-slate-800/60 pt-3 sm:border-0 sm:pt-0">
                <span
                    className="text-[11px] font-medium text-gray-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {alert.source}
                </span>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatRelativeTime(alert.createdAt)}
                </span>
            </div>
        </div>
    );
}
