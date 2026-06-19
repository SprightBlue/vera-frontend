export interface RiskVisuals {
    strokeColor: string;
    textColor: string;
    bgColor: string;
    borderColor: string;
    label: string;
}

export function getRiskConfig(riskLevel?: string): RiskVisuals {
    switch (riskLevel?.toUpperCase()) {
        case 'BAJO':
        case 'LOW':
            return {
                strokeColor: 'stroke-green-500',
                textColor: 'text-green-400',
                bgColor: 'bg-green-500/10',
                borderColor: 'border-green-500/20',
                label: 'Riesgo Bajo',
            };
        case 'MEDIO':
        case 'MEDIUM':
            return {
                strokeColor: 'stroke-yellow-500',
                textColor: 'text-yellow-400',
                bgColor: 'bg-yellow-500/10',
                borderColor: 'border-yellow-500/20',
                label: 'Riesgo Medio',
            };
        case 'ALTO':
        case 'HIGH':
            return {
                strokeColor: 'stroke-red-500',
                textColor: 'text-red-400',
                bgColor: 'bg-red-500/10',
                borderColor: 'border-red-500/20',
                label: 'Riesgo Alto',
            };
        default:
            return {
                strokeColor: 'stroke-slate-700',
                textColor: 'text-slate-400',
                bgColor: 'bg-slate-900/40',
                borderColor: 'border-slate-800',
                label: 'Sin definir',
            };
    }
}