import { Lightbulb } from "lucide-react";

interface RecommendationCardProps {
    recommendation: string;
}

function RecommendationCard({ recommendation }: RecommendationCardProps) {
    return (
        <div className="p-6 rounded-2xl bg-[#070B1A] border border-[#182033]">
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={16} className="text-blue-400" />
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    Recomendaciones de Vera
                </h2>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">{recommendation}</p>
        </div>
    );
}

export default RecommendationCard;