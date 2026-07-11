export interface CoreUIStyleConfig {
    borderLeft: string;
    permanentBorder: string;
    hoverBorders: string;
    glowColor: string;
    laserColor: string;
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
        laserColor: 'via-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        textColor: 'text-red-300'
    },
    success: {
        borderLeft: 'border-l-emerald-500',
        permanentBorder: 'border-emerald-500/40',
        hoverBorders: 'hover:border-y-emerald-500/40 hover:border-r-emerald-500/40 active:border-y-emerald-500/60 active:border-r-emerald-500/60',
        glowColor: 'bg-emerald-500',
        laserColor: 'via-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        textColor: 'text-emerald-300'
    },
    warning: {
        borderLeft: 'border-l-amber-500',
        permanentBorder: 'border-amber-500/40',
        hoverBorders: 'hover:border-y-amber-500/40 hover:border-r-amber-500/40 active:border-y-amber-500/60 active:border-r-amber-500/60',
        glowColor: 'bg-amber-500',
        laserColor: 'via-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        textColor: 'text-amber-300'
    },
    info: {
        borderLeft: 'border-l-blue-500',
        permanentBorder: 'border-blue-500/40',
        hoverBorders: 'hover:border-y-blue-500/40 hover:border-r-blue-500/40 active:border-y-blue-500/60 active:border-r-blue-500/60',
        glowColor: 'bg-blue-500',
        laserColor: 'via-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        textColor: 'text-blue-300'
    },
    purple: {
        borderLeft: 'border-l-fuchsia-500',
        permanentBorder: 'border-fuchsia-500/40',
        hoverBorders: 'hover:border-y-fuchsia-500/40 hover:border-r-fuchsia-500/40 active:border-y-fuchsia-500/60 active:border-r-fuchsia-500/60',
        glowColor: 'bg-fuchsia-500',
        laserColor: 'via-fuchsia-400',
        bgColor: 'bg-fuchsia-500/10',
        borderColor: 'border-fuchsia-500/30',
        textColor: 'text-fuchsia-300'
    },
    neutral: {
        borderLeft: 'border-l-slate-500',
        permanentBorder: 'border-slate-500/40',
        hoverBorders: 'hover:border-y-slate-500/40 hover:border-r-slate-500/40 active:border-y-slate-500/60 active:border-r-slate-500/60',
        glowColor: 'bg-slate-500',
        laserColor: 'via-slate-400',
        bgColor: 'bg-slate-500/10',
        borderColor: 'border-slate-500/30',
        textColor: 'text-slate-300'
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
    danger: 'bg-red-500/10 border-red-500/30 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.02)]',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.02)]',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.02)]',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.02)]',
    purple: 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.02)]',
    neutral: 'bg-slate-500/10 border-slate-500/30 text-slate-300 shadow-[0_0_15px_rgba(100,116,139,0.02)]'
};

export const UI_TOGGLE_INACTIVE = 'bg-[#080d20]/40 border-transparent text-slate-400 hover:text-white hover:bg-[#0d142c]/60 ring-1 ring-inset ring-[#161f35]/20';