import { useState } from "react";

import {
    createProtectedPerson
} from "../../../infrastructure/api/protected-person-api";

interface AddProtectedPersonModalProps {

    onClose: () => void;

    onSuccess: () => void;

}

function AddProtectedPersonModal({

    onClose,
    onSuccess

}: AddProtectedPersonModalProps) {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        fullName: "",

        relationshipType: "FAMILY_MEMBER",

        phone: "",

        email: "",

        highRiskAlertsEnabled: true,

        weeklySummaryEnabled: false,

        notificationSensitivity: "MEDIUM"

    });

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        try {

            setLoading(true);

            await createProtectedPerson(formData);

            onSuccess();

            onClose();

        } catch (error) {

            console.error(
                "Error creando protegido:",
                error
            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            backdrop-blur-sm
            p-4
        ">

            <div className="
                w-full
                max-w-2xl
                rounded-3xl
                border
                border-[#1c2740]
                bg-[#0d1222]
                p-8
            ">

                <div className="mb-8">

                    <h2 className="
                        text-3xl
                        font-bold
                        text-white
                        mb-2
                    ">
                        Añadir protegido
                    </h2>

                    <p className="text-slate-400">
                        Configura una nueva persona protegida
                        y personaliza las alertas de seguridad.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-8"
                >

                    {/* DATOS */}

                    <div className="space-y-5">

                        <div>

                            <label className="
                                block
                                text-sm
                                text-slate-300
                                mb-2
                            ">
                                Nombre completo
                            </label>

                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        fullName: e.target.value
                                    })
                                }
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-[#1c2740]
                                    bg-[#111827]
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
                                block
                                text-sm
                                text-slate-300
                                mb-2
                            ">
                                Relación o parentesco
                            </label>

                            <select
                                value={formData.relationshipType}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        relationshipType: e.target.value
                                    })
                                }
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-[#1c2740]
                                    bg-[#111827]
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
                                    Soporte profesional
                                </option>

                            </select>

                        </div>

                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-4
                        ">

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    text-slate-300
                                    mb-2
                                ">
                                    Número de teléfono
                                </label>

                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phone: e.target.value
                                        })
                                    }
                                    className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-[#1c2740]
                                        bg-[#111827]
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
                                    block
                                    text-sm
                                    text-slate-300
                                    mb-2
                                ">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value
                                        })
                                    }
                                    className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-[#1c2740]
                                        bg-[#111827]
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

                    {/* CONFIG */}

                    <div>

                        <h3 className="
                            text-xl
                            font-semibold
                            text-white
                            mb-5
                        ">
                            Configuración de protección
                        </h3>

                        <div className="space-y-5">

                            <div className="
                                flex
                                items-start
                                justify-between
                                gap-4
                            ">

                                <div>

                                    <p className="
                                        text-white
                                        font-medium
                                    ">
                                        Alertas de Riesgo Alto
                                    </p>

                                    <p className="
                                        text-sm
                                        text-slate-400
                                    ">
                                        Notificaciones inmediatas ante
                                        amenazas o actividad sospechosa.
                                    </p>

                                </div>

                                <input
                                    type="checkbox"
                                    checked={
                                        formData.highRiskAlertsEnabled
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            highRiskAlertsEnabled:
                                                e.target.checked
                                        })
                                    }
                                    className="
                                        w-5
                                        h-5
                                    "
                                />

                            </div>

                            <div className="
                                flex
                                items-start
                                justify-between
                                gap-4
                            ">

                                <div>

                                    <p className="
                                        text-white
                                        font-medium
                                    ">
                                        Resúmenes Semanales
                                    </p>

                                    <p className="
                                        text-sm
                                        text-slate-400
                                    ">
                                        Recibir un informe consolidado
                                        del bienestar general.
                                    </p>

                                </div>

                                <input
                                    type="checkbox"
                                    checked={
                                        formData.weeklySummaryEnabled
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            weeklySummaryEnabled:
                                                e.target.checked
                                        })
                                    }
                                    className="
                                        w-5
                                        h-5
                                    "
                                />

                            </div>

                        </div>

                    </div>

                    {/* SENSIBILIDAD */}

                    <div>

                        <h3 className="
                            text-xl
                            font-semibold
                            text-white
                            mb-2
                        ">
                            Sensibilidad de Notificaciones
                        </h3>

                        <p className="
                            text-sm
                            text-slate-400
                            mb-5
                        ">
                            Ajusta la frecuencia con la que
                            VERA envía alertas preventivas.
                        </p>

                        <div className="
                            flex
                            gap-3
                        ">

                            {
                                ["LOW", "MEDIUM", "HIGH"]
                                    .map((level) => (

                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    notificationSensitivity:
                                                        level
                                                })
                                            }
                                            className={`
                                                px-5
                                                py-2
                                                rounded-2xl
                                                border
                                                transition-all
                                                ${
                                                    formData.notificationSensitivity === level
                                                        ? "bg-blue-600 border-blue-600 text-white"
                                                        : "border-[#1c2740] text-slate-300 hover:border-blue-500"
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

                    {/* ACTIONS */}

                    <div className="
                        flex
                        justify-end
                        gap-4
                        pt-4
                    ">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                px-6
                                py-3
                                rounded-2xl
                                border
                                border-[#1c2740]
                                text-slate-300
                                hover:bg-[#141c30]
                                transition-colors
                            "
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                px-6
                                py-3
                                rounded-2xl
                                bg-blue-600
                                hover:bg-blue-700
                                transition-colors
                                text-white
                                font-medium
                                disabled:opacity-50
                            "
                        >

                            {
                                loading
                                    ? "Guardando..."
                                    : "Guardar Perfil"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AddProtectedPersonModal;