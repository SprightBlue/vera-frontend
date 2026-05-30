export const RISK_CONFIG = {
    HIGH: {
        label: "Alto Riesgo",
        color: "text-red-400",
        border: "border-red-500/30",
        bg: "bg-red-500/10",
        badge: "bg-red-500/20 text-red-400 border border-red-500/30",
        ring: "#EF4444",
        percent: 85,
    },
    MEDIUM: {
        label: "Riesgo Medio",
        color: "text-yellow-400",
        border: "border-yellow-500/30",
        bg: "bg-yellow-500/10",
        badge: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
        ring: "#eab308",
        percent: 50,
    },
    LOW: {
        label: "Bajo Riesgo",
        color: "text-green-400",
        border: "border-green-500/30",
        bg: "bg-green-500/10",
        badge: "bg-green-500/20 text-green-400 border border-green-500/30",
        ring: "#22c55e",
        percent: 20,
    },
    UNDEFINED: {
        label: "Sin Definir",
        color: "text-slate-400",
        border: "border-slate-500/30",
        bg: "bg-slate-500/10",
        badge: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
        ring: "#64748b",
        percent: 0,
    },
} as const;

export type RiskLevel = keyof typeof RISK_CONFIG;

export type RiskConfig = (typeof RISK_CONFIG)[RiskLevel];

export const SOURCE_LABELS: Record<string, string> = {
    WHATSAPP: "WhatsApp",
    TELEGRAM: "Telegram",
    BROWSER: "Navegador Web",
    UNKNOWN: "Ingreso manual",
};