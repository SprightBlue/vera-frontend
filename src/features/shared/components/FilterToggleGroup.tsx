import { UI_TOGGLE_STYLES, UI_TOGGLE_INACTIVE, UI_VARIANTS_MAP, type UIVariant } from '@/features/shared/utils/styleConfig';

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

                    const styleConfig = UI_VARIANTS_MAP[option.variant];

                    return (
                        <button
                            key={option.value}
                            onClick={() => onToggle(option.value)}
                            className={`px-4 py-2 rounded-lg border text-[clamp(10px,0.65vw,12px)] font-sans font-bold tracking-wider uppercase 
                            transition-all duration-300 cursor-pointer select-none active:scale-[0.96] shadow-md relative group overflow-hidden ${
                                isActive
                                    ? `${UI_TOGGLE_STYLES[option.variant]} ring-1 ring-inset ring-white/5`
                                    : UI_TOGGLE_INACTIVE
                            }`}
                        >
                            <div className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-300 z-10 ${
                                isActive ? `${styleConfig.laserColor}/35` : `via-transparent group-hover:${styleConfig.laserColor}/20`
                            }`} />

                            <div className={`absolute -top-5 -right-5 w-12 h-12 rounded-full filter blur-md pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 ${
                                isActive
                                    ? `opacity-25 scale-110 ${styleConfig.glowColor}`
                                    : `opacity-0 scale-75 ${styleConfig.glowColor} group-hover:opacity-15 group-hover:scale-125`
                            }`} />

                            <span className="relative z-10">{option.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}