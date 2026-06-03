import { useState } from "react";

interface Props {

    onSubmit: (data: {
        fullName: string;
        relationshipType: string;
        phone: string;
        email: string;
        highRiskAlertsEnabled: boolean;
        weeklySummaryEnabled: boolean;
        notificationSensitivity: string;
    }) => void;

}

function ProtectedPersonForm({ onSubmit }: Props) {

    const [fullName, setFullName] = useState("");

    const [relationshipType, setRelationshipType] =
        useState("FAMILY_MEMBER");

    const [phone, setPhone] = useState("");

    const [email, setEmail] = useState("");

    const [highRiskAlertsEnabled, setHighRiskAlertsEnabled] =
        useState(true);

    const [weeklySummaryEnabled, setWeeklySummaryEnabled] =
        useState(false);

    const [notificationSensitivity, setNotificationSensitivity] =
        useState("MEDIUM");

    function handleSubmit(e: React.FormEvent) {

        e.preventDefault();

        onSubmit({
            fullName,
            relationshipType,
            phone,
            email,
            highRiskAlertsEnabled,
            weeklySummaryEnabled,
            notificationSensitivity
        });

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 mt-6"
        >

            {/* HEADER */}

            <div>

                <h2 className="
                    text-2xl
                    font-bold
                    text-white
                    mb-2
                ">
                    Añadir Protegido
                </h2>

                <p className="
                    text-slate-400
                    text-sm
                    leading-relaxed
                ">
                    Configura el perfil de la persona que deseas
                    acompañar y proteger.
                </p>

            </div>

            {/* PERSONAL INFO */}

            <div className="
                bg-[#111827]
                border
                border-[#1f2937]
                rounded-2xl
                p-6
                flex
                flex-col
                gap-5
            ">

                <h3 className="
                    text-white
                    font-semibold
                    text-lg
                ">
                    Información Personal
                </h3>

                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-5
                ">

                    <div>

                        <label className="
                            text-slate-300
                            text-sm
                            block
                            mb-2
                        ">
                            Nombre completo
                        </label>

                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) =>
                                setFullName(e.target.value)
                            }
                            placeholder="Ej. María García"
                            required
                            className="
                                w-full
                                bg-[#0b1220]
                                border
                                border-[#1e293b]
                                rounded-xl
                                px-4
                                py-3
                                text-white
                                outline-none
                                focus:border-blue-500
                            "
                        />

                    </div>

                    <div>

                        <label className="
                            text-slate-300
                            text-sm
                            block
                            mb-2
                        ">
                            Parentesco o relación
                        </label>

                        <select
                            value={relationshipType}
                            onChange={(e) =>
                                setRelationshipType(e.target.value)
                            }
                            className="
                                w-full
                                bg-[#0b1220]
                                border
                                border-[#1e293b]
                                rounded-xl
                                px-4
                                py-3
                                text-white
                                outline-none
                                focus:border-blue-500
                            "
                        >

                            <option value="FAMILY_MEMBER">
                                Familiar
                            </option>

                            <option value="TRUSTED_CONTACT">
                                Contacto de confianza
                            </option>

                            <option value="PROFESSIONAL">
                                Profesional
                            </option>

                        </select>

                    </div>

                </div>

                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-5
                ">

                    <div>

                        <label className="
                            text-slate-300
                            text-sm
                            block
                            mb-2
                        ">
                            Número de teléfono
                        </label>

                        <input
                            type="text"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                            placeholder="+54 11 5555 5555"
                            className="
                                w-full
                                bg-[#0b1220]
                                border
                                border-[#1e293b]
                                rounded-xl
                                px-4
                                py-3
                                text-white
                                outline-none
                                focus:border-blue-500
                            "
                        />

                    </div>

                    <div>

                        <label className="
                            text-slate-300
                            text-sm
                            block
                            mb-2
                        ">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="correo@email.com"
                            className="
                                w-full
                                bg-[#0b1220]
                                border
                                border-[#1e293b]
                                rounded-xl
                                px-4
                                py-3
                                text-white
                                outline-none
                                focus:border-blue-500
                            "
                        />

                    </div>

                </div>

            </div>

            {/* PROTECTION SETTINGS */}

            <div className="
                bg-[#111827]
                border
                border-[#1f2937]
                rounded-2xl
                p-6
                flex
                flex-col
                gap-6
            ">

                <h3 className="
                    text-white
                    font-semibold
                    text-lg
                ">
                    Configuración de Protección
                </h3>

                {/* HIGH RISK */}

                <div className="
                    flex
                    items-center
                    justify-between
                ">

                    <div>

                        <p className="
                            text-white
                            font-medium
                        ">
                            Alertas de Riesgo Alto
                        </p>

                        <p className="
                            text-slate-400
                            text-sm
                        ">
                            Notificaciones inmediatas ante amenazas.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setHighRiskAlertsEnabled(
                                !highRiskAlertsEnabled
                            )
                        }
                        className={`
                            w-14
                            h-8
                            rounded-full
                            transition-all
                            relative
                            ${
                                highRiskAlertsEnabled
                                    ? "bg-blue-600"
                                    : "bg-slate-700"
                            }
                        `}
                    >

                        <div className={`
                            absolute
                            top-1
                            w-6
                            h-6
                            rounded-full
                            bg-white
                            transition-all
                            ${
                                highRiskAlertsEnabled
                                    ? "left-7"
                                    : "left-1"
                            }
                        `} />

                    </button>

                </div>

                {/* WEEKLY SUMMARY */}

                <div className="
                    flex
                    items-center
                    justify-between
                ">

                    <div>

                        <p className="
                            text-white
                            font-medium
                        ">
                            Resúmenes Semanales
                        </p>

                        <p className="
                            text-slate-400
                            text-sm
                        ">
                            Recibir informes consolidados cada semana.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setWeeklySummaryEnabled(
                                !weeklySummaryEnabled
                            )
                        }
                        className={`
                            w-14
                            h-8
                            rounded-full
                            transition-all
                            relative
                            ${
                                weeklySummaryEnabled
                                    ? "bg-blue-600"
                                    : "bg-slate-700"
                            }
                        `}
                    >

                        <div className={`
                            absolute
                            top-1
                            w-6
                            h-6
                            rounded-full
                            bg-white
                            transition-all
                            ${
                                weeklySummaryEnabled
                                    ? "left-7"
                                    : "left-1"
                            }
                        `} />

                    </button>

                </div>

                {/* SENSITIVITY */}

                <div>

                    <p className="
                        text-white
                        font-medium
                        mb-2
                    ">
                        Sensibilidad de Notificaciones
                    </p>

                    <p className="
                        text-slate-400
                        text-sm
                        mb-4
                    ">
                        Ajusta la frecuencia con la que VERA
                        enviará alertas.
                    </p>

                    <div className="flex gap-3">

                        {
                            ["LOW", "MEDIUM", "HIGH"].map((level) => (

                                <button
                                    key={level}
                                    type="button"
                                    onClick={() =>
                                        setNotificationSensitivity(level)
                                    }
                                    className={`
                                        px-5
                                        py-2
                                        rounded-xl
                                        border
                                        transition-all
                                        ${
                                            notificationSensitivity === level
                                                ? `
                                                    bg-blue-600
                                                    border-blue-500
                                                    text-white
                                                  `
                                                : `
                                                    border-[#1f2937]
                                                    bg-[#0b1220]
                                                    text-slate-300
                                                  `
                                        }
                                    `}
                                >
                                    {
                                        level === "LOW"
                                            ? "Bajo"
                                            : level === "MEDIUM"
                                            ? "Medio"
                                            : "Alto"
                                    }
                                </button>

                            ))
                        }

                    </div>

                </div>

            </div>

            {/* ACTIONS */}

            <div className="
                flex
                items-center
                justify-end
                gap-4
            ">

                <button
                    type="button"
                    className="
                        px-5
                        py-3
                        rounded-xl
                        border
                        border-[#1f2937]
                        text-slate-300
                        hover:bg-[#111827]
                    "
                    onClick={() => window.location.href = "/dashboard"}
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    className="
                        px-6
                        py-3
                        rounded-xl
                        bg-blue-600
                        hover:bg-blue-700
                        transition-colors
                        text-white
                        font-semibold
                    "
                    onClick={() => window.location.href = "/persons"}
                >
                    Guardar Perfil
                </button>

            </div>

        </form>

    );

}

export default ProtectedPersonForm;