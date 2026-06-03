export const getRiskColor = (level: string) => {
    if (level === "HIGH" || level === "ALTO") return "text-red-500 bg-red-500/10 border-red-500/20";
    if (level === "MEDIUM" || level === "MEDIO") return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-green-500 bg-green-500/10 border-green-500/20";
};
