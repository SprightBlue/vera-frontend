interface Props {

    inviteLink: string;

    onClose: () => void;

}

function InviteLinkCard({

    inviteLink,
    onClose

}: Props) {

    async function copyLink() {

        await navigator.clipboard.writeText(inviteLink);

        alert("Enlace copiado");

    }

    function shareWhatsApp() {

        const text =
            encodeURIComponent(
                `Únete a mi círculo de confianza en Vera:\n${inviteLink}`
            );

        window.open(
            `https://wa.me/?text=${text}`,
            "_blank"
        );

    }

    function shareEmail() {

        const subject =
            encodeURIComponent(
                "Invitación a Vera"
            );

        const body =
            encodeURIComponent(
                `Te invito a unirte a mi círculo de confianza:\n\n${inviteLink}`
            );

        window.location.href =
            `mailto:?subject=${subject}&body=${body}`;

    }

    return (

        <div className="
            fixed
            inset-0
            bg-black/70
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-50
            p-4
        ">

            <div className="
                w-full
                max-w-2xl

                bg-[#0d1222]

                border
                border-[#1b2336]

                rounded-3xl

                p-10
            ">

                {/* SUCCESS ICON */}

                <div className="
                    flex
                    justify-center
                    mb-6
                ">

                    <div className="
                        w-20
                        h-20

                        rounded-full

                        bg-green-500/20

                        flex
                        items-center
                        justify-center
                    ">

                        <span className="
                            text-4xl
                        ">
                            ✔
                        </span>

                    </div>

                </div>

                {/* TITLE */}

                <h2 className="
                    text-3xl
                    font-bold
                    text-white
                    text-center
                    mb-4
                ">
                    ¡Invitación generada con éxito!
                </h2>

                {/* SUBTITLE */}

                <p className="
                    text-slate-400
                    text-center
                    text-lg
                    leading-relaxed
                    max-w-xl
                    mx-auto
                    mb-8
                ">
                    Se ha creado un enlace seguro.
                    Compártelo con la persona que deseas
                    invitar a tu círculo de confianza.
                </p>

                {/* LINK */}

                <div className="
                    bg-[#111827]
                    border
                    border-[#1f2937]
                    rounded-2xl

                    px-5
                    py-4

                    flex
                    items-center
                    justify-between

                    mb-8
                ">

                    <span className="
                        text-slate-200
                        truncate
                    ">
                        {inviteLink}
                    </span>

                    <span className="
                        text-slate-500
                        text-xl
                    ">
                        
                    </span>

                </div>

                {/* BUTTONS */}

                <div className="
                    flex
                    flex-col
                    gap-4
                ">

                    <button

                        onClick={copyLink}

                        className="
                            w-full

                            bg-[#111827]
                            hover:bg-[#172033]

                            border
                            border-[#1f2937]

                            rounded-2xl

                            py-4
                            px-5

                            text-white
                            font-medium

                            transition-colors
                        "
                    >
                        Copiar enlace
                    </button>

                    <button

                        onClick={shareWhatsApp}

                        className="
                            w-full

                            bg-[#111827]
                            hover:bg-[#172033]

                            border
                            border-[#1f2937]

                            rounded-2xl

                            py-4
                            px-5

                            text-white
                            font-medium

                            transition-colors
                        "
                    >
                        Compartir por WhatsApp
                    </button>

                    <button

                        onClick={shareEmail}

                        className="
                            w-full

                            bg-[#111827]
                            hover:bg-[#172033]

                            border
                            border-[#1f2937]

                            rounded-2xl

                            py-4
                            px-5

                            text-white
                            font-medium

                            transition-colors
                        "
                    >
                        Compartir por email
                    </button>

                </div>

                {/* FOOTER BUTTON */}

                <button

                    onClick={onClose}

                    className="
                        mt-8

                        w-full

                        bg-blue-600
                        hover:bg-blue-700

                        rounded-2xl

                        py-4

                        text-white
                        font-semibold
                        text-lg

                        transition-colors
                    "
                >
                    Ir al panel de control →
                </button>

            </div>

        </div>

    );

}

export default InviteLinkCard;