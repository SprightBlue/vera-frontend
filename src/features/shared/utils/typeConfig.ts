import { type RiskLevel } from '@/features/alerts/api/alertsApi.ts';
import { type ToggleOption } from '@/features/shared/components/FilterToggleGroup';
import { type UIVariant } from '@/features/shared/utils/styleConfig';

export type UIVariantType = UIVariant;

export type NotificationType = 'ALERT' | 'ALERT_SOLVED' | 'INVITATION' | 'INVITATION_ACCEPTED' | 'INVITATION_REJECTED';

interface NotificationTypeConfig {
    variant: UIVariant;
}

export const NOTIFICATION_MAP: Record<NotificationType, NotificationTypeConfig> = {
    ALERT: { variant: 'danger' },
    ALERT_SOLVED: { variant: 'success' },
    INVITATION: { variant: 'warning' },
    INVITATION_ACCEPTED: { variant: 'info' },
    INVITATION_REJECTED: { variant: 'purple' }
};

export const RISK_VARIANT_MAP: Record<RiskLevel, UIVariantType> = {
    HIGH: 'danger',
    MEDIUM: 'warning',
    LOW: 'success'
};

export const RISK_LABELS_ES: Record<RiskLevel, string> = {
    HIGH: 'Alto',
    MEDIUM: 'Medio',
    LOW: 'Bajo'
};

export const getRiskVariant = (level?: RiskLevel): UIVariantType => {
    if (!level) return 'success';
    return RISK_VARIANT_MAP[level] || 'success';
};

export const STATUS_FILTER_OPTIONS: ToggleOption<'PENDING' | 'RESOLVED'>[] = [
    { value: 'PENDING', label: 'Pendientes', variant: 'warning' },
    { value: 'RESOLVED', label: 'Resueltas', variant: 'success' }
];

export const RISK_FILTER_OPTIONS: ToggleOption<RiskLevel>[] = [
    { value: 'LOW', label: 'Bajo', variant: 'success' },
    { value: 'MEDIUM', label: 'Medio', variant: 'warning' },
    { value: 'HIGH', label: 'Alto', variant: 'danger' }
];