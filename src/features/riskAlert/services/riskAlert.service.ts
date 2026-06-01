import {env} from '../../../../../../Desktop/src/config/env.ts';
import type {RiskAlertResponseDto, ContactLinkResponseDto} from '../types/riskAlert.types.ts';

const ALERTS_ENDPOINT = '/api/v1/risk-alerts';

export async function getActiveAlerts(caregiverId: number): Promise<RiskAlertResponseDto[]> {
    const response = await fetch(`${env.apiBaseUrl}${ALERTS_ENDPOINT}/caregiver/${caregiverId}/active`);
    if (!response.ok) {
        throw new Error(`Error al cargar las alertas de riesgo (${response.status})`);
    }
    return await response.json() as RiskAlertResponseDto[];
}

export async function solveAlert(alertId: string): Promise<void> {
    const response = await fetch(`${env.apiBaseUrl}${ALERTS_ENDPOINT}/${alertId}/solve`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Error en el servidor al resolver la alerta (${response.status}). ${errorText}`.trim());
    }
}

export async function getContactLink(alertId: string): Promise<ContactLinkResponseDto> {
    const response = await fetch(`${env.apiBaseUrl}${ALERTS_ENDPOINT}/${alertId}/contact-link`);
    if (!response.ok) {
        throw new Error(`Error al obtener el enlace de contacto (${response.status})`);
    }
    return await response.json() as ContactLinkResponseDto;
}
