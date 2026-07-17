import { type ReactNode } from "react";
import { Mail, Phone, User } from "lucide-react";
import { type TrustContactResponse } from "@/features/alerts/api/alertsApi";

interface DetailContactRowProps {
    contact: TrustContactResponse | null | undefined;
    actions?: ReactNode;
}

export function DetailContactRow({ contact, actions }: DetailContactRowProps) {
    if (!contact) return null;

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-linear-to-b from-[#080d20] to-[#040714]
        border border-white/5 rounded-xl px-5 py-3.5 text-[clamp(11px,0.65vw,13px)] font-sans text-slate-400
        ring-1 ring-inset ring-white/5 shadow-xl select-none w-full relative overflow-hidden">

            <div
                className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/5 to-transparent pointer-events-none"
            />

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 relative z-10 flex-1 min-w-0">

                <div className="shrink-0 relative">
                    {contact.oppositeUserImage ? (
                        <img
                            src={contact.oppositeUserImage}
                            alt={contact.oppositeUserFullName}
                            className="w-8 h-8 rounded-full object-cover border border-white/5 ring-2 ring-white/5 shadow-md shrink-0"
                        />
                    ) : (
                        <div
                            className="w-8 h-8 rounded-full bg-linear-to-br from-[#1e293b] to-[#0f172a] border border-white/10 ring-2 ring-white/5 flex items-center justify-center text-slate-300 font-sans font-bold text-[10px] shrink-0 shadow-md">
                            {getInitials(contact.oppositeUserFullName)}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 min-w-0">
                    <User size={14} className="text-slate-500 shrink-0"/>
                    <span>
                        Protegido: <strong className="text-slate-200 font-sans font-semibold select-text normal-case">
                            {contact.oppositeUserFullName}
                        </strong>
                    </span>
                </div>

                <div className="w-1 h-1 bg-slate-800 rounded-full shrink-0 hidden sm:block"/>

                <div className="flex items-center gap-2 min-w-0">
                    <Mail size={14} className="text-slate-500 shrink-0"/>
                    <span>
                        Email: <strong className="text-slate-200 font-sans font-medium select-text lowercase">
                            {contact.oppositeUserEmail}
                        </strong>
                    </span>
                </div>

                {contact.oppositeUserPhone && (
                    <>
                        <div className="w-1 h-1 bg-slate-800 rounded-full shrink-0 hidden md:block"/>

                        <div className="flex items-center gap-2 min-w-0">
                            <Phone size={14} className="text-slate-500 shrink-0"/>
                            <span>
                                Teléfono: <strong className="text-slate-200 font-sans font-semibold select-text normal-case">
                                    {contact.oppositeUserPhone}
                                </strong>
                            </span>
                        </div>
                    </>
                )}
            </div>

            {actions && (
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto shrink-0 z-20">
                    {actions}
                </div>
            )}
        </div>
    );
}