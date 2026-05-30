import { useState } from "react";

import ProtectedPersonForm from "./ProtectedPersonForm";
import InviteOptions from "./InviteOptions";
import InviteLinkCard from "./InviteLinkCard";

import { createProtectedPerson } from "../../../infrastructure/api/protected-person-api";

interface Props {

    onClose: () => void;

    onSuccess: () => void;

}

function CreateProtectedPersonModal({

    onClose,
    onSuccess

}: Props) {

    const [mode, setMode] =
        useState<"manual" | "invite">("manual");

    const [inviteLink, setInviteLink] =
        useState("");

    async function handleCreate(data: {
        fullName: string;
        relationshipType: string;
        phone: string;
        email: string;
    }) {

        try {

            await createProtectedPerson({

                ...data,

                highRiskAlertsEnabled: true,

                weeklySummaryEnabled: false,

                notificationSensitivity: "MEDIUM"

            });

            onSuccess();

            onClose();

        } catch (error) {

            console.error(error);

        }

    }

    function generateInviteLink() {

        const fakeLink =
            `https://vera.care/invite/${crypto.randomUUID()}`;

        setInviteLink(fakeLink);

    }

    return (

        <div className="
    fixed
    inset-0
    bg-black/70

    flex
    items-center
    justify-center

    p-4

    z-50
">

            <div className="
    w-full
    max-w-4xl
    max-h-[90vh]
    overflow-y-auto

    bg-[#0f172a]
    border
    border-[#1e293b]

    rounded-3xl

    p-6
    md:p-8
">

                <div className="
                    flex
                    items-center
                    justify-between
                    mb-6
                ">

                    <h2 className="
                        text-2xl
                        font-bold
                        text-white
                    ">
                        Añadir protegido
                    </h2>

                    <button
                        onClick={onClose}
                        className="
                            text-slate-400
                            hover:text-white
                        "
                    >
                        ✕
                    </button>

                </div>

                <InviteOptions
                    selected={mode}
                    onChange={setMode}
                />

                {
                    mode === "manual" ? (

                        <ProtectedPersonForm
                            onSubmit={handleCreate}
                        />

                    ) : (

                        <div className="flex flex-col gap-5">

                            {
                                inviteLink ? (

                                    <InviteLinkCard
                                        inviteLink={inviteLink}
                                        onClose={onClose}
                                    />

                                ) : (

                                    <button
                                        onClick={generateInviteLink}
                                        className="
                                            bg-blue-600
                                            hover:bg-blue-700
                                            rounded-xl
                                            py-3
                                            text-white
                                            font-semibold
                                        "
                                    >
                                        Generar enlace seguro
                                    </button>

                                )
                            }

                        </div>

                    )
                }

            </div>

        </div>

    );

}

export default CreateProtectedPersonModal;