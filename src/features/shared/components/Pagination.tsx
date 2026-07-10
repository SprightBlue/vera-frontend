import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    page: number;
    totalPages: number;
    totalElements: number;
    loading: boolean;
    onPageChange: (newPage: number) => void;
    onForceLoading: () => void;
}

export function Pagination({ page, totalPages, totalElements, loading, onPageChange, onForceLoading }: PaginationProps) {
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

    return (
        <div className="flex items-center justify-between mt-auto pt-[clamp(1rem,1.2vw,2rem)] border-t border-[#182033]/40 select-none w-full mx-auto max-w-7xl">
            <span className="text-[clamp(9px,0.55vw,11px)] text-slate-500 font-black tracking-widest uppercase">
                Página {page + 1} de {Math.max(1, totalPages)} • {totalElements} Elementos
            </span>

            <div className="flex items-center gap-1.5">
                <button
                    disabled={page <= 0 || loading}
                    onClick={() => handlePageClick(page - 1)}
                    className="p-2 bg-linear-to-b from-[#0a0f24] to-[#060a17] hover:bg-[#131b35]/60 border border-[#182033]/80 rounded-lg ring-1 ring-inset ring-[#161f35]/30 transition-all duration-150 active:scale-[0.95] disabled:scale-100 disabled:opacity-10 disabled:cursor-not-allowed cursor-pointer group h-8 min-w-8 flex items-center justify-center shadow-lg shadow-black/20"
                >
                    <ChevronLeft className="text-slate-400 group-hover:text-slate-200 transition-colors w-3.5 h-3.5" />
                </button>

                {visiblePages.map((item, idx) => {
                    if (item === '...') {
                        return (
                            <span
                                key={`ellipsis-${idx}`}
                                className="text-slate-600 text-[11px] font-black tracking-widest px-1.5 cursor-default select-none h-8 flex items-center justify-center animate-pulse"
                            >
                                ...
                            </span>
                        );
                    }

                    const isCurrent = item === page;
                    return (
                        <button
                            key={`page-${item}`}
                            disabled={loading}
                            onClick={() => handlePageClick(item as number)}
                            className={`text-[11px] font-black tracking-widest px-3 h-8 min-w-8 rounded-lg border transition-all duration-150 flex items-center justify-center disabled:opacity-50 select-none
                                ${isCurrent
                                ? "bg-blue-600/10 border-blue-500/40 text-blue-400 shadow-inner shadow-blue-500/10 ring-1 ring-inset ring-blue-500/20 cursor-default"
                                : "bg-linear-to-b from-[#0a0f24] to-[#060a17] hover:from-[#101735] hover:to-[#0a0f24] border-[#182033]/80 ring-1 ring-inset ring-[#161f35]/30 text-slate-400 hover:text-slate-200 shadow-lg shadow-black/20 active:scale-[0.95] cursor-pointer"
                            }`}
                        >
                            {(item as number) + 1}
                        </button>
                    );
                })}

                <button
                    disabled={page >= totalPages - 1 || totalPages <= 1 || loading}
                    onClick={() => handlePageClick(page + 1)}
                    className="p-2 bg-linear-to-b from-[#0a0f24] to-[#060a17] hover:bg-[#131b35]/60 border border-[#182033]/80 rounded-lg ring-1 ring-inset ring-[#161f35]/30 transition-all duration-150 active:scale-[0.95] disabled:scale-100 disabled:opacity-10 disabled:cursor-not-allowed cursor-pointer group h-8 min-w-8 flex items-center justify-center shadow-lg shadow-black/20"
                >
                    <ChevronRight className="text-slate-400 group-hover:text-slate-200 transition-colors w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}