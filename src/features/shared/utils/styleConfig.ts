export interface CoreUIStyleConfig {
    borderLeft: string;
    permanentBorder: string;
    hoverBorders: string;
    glowColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
}

export type UIVariant = 'danger' | 'success' | 'warning' | 'info' | 'purple' | 'neutral';

export const UI_VARIANTS_MAP: Record<UIVariant, CoreUIStyleConfig> = {
    danger: {
        borderLeft: 'border-l-red-500',
        permanentBorder: 'border-red-500/40',
        hoverBorders: 'hover:border-y-red-500/40 hover:border-r-red-500/40 active:border-y-red-500/60 active:border-r-red-500/60',
        glowColor: 'bg-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        textColor: 'text-red-400'
    },
    success: {
        borderLeft: 'border-l-emerald-500',
        permanentBorder: 'border-emerald-500/40',
        hoverBorders: 'hover:border-y-emerald-500/40 hover:border-r-emerald-500/40 active:border-y-emerald-500/60 active:border-r-emerald-500/60',
        glowColor: 'bg-emerald-500',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20',
        textColor: 'text-emerald-400'
    },
    warning: {
        borderLeft: 'border-l-amber-500',
        permanentBorder: 'border-amber-500/40',
        hoverBorders: 'hover:border-y-amber-500/40 hover:border-r-amber-500/40 active:border-y-amber-500/60 active:border-r-amber-500/60',
        glowColor: 'bg-amber-500',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/20',
        textColor: 'text-amber-400'
    },
    info: {
        borderLeft: 'border-l-blue-500',
        permanentBorder: 'border-blue-500/40',
        hoverBorders: 'hover:border-y-blue-500/40 hover:border-r-blue-500/40 active:border-y-blue-500/60 active:border-r-blue-500/60',
        glowColor: 'bg-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        textColor: 'text-blue-400'
    },
    purple: {
        borderLeft: 'border-l-fuchsia-500',
        permanentBorder: 'border-fuchsia-500/40',
        hoverBorders: 'hover:border-y-fuchsia-500/40 hover:border-r-fuchsia-500/40 active:border-y-fuchsia-500/60 active:border-r-fuchsia-500/60',
        glowColor: 'bg-fuchsia-500',
        bgColor: 'bg-fuchsia-500/10',
        borderColor: 'border-fuchsia-500/20',
        textColor: 'text-fuchsia-400'
    },
    neutral: {
        borderLeft: 'border-l-slate-500',
        permanentBorder: 'border-slate-500/40',
        hoverBorders: 'hover:border-y-slate-500/40 hover:border-r-slate-500/40 active:border-y-slate-500/60 active:border-r-slate-500/60',
        glowColor: 'bg-slate-500',
        bgColor: 'bg-slate-500/10',
        borderColor: 'border-slate-500/20',
        textColor: 'text-slate-400'
    }
};

export const UI_BUTTON_STYLES: Record<UIVariant, string> = {
    danger: 'bg-red-600 hover:bg-red-500 shadow-red-600/10',
    success: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10',
    warning: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/10',
    info: 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/10',
    purple: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/10',
    neutral: 'bg-slate-600 hover:bg-slate-500 shadow-slate-600/10'
};

export const UI_TOGGLE_STYLES: Record<UIVariant, string> = {
    danger: 'bg-red-500/10 border-red-500/40 text-red-400 shadow-md shadow-red-500/5',
    success: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-500/5',
    warning: 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-md shadow-amber-500/5',
    info: 'bg-blue-500/10 border-blue-500/40 text-blue-400 shadow-md shadow-blue-500/5',
    purple: 'bg-fuchsia-500/10 border-fuchsia-500/40 text-fuchsia-400 shadow-md shadow-fuchsia-500/5',
    neutral: 'bg-slate-500/10 border-slate-500/40 text-slate-400 shadow-md shadow-slate-500/5'
};

export const UI_TOGGLE_INACTIVE = 'bg-[#0a0f24]/40 border-[#182033] text-slate-400 hover:text-slate-200 hover:bg-[#131b35]/20';