import { UI_TOGGLE_STYLES, UI_TOGGLE_INACTIVE, type UIVariant } from '@/features/shared/utils/styleConfig';

export interface ToggleOption<T> {
    value: T;
    label: string;
    variant: UIVariant;
}

interface FilterToggleGroupProps<T> {
    title: string;
    options: ToggleOption<T>[];
    activeValue: T | 'NONE';
    onToggle: (value: T) => void;
}

export function FilterToggleGroup<T extends string>({ title, options, activeValue, onToggle }: FilterToggleGroupProps<T>) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-[clamp(9px,0.55vw,11px)] font-sans font-bold tracking-wider text-slate-500 uppercase select-none">
                {title}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
                {options.map((option) => {
                    const isActive = activeValue === option.value;
                    return (
                        <button
                            key={option.value}
                            onClick={() => onToggle(option.value)}
                            className={`px-4 py-2 rounded-lg border text-[clamp(10px,0.65vw,12px)] font-sans font-bold tracking-wider uppercase 
                            transition-all duration-150 cursor-pointer select-none active:scale-[0.96] shadow-lg shadow-black/10 ring-1 ring-inset
                            ${isActive
                                ? `${UI_TOGGLE_STYLES[option.variant]} ring-white/5`
                                : `bg-linear-to-b from-[#0a0f24] to-[#060a17] hover:from-[#101735] hover:to-[#0a0f24] border-[#182033]/80 text-slate-400 hover:text-slate-200 ring-[#161f35]/30 ${UI_TOGGLE_INACTIVE}`
                            }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}