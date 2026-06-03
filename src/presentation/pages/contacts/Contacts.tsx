import { useState, type ComponentProps } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import ProtectedPersonSelector from "../../components/contacts/ProtectedPersonSelector";
import AddContactForm from "../../components/contacts/AddContactForm";
import ContactTips from "../../components/contacts/ContactTips";

import { useAuth } from "../../context/AuthContext";
import { useProtectedPersonSelector } from "../../hooks/contacts/useProtectedPersonSelector";

function TrustedContacts() {
    const { user } = useAuth();
    const { persons, selected, setSelected, loading: personsLoading, error: personsError } = useProtectedPersonSelector();

    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");

    type AddContactData = Parameters<ComponentProps<typeof AddContactForm>["onAdd"]>[0];

    const handleAdd = async (data: AddContactData): Promise<void> => {
        // CORREGIDO: Guardia de tipo para asegurar a TypeScript que 'selected' existe
        if (!selected) return;

        console.log("Agregando contacto para el protegido:", selected.id, data);
        setShowForm(false);
    };

    return (
        <div className="flex min-h-screen bg-[#050816]">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 ml-[260px]">
                <Header
                    userName={user?.fullName ?? "Usuario"}
                    title="Contactos de Confianza"
                    subtitle="Gestioná los contactos que pueden ayudar ante una situación de alto riesgo."
                />

                <div className="p-8 flex flex-col gap-6">

                    {/* Barra Superior Unificada: Selector + Buscador + Botón Agregar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-[#070B1A]/40 p-4 rounded-2xl border border-[#182033]">
                        <div className="flex-1 min-w-[250px]">
                            <ProtectedPersonSelector
                                persons={persons}
                                selected={selected}
                                onSelect={setSelected}
                                loading={personsLoading}
                            />
                        </div>

                        {selected && (
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Buscar contacto..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="px-3 py-2 rounded-xl bg-[#070B1A] border border-[#182033] text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors w-48"
                                />
                                <button
                                    onClick={() => setShowForm(p => !p)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all whitespace-nowrap"
                                >
                                    Agregar Contacto
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Errores del Selector General de Personas */}
                    {personsError && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {personsError}
                        </div>
                    )}

                    {!personsLoading && !personsError && persons.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
                            <p className="text-slate-400 text-sm">
                                No tenés personas protegidas aún.<br />
                                Agregá una desde el Panel Principal para gestionar sus contactos.
                            </p>
                        </div>
                    )}

                    {/* Contenido Dinámico (Solo el formulario y los tips si hay selección) */}
                    {selected && (
                        <>
                            {/* Despliegue del Formulario */}
                            {showForm && (
                                <AddContactForm
                                    onAdd={handleAdd}
                                    onCancel={() => setShowForm(false)}
                                />
                            )}

                            <ContactTips />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default TrustedContacts;