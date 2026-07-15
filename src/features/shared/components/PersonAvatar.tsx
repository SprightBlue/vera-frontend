type Size = "xs" | "sm" | "md" | "lg" | "xl" | "header" | "full";

const sizeMap: Record<Size, { container: string; text: string }> = {
    xs: {container: "w-7 h-7", text: "text-[9px]"},
    sm: {container: "w-11 h-11", text: "text-sm"},
    md: {container: "w-20 h-20", text: "text-2xl"},
    // Aumentamos considerablemente lg y xl para tu layout de dos columnas
    lg: {container: "w-40 h-40 md:w-44 md:h-44", text: "text-5xl"},
    xl: {container: "w-48 h-48 md:w-56 md:h-56", text: "text-6xl"},
    header: {container: "w-8 h-8 sm:w-9 sm:h-9", text: "text-[10px] sm:text-xs"},
    // Variante comodín: ocupa el 100% del contenedor padre que definas afuera
    full: {container: "w-full h-full", text: "text-[clamp(2.5rem,5vw,4.5rem)]"}
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

export function PersonAvatar({fullName, image, size = "sm", shape = "circle", className = ""}: PersonAvatarProps) {
    const {container, text} = sizeMap[size];
    const radius = shape === "circle" ? "rounded-full" : "rounded-xl";

    const baseBorder = "border border-[#161f37] shadow-xl shadow-black/50";
    const baseLayout = `${container} ${radius} shrink-0 object-cover ${baseBorder}`;

    if (image) {
        return (
            <img
                src={image}
                alt={fullName}
                className={`${baseLayout} ${className}`}
            />
        );
    }

    return (
        <div className={`${container} ${radius} shrink-0 bg-linear-to-b from-[#0e1630] to-[#040714] 
            border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.08)] flex items-center justify-center 
            text-blue-400 font-display font-black tracking-wider uppercase ${text} ${className}`}
        >
            {getInitials(fullName)}
        </div>
    );
}