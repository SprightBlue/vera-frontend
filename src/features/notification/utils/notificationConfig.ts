import { type NotifColorConfig } from '@/features/notification/api/notificationsApi';

export function getNotificationConfig(type: string): NotifColorConfig {
    switch (type) {
        case 'ALERT':
            return {
                label: 'Crítico',
                borderLeft: 'border-l-red-500',
                permanentBorder: 'border-red-500/30',
                glowColor: 'bg-red-500',
                bgColor: 'bg-red-500/10',
                borderColor: 'border-red-500/20',
                textColor: 'text-red-400'
            };
        case 'ALERT_SOLVED':
            return {
                label: 'Resuelto',
                borderLeft: 'border-l-emerald-500',
                permanentBorder: 'border-emerald-500/30',
                glowColor: 'bg-emerald-500',
                bgColor: 'bg-emerald-500/10',
                borderColor: 'border-emerald-500/20',
                textColor: 'text-emerald-400'
            };
        case 'INVITATION':
            return {
                label: 'Pendiente',
                borderLeft: 'border-l-amber-500',
                permanentBorder: 'border-amber-500/30',
                glowColor: 'bg-amber-500',
                bgColor: 'bg-amber-500/10',
                borderColor: 'border-amber-500/20',
                textColor: 'text-amber-400'
            };
        case 'INVITATION_ACCEPTED':
            return {
                label: 'Aceptado',
                borderLeft: 'border-l-blue-500',
                permanentBorder: 'border-blue-500/30',
                glowColor: 'bg-blue-500',
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/20',
                textColor: 'text-blue-400'
            };
        case 'INVITATION_REJECTED':
            return {
                label: 'Rechazado',
                borderLeft: 'border-l-fuchsia-500',
                permanentBorder: 'border-fuchsia-500/30',
                glowColor: 'bg-fuchsia-500',
                bgColor: 'bg-fuchsia-500/10',
                borderColor: 'border-fuchsia-500/20',
                textColor: 'text-fuchsia-400'
            };
        default:
            return {
                label: 'Info',
                borderLeft: 'border-l-slate-500',
                permanentBorder: 'border-slate-500/30',
                glowColor: 'bg-slate-500',
                bgColor: 'bg-slate-500/10',
                borderColor: 'border-slate-500/20',
                textColor: 'text-slate-400'
            };
    }
}