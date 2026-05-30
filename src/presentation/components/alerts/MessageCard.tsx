import { MessageSquare } from "lucide-react";

interface MessageCardProps {
    content: string;
}

function MessageCard({ content }: MessageCardProps) {
    return (
        <div className="p-6 rounded-2xl bg-[#070B1A] border border-[#182033]">
            <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={16} className="text-blue-400" />
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    Mensaje Analizado
                </h2>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed bg-[#0d1526] rounded-xl p-4 border border-white/5">
                {content}
            </p>
        </div>
    );
}

export default MessageCard;