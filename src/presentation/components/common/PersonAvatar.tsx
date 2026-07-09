type Size = "xs" | "sm" | "md" | "lg" | "xl" | "header";

const sizeMap: Record<Size, { container: string; text: string }> = {
    xs: { container: "w-7 h-7",   text: "text-xs" },
    sm: { container: "w-11 h-11", text: "text-base" },
    md: { container: "w-20 h-20", text: "text-3xl" },
    lg: { container: "w-28 h-28", text: "text-5xl" },
    xl: { container: "w-36 h-36", text: "text-6xl" },
    header: { container: "w-8 h-8 sm:w-9 sm:h-9", text: "text-xs sm:text-sm" },
};

function getInitials(fullName: string): string {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

interface PersonAvatarProps {
    fullName: string;
    image?: string | null;
    size?: Size;
    shape?: "circle" | "square";
    className?: string;
}

export function PersonAvatar({fullName, image, size = "sm", shape = "circle", className = "",}: PersonAvatarProps) {
    const { container, text } = sizeMap[size];
    const radius = shape === "circle" ? "rounded-full" : "rounded-xl";
    const base = `${container} ${radius} shrink-0 object-cover border border-[#182033]`;

    if (image) {
        return (
            <img src={image} alt={fullName} className={`${base} ${className}`}/>
        );
    }

    return (
        <div className={`${container} ${radius} shrink-0 bg-blue-600 flex items-center justify-center text-white font-bold ${text} ${className}`}>
            {getInitials(fullName)}
        </div>
    );
}