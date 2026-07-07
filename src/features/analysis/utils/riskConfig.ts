import { type RiskLevel } from '@/features/alerts/api/alertsApi.ts';

export interface ComprehensiveRiskConfig {
    strokeColor: string;
    textColor: string;
    bgColor: string;
    borderColor: string;
    glowColor: string;
    borderLeft: string;
    hoverBorderLeft: string;
    hoverBorderY: string;
    hoverBorderR: string;
    label: string;
}

export const unifiedRiskConfig: Record<RiskLevel, ComprehensiveRiskConfig> = {
    HIGH: {
        strokeColor: 'stroke-red-500',
        textColor: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        glowColor: 'bg-red-500',
        borderLeft: 'border-l-red-500',
        hoverBorderLeft: 'hover:border-l-red-400',
        hoverBorderY: 'hover:border-y-red-500/40',
        hoverBorderR: 'hover:border-r-red-500/40',
        label: 'Alto'
    },
    MEDIUM: {
        strokeColor: 'stroke-yellow-500',
        textColor: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        glowColor: 'bg-yellow-500',
        borderLeft: 'border-l-yellow-500',
        hoverBorderLeft: 'hover:border-l-yellow-400',
        hoverBorderY: 'hover:border-y-yellow-500/40',
        hoverBorderR: 'hover:border-r-yellow-500/40',
        label: 'Medio'
    },
    LOW: {
        strokeColor: 'stroke-green-500',
        textColor: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        glowColor: 'bg-green-500',
        borderLeft: 'border-l-green-500',
        hoverBorderLeft: 'hover:border-l-green-400',
        hoverBorderY: 'hover:border-y-green-500/40',
        hoverBorderR: 'hover:border-r-green-500/40',
        label: 'Bajo'
    }
};

const defaultRiskConfig: ComprehensiveRiskConfig = {
    strokeColor: 'stroke-slate-700',
    textColor: 'text-slate-400',
    bgColor: 'bg-slate-900/40',
    borderColor: 'border-slate-800',
    glowColor: 'bg-slate-700',
    borderLeft: 'border-l-slate-700',
    hoverBorderLeft: 'hover:border-l-slate-600',
    hoverBorderY: 'hover:border-y-slate-700/40',
    hoverBorderR: 'hover:border-r-slate-700/40',
    label: 'Sin definir'
};

export function getRiskConfig(riskLevel?: string | RiskLevel): ComprehensiveRiskConfig {
    if (!riskLevel) return defaultRiskConfig;

    const normalized = riskLevel.toUpperCase();

    if (normalized === 'HIGH' || normalized === 'ALTO') {
        return unifiedRiskConfig.HIGH;
    }
    if (normalized === 'MEDIUM' || normalized === 'MEDIO') {
        return unifiedRiskConfig.MEDIUM;
    }
    if (normalized === 'LOW' || normalized === 'BAJO') {
        return unifiedRiskConfig.LOW;
    }

    return defaultRiskConfig;
}