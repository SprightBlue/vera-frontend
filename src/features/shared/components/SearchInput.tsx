import { type ChangeEvent, type SyntheticEvent } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label?: string;
}

export function SearchInput({
                                value,
                                onChange,
                                placeholder = "INGRESÁ EL TEXTO A BUSCAR...",
                                label = "Motor de Búsqueda"
                            }: SearchInputProps) {
    return (
        <form onSubmit={(e: SyntheticEvent) => e.preventDefault()} className="flex flex-col gap-2 md:w-1/2 w-full">
            <span className="text-[clamp(9px,0.55vw,11px)] font-sans font-bold tracking-wider text-slate-500 uppercase select-none">
                {label}
            </span>
            <div className="relative flex items-center w-full group">
                <Search className="absolute left-4 text-slate-500 group-focus-within:text-slate-300 transition-colors w-[clamp(12px,0.6vw,15px)] h-[clamp(12px,0.6vw,15px)] z-10" />
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="h-10 w-full bg-linear-to-b from-[#0a0f24] to-[#060a17] border border-[#182033]/80 rounded-lg pl-10 pr-4
                    text-[clamp(0.82rem,0.88vw,0.95rem)] font-sans font-bold tracking-wider text-slate-200 placeholder:text-slate-600 uppercase outline-hidden
                    ring-1 ring-inset ring-[#161f35]/40 shadow-lg shadow-black/20 transition-all duration-200
                    hover:border-[#222f50] focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 focus:shadow-inner focus:shadow-blue-500/5"
                />
            </div>
        </form>
    );
}