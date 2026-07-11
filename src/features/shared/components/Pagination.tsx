import { ChevronLeft, ChevronRight } from 'lucide-react';
import { UI_TOGGLE_STYLES, UI_TOGGLE_INACTIVE, UI_VARIANTS_MAP } from '@/features/shared/utils/styleConfig';

interface PaginationProps {
    page: number;
    totalPages: number;
    totalElements: number;
    loading: boolean;
    onPageChange: (newPage: number) => void;
    onForceLoading: () => void;
}

export function Pagination({ page, totalPages, loading, onPageChange, onForceLoading }: PaginationProps) {
    const handlePageClick = (targetPage: number) => {
        if (targetPage !== page && !loading) {
            onForceLoading();
            onPageChange(targetPage);
        }
    };

    const getVisiblePages = () => {
        const visibleRange = 1;
        const pages: (number | string)[] = [];

        for (let i = 0; i < totalPages; i++) {
            if (
                i === 0 ||
                i === totalPages - 1 ||
                (i >= page - visibleRange && i <= page + visibleRange)
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    };

    const visiblePages = getVisiblePages();

    const infoConfig = UI_VARIANTS_MAP.info;
    const neutralConfig = UI_VARIANTS_MAP.neutral;

    return (
        <div className="flex items-center justify-between mt-auto pt-[clamp(1rem,1.2vw,2rem)] border-t border-[#182033]/40 select-none w-full mx-auto max-w-7xl">
            <span className="text-[clamp(9px,0.55vw,11px)] text-slate-500 font-sans font-bold tracking-wider uppercase">
                Página {page + 1} de {Math.max(1, totalPages)}
            </span>

            <div className="flex items-center gap-1.5">
                <button
                    disabled={page <= 0 || loading}
                    onClick={() => handlePageClick(page - 1)}
                    className={`p-2 border rounded-lg transition-all duration-300 active:scale-[0.95] disabled:scale-100 disabled:opacity-10 disabled:cursor-not-allowed h-8 min-w-8 flex items-center justify-center shadow-md relative group overflow-hidden ${UI_TOGGLE_INACTIVE}`}
                >
                    <div className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-300 z-10 via-transparent group-hover:${neutralConfig.laserColor}/20`} />
                    <div className={`absolute -top-4 -right-4 w-8 h-8 rounded-full filter blur-sm pointer-events-none transform origin-top-right transition-all duration-500 ease-out opacity-0 scale-75 ${neutralConfig.glowColor} group-hover:opacity-10 group-hover:scale-125`} />
                    <ChevronLeft className="text-slate-400 group-hover:text-slate-200 relative z-10 w-3.5 h-3.5" />
                </button>

                {visiblePages.map((item, idx) => {
                    if (item === '...') {
                        return (
                            <span
                                key={`ellipsis-${idx}`}
                                className="text-slate-600 text-[11px] font-sans font-bold tracking-wider px-1.5 cursor-default select-none h-8 flex items-center justify-center animate-pulse"
                            >
                                ...
                            </span>
                        );
                    }

                    const isCurrent = item === page;
                    const currentStyle = isCurrent ? UI_TOGGLE_STYLES.info : UI_TOGGLE_INACTIVE;
                    const currentConfig = isCurrent ? infoConfig : neutralConfig;

                    return (
                        <button
                            key={`page-${item}`}
                            disabled={loading || isCurrent}
                            onClick={() => handlePageClick(item as number)}
                            className={`text-[11px] font-sans font-bold tracking-wider px-3 h-8 min-w-8 rounded-lg border transition-all duration-300 flex items-center justify-center select-none relative group overflow-hidden disabled:opacity-100
                                ${isCurrent
                                ? `${currentStyle} ring-1 ring-inset ring-white/5 cursor-default`
                                : `${currentStyle} cursor-pointer active:scale-[0.95]`
                            }`}
                        >
                            <div className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-300 z-10 ${
                                isCurrent ? `${currentConfig.laserColor}/30` : `via-transparent group-hover:${currentConfig.laserColor}/20`
                            }`} />

                            <div className={`absolute -top-4 -right-4 w-8 h-8 rounded-full filter blur-sm pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 ${
                                isCurrent
                                    ? `opacity-20 scale-110 ${currentConfig.glowColor}`
                                    : `opacity-0 scale-75 ${currentConfig.glowColor} group-hover:opacity-10 group-hover:scale-125`
                            }`} />

                            <span className="relative z-10">{(item as number) + 1}</span>
                        </button>
                    );
                })}

                <button
                    disabled={page >= totalPages - 1 || totalPages <= 1 || loading}
                    onClick={() => handlePageClick(page + 1)}
                    className={`p-2 border rounded-lg transition-all duration-300 active:scale-[0.95] disabled:scale-100 disabled:opacity-10 disabled:cursor-not-allowed h-8 min-w-8 flex items-center justify-center shadow-md relative group overflow-hidden ${UI_TOGGLE_INACTIVE}`}
                >
                    <div className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-300 z-10 via-transparent group-hover:${neutralConfig.laserColor}/20`} />
                    <div className={`absolute -top-4 -right-4 w-8 h-8 rounded-full filter blur-sm pointer-events-none transform origin-top-right transition-all duration-500 ease-out opacity-0 scale-75 ${neutralConfig.glowColor} group-hover:opacity-10 group-hover:scale-125`} />
                    <ChevronRight className="text-slate-400 group-hover:text-slate-200 relative z-10 w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}