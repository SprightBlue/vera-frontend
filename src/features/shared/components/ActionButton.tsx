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
            className={`w-full md:w-32 h-9 flex items-center justify-center gap-1.5 px-3.5 rounded-lg font-bold text-[clamp(0.72rem,0.78vw,0.82rem)] tracking-tight transition-all duration-150 active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase ${variantStyle} ${className}`}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
                Icon && <Icon className="h-3.5 w-3.5" />
            )}
            <span>{children}</span>
        </button>
    );
}