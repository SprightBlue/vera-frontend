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
            <span className="text-[clamp(10px,0.55vw,11px)] font-sans font-bold tracking-wider text-slate-500 uppercase select-none">
                {label}
            </span>
            <div className="relative flex items-center w-full group">
                <Search className="absolute left-4 text-slate-500 group-focus-within:text-slate-200 transition-colors duration-200 w-[clamp(13px,0.65vw,16px)] h-[clamp(13px,0.65vw,16px)] z-10 stroke-2" />

                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="h-9 w-full bg-linear-to-b from-[#080d20] to-[#040714] border border-[#161f37] rounded-lg pl-10 pr-4
                    text-[clamp(12px,0.75vw,14px)] font-sans font-semibold tracking-wide text-slate-200 placeholder:text-slate-600 uppercase outline-hidden
                    ring-1 ring-inset ring-[#161f35]/20 shadow-lg shadow-black/30 transition-all duration-200
                    hover:border-[#222f50] focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/10"
                />
            </div>
        </form>
    );
}