export interface RiskVisuals {
    percentage: number;
    strokeColor: string;
    textColor: string;
    label: string;
}

export function getRiskConfig(riskLevel?: string): RiskVisuals {
    switch (riskLevel?.toUpperCase()) {
        case 'BAJO':
        case 'LOW':
            return {
                percentage: 10,
                strokeColor: 'stroke-[var(--color-risk-low)]',
                textColor: 'text-[var(--color-risk-low)]',
                label: 'Bajo',
            };
        case 'MEDIO':
        case 'MEDIUM':
            return {
                percentage: 50,
                strokeColor: 'stroke-[var(--color-risk-medium)]',
                textColor: 'text-[var(--color-risk-medium)]',
                label: 'Medio',
            };
        case 'ALTO':
        case 'HIGH':
            return {
                percentage: 100,
                strokeColor: 'stroke-[var(--color-risk-high)]',
                textColor: 'text-[var(--color-risk-high)]',
                label: 'Alto',
            };
        default:
            return {
                percentage: 0,
                strokeColor: 'stroke-[var(--color-risk-undefined)]',
                textColor: 'text-[var(--color-risk-undefined)]',
                label: 'Sin definir',
            };
    }
}
