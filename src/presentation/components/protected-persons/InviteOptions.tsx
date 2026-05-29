interface Props {
    selected: "manual" | "invite";
    onChange: (value: "manual" | "invite") => void;
}

function InviteOptions({ selected, onChange }: Props) {

    return (

        <div className="flex gap-4 mb-6">

            <button
                onClick={() => onChange("manual")}
                className={`
                    px-5
                    py-3
                    rounded-xl
                    border
                    transition-all

                    ${
                        selected === "manual"
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-[#111827] border-[#1f2937] text-slate-300"
                    }
                `}
            >
                Crear manualmente
            </button>

            <button
                onClick={() => onChange("invite")}
                className={`
                    px-5
                    py-3
                    rounded-xl
                    border
                    transition-all

                    ${
                        selected === "invite"
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-[#111827] border-[#1f2937] text-slate-300"
                    }
                `}
            >
                Invitar por enlace
            </button>

        </div>

    );

}

export default InviteOptions;