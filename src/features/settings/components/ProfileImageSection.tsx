import {type ChangeEvent, useRef} from "react";
import {PersonAvatar} from "@/features/shared/components/PersonAvatar";
import {ActionButton} from "@/features/shared/components/ActionButton";
import {UploadCloud, Trash2} from "lucide-react";

interface ProfileImageSectionProps {
    fullName: string;
    imageUrl: string | null;
    uploading: "upload" | "delete" | null;
    onUpload: (e: ChangeEvent<HTMLInputElement>) => void | Promise<void>;
    onDelete: () => void | Promise<void>;
}

export function ProfileImageSection({
                                        fullName,
                                        imageUrl,
                                        uploading,
                                        onUpload,
                                        onDelete
                                    }: ProfileImageSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <section className="w-full relative z-10 select-none">
            <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-8 w-full">

                <div
                    className="shrink-0 w-28 h-28 lg:w-40 lg:h-40 relative p-1 bg-linear-to-b from-slate-800 to-transparent rounded-full shadow-[0_0_30px_rgba(8,13,32,0.55)] flex items-center justify-center overflow-hidden">
                    <PersonAvatar
                        fullName={fullName}
                        image={imageUrl}
                        size="lg"
                        className="w-full h-full object-cover rounded-full shrink-0"
                    />
                </div>

                <div
                    className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-3.5 w-full">

                    <h3 className="text-[13px] sm:text-sm font-display font-black uppercase text-white tracking-wider leading-none">
                        Imagen de Perfil
                    </h3>

                    <p className="text-[clamp(13px,0.75vw,14px)] text-slate-400 leading-relaxed font-sans font-medium max-w-xl">
                        Esta imagen te identificará frente al resto de los usuarios dentro de la plataforma de manera
                        pública.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-1">
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={onUpload}
                            disabled={uploading !== null}
                        />

                        <ActionButton
                            variant="info"
                            isLoading={uploading === "upload"}
                            disabled={uploading !== null}
                            icon={UploadCloud}
                            onClick={handleUploadClick}
                        >
                            Subir
                        </ActionButton>

                        {imageUrl && (
                            <ActionButton
                                variant="danger"
                                isLoading={uploading === "delete"}
                                disabled={uploading !== null}
                                icon={Trash2}
                                onClick={onDelete}
                            >
                                Borrar
                            </ActionButton>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
}