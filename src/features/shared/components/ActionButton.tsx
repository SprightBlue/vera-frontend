import { type ButtonHTMLAttributes, type ComponentType, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { UI_BUTTON_STYLES, type UIVariant } from "@/features/shared/utils/styleConfig";

interface DetailButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant: UIVariant;
    isLoading?: boolean;
    icon?: ComponentType<{ className?: string }>;
    children: ReactNode;
}

export function ActionButton({
                                 variant,
                                 isLoading = false,
                                 icon: Icon,
                                 children,
                                 className = "",
                                 disabled,
                                 ...props
                             }: DetailButtonProps) {

    const variantStyle = UI_BUTTON_STYLES[variant] || UI_BUTTON_STYLES['neutral'];

    return (
        <button
            disabled={disabled || isLoading}
            className={`inline-flex items-center justify-center gap-2 px-5 h-[clamp(2.2rem,2.6vw,2.8rem)] rounded-lg font-sans font-black uppercase tracking-widest text-[clamp(0.7rem,0.75vw,0.85rem)] transition-all duration-200 active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${variantStyle} ${className}`}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
            ) : (
                Icon && <Icon className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
            )}
            <span className="leading-none">{children}</span>
        </button>
    );
}