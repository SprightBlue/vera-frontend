import { type RiskLevel } from '@/features/alerts/api/alertsApi.ts';

export interface RiskStyleConfig {
    bgColor: string;
    borderColor: string;
    textColor: string;
    glowColor: string;
    borderLeft: string;
    hoverBorderLeft: string;
    hoverBorderY: string;
    hoverBorderR: string;
    label: string;
}

export const riskConfigAlert: Record<RiskLevel, RiskStyleConfig> = {
    HIGH: {
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        textColor: 'text-red-400',
        glowColor: 'bg-red-500',
        borderLeft: 'border-l-red-500',
        hoverBorderLeft: 'hover:border-l-red-400',
        hoverBorderY: 'hover:border-y-red-500/40',
        hoverBorderR: 'hover:border-r-red-500/40',
        label: 'Alto'
    },
    MEDIUM: {
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        textColor: 'text-yellow-400',
        glowColor: 'bg-yellow-500',
        borderLeft: 'border-l-yellow-500',
        hoverBorderLeft: 'hover:border-l-yellow-400',
        hoverBorderY: 'hover:border-y-yellow-500/40',
        hoverBorderR: 'hover:border-r-yellow-500/40',
        label: 'Medio'
    },
    LOW: {
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        textColor: 'text-green-400',
        glowColor: 'bg-green-500',
        borderLeft: 'border-l-green-500',
        hoverBorderLeft: 'hover:border-l-green-400',
        hoverBorderY: 'hover:border-y-green-500/40',
        hoverBorderR: 'hover:border-r-green-500/40',
        label: 'Bajo'
    }
};