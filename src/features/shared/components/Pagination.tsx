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
        <div
            className="flex items-center justify-between mt-auto select-none w-full mx-auto"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            {/* Texto informativo fluido y normalizado */}
            <span className="text-[clamp(11px,0.6vw,12px)] text-slate-500 font-medium normal-case tracking-wide">
                Página <span className="font-semibold text-slate-300">{page + 1}</span> de <span className="font-semibold text-slate-300">{Math.max(1, totalPages)}</span>
            </span>

            <div className="flex items-center gap-1.5">
                {/* Botón Anterior */}
                <button
                    disabled={page <= 0 || loading}
                    onClick={() => handlePageClick(page - 1)}
                    className={`p-2 border rounded-lg transition-all duration-200 active:scale-[0.95] disabled:scale-100 disabled:opacity-10 disabled:cursor-not-allowed h-7.5 min-w-7.5 flex items-center justify-center shadow-sm relative group overflow-hidden text-slate-400 hover:text-white ${UI_TOGGLE_INACTIVE}`}
                >
                    <div
                        className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-200 z-10 via-transparent group-hover:${neutralConfig?.laserColor ? `via-${neutralConfig.laserColor}/20` : ''}`}
                    />
                    <div
                        className={`absolute -top-4 -right-4 w-8 h-8 rounded-full filter blur-sm pointer-events-none transform origin-top-right transition-all duration-300 ease-out opacity-0 scale-75 ${neutralConfig.glowColor} group-hover:opacity-10 group-hover:scale-110`}
                    />
                    <ChevronLeft className="text-current relative z-10 w-3.5 h-3.5 transition-colors duration-200" />
                </button>

                {/* Páginas numéricas */}
                {visiblePages.map((item, idx) => {
                    if (item === '...') {
                        return (
                            <span
                                key={`ellipsis-${idx}`}
                                className="text-slate-600 text-[11px] font-medium tracking-wide px-1 cursor-default select-none h-7.5 flex items-center justify-center"
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
                            className={`text-[11px] font-semibold tracking-wide px-2.5 h-7.5 min-w-7.5 rounded-lg border transition-all duration-200 flex items-center justify-center select-none relative group overflow-hidden disabled:opacity-100
                                ${isCurrent
                                ? `${currentStyle} ring-1 ring-inset ring-white/5 cursor-default text-white`
                                : `${currentStyle} cursor-pointer active:scale-[0.95] text-slate-400 hover:text-white`
                            }`}
                        >
                            <div
                                className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-200 z-10 ${
                                    isCurrent ? `${currentConfig.laserColor}/30` : `via-transparent group-hover:${currentConfig.laserColor}/20`
                                }`}
                            />

                            <div
                                className={`absolute -top-4 -right-4 w-8 h-8 rounded-full filter blur-sm pointer-events-none transform origin-top-right transition-all duration-300 ease-out z-0 ${
                                    isCurrent
                                        ? `opacity-20 scale-110 ${currentConfig.glowColor}`
                                        : `opacity-0 scale-75 ${currentConfig.glowColor} group-hover:opacity-10 group-hover:scale-110`
                                }`}
                            />

                            <span className="relative z-10 transition-colors duration-200">
                                {(item as number) + 1}
                            </span>
                        </button>
                    );
                })}

                {/* Botón Siguiente */}
                <button
                    disabled={page >= totalPages - 1 || totalPages <= 1 || loading}
                    onClick={() => handlePageClick(page + 1)}
                    className={`p-2 border rounded-lg transition-all duration-200 active:scale-[0.95] disabled:scale-100 disabled:opacity-10 disabled:cursor-not-allowed h-7.5 min-w-7.5 flex items-center justify-center shadow-sm relative group overflow-hidden text-slate-400 hover:text-white ${UI_TOGGLE_INACTIVE}`}
                >
                    <div
                        className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-200 z-10 via-transparent group-hover:${neutralConfig?.laserColor ? `via-${neutralConfig.laserColor}/20` : ''}`}
                    />
                    <div
                        className={`absolute -top-4 -right-4 w-8 h-8 rounded-full filter blur-sm pointer-events-none transform origin-top-right transition-all duration-300 ease-out opacity-0 scale-75 ${neutralConfig.glowColor} group-hover:opacity-10 group-hover:scale-110`}
                    />
                    <ChevronRight className="text-current relative z-10 w-3.5 h-3.5 transition-colors duration-200" />
                </button>
            </div>
        </div>
    );
}