import { useEffect, useState } from "react";
import { type ProtectedPerson, type UpdateProtectedInfo, uploadImage } from "../../../infrastructure/api/protected-person-api";

interface Props {
    person: ProtectedPerson;
    onClose: () => void;
    onSuccess: () => void;
    onSubmit: (id: number, person: UpdateProtectedInfo) => Promise<void>;
}

function EditPersonModal({ person, onClose, onSuccess, onSubmit }: Props) {

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState<UpdateProtectedInfo>({
        fullName: "",
        relationship: "Familiar",
        contactNumber: "",
        image: null
    });

    // Se cambian cuando se actualizan los datos del formulario al haber un cambio
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Se cargan los datos al formulario
    useEffect(() => {
        setFormData({
            fullName: person.fullName,
            relationship: person.relationship,
            contactNumber: person.contactNumber,
            image: person.image
        });
    }, [person]);

    // Sube la imagen y guarda la url
    async function handleImageUpload(file: File): Promise<string> {
        var url = "";
        try {
            url = await uploadImage(file);
    
        } catch (error) {
            console.error("Error subiendo imagen:", error);
        }
        return url;
    }

    // Se envian los datos actualizados del formulario
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
    
        try {
            setUploading(true);
            const url = await handleImageUpload(selectedImage);
    
            formData.image = url;
            await onSubmit(person.id, formData);

            onSuccess();
    
        } catch (error) {
            console.error("Error al guardar persona:", error);
        }
        finally {
            setSelectedImage(null);
            setUploading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-500">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0f172a] border border-[#1e293b] rounded-3xl p-6 md:p-8">

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Editar perfil</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer text-lg">
                        ✕
                    </button>
                </div>
                <div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">
                        {/* Titulo */}
                        <div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Edita la información personal y cambia la foto de la persona que protejes.
                            </p>
                        </div>

                        {/* Información personal */}
                        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 flex flex-col gap-5">
                            <h3 className="text-white font-semibold text-lg">Información Personal</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-slate-300 text-sm block mb-2">Nombre completo</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-[#0b1220] border border-[#1e293b] rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-slate-300 text-sm block mb-2">Parentesco o relación</label>
                                    <select
                                        name="relationship"
                                        value={formData.relationship}
                                        onChange={handleChange}
                                        className="w-full bg-[#0b1220] border border-[#1e293b] rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                    >
                                        <option value="Familiar">Familiar</option>
                                        <option value="Contacto de confianza">Contacto de confianza</option>
                                        <option value="Profesional">Profesional</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-slate-300 text-sm block mb-2">Número de teléfono</label>
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        className="w-full bg-[#0b1220] border border-[#1e293b] rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-slate-300 text-sm block mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={person.email}
                                        disabled
                                        className="w-full bg-[#0b1220] border border-[#1e293b] rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-2">
                            <label className="px-12 py-3 rounded-2xl bg-white/14 border border-white/20 backdrop-blur-sm text-white font-medium cursor-pointer hover:bg-white/20 hover:border-white/30 transition-all duration-300 active:scale-95 whitespace-nowrap">
                                Seleccionar foto

                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];

                                        if (file) {
                                            setSelectedImage(file);
                                        }
                                    }}
                                />
                            </label>
                            {selectedImage && (
                                <p className="inline pl-5 text-md text-gray-400">
                                    Imagen seleccionada: {selectedImage.name}
                                </p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex items-center justify-end gap-4">
                            <button
                                type="button"
                                className="px-5 py-3 rounded-xl border border-[#1f2937] text-slate-300 hover:bg-[#111827] cursor-pointer"
                                onClick={onClose}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold cursor-pointer"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                    {uploading && (
                        <p className="text-sm text-blue-400 font-medium text-center mt-4 animate-pulse">
                            Actualizando información...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditPersonModal;