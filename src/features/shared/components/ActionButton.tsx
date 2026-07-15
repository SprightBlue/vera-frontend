import {type ButtonHTMLAttributes, type ComponentType, type ReactNode} from "react";
import {Loader2} from "lucide-react";
import {UI_BUTTON_STYLES, type UIVariant} from "@/features/shared/utils/styleConfig";

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
                                 disabled,
                                 className = "",
                                 ...props
                             }: DetailButtonProps) {

    const variantStyle = UI_BUTTON_STYLES[variant] || UI_BUTTON_STYLES['neutral'];

    return (
        <button
            disabled={disabled || isLoading}
            className={`inline-flex items-center justify-center gap-2 px-5 w-full sm:w-40 h-10 rounded-md font-sans font-black tracking-wider uppercase text-[clamp(11px,0.75vw,13px)] transition-all duration-200 active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${variantStyle} ${className}`}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin shrink-0"/>
            ) : (
                Icon && <Icon className="h-4 w-4 shrink-0"/>
            )}
            <span className="leading-none">{children}</span>
        </button>
    );
}