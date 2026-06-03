import { useState } from "react";
import { Plus, Shield, Settings } from "lucide-react";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import ProtectedPersonSelector from "../../components/contacts/ProtectedPersonSelector";
import ContactStatsBar from "../../components/contacts/ContactStatsBar";
import AddContactForm from "../../components/contacts/AddContactForm";
import ContactCard from "../../components/contacts/ContactCard";
import ContactTips from "../../components/contacts/ContactTips";

import { useAuth } from "../../context/AuthContext";
import { useProtectedPersonSelector } from "../../hooks/contacts/useProtectedPersonSelector";
import { useContacts } from "../../hooks/contacts/useContacts";

function TrustedContacts() {
    const { user } = useAuth();
    const { persons, selected, setSelected, loading: personsLoading, error: personsError } = useProtectedPersonSelector();
    const { contacts, loading, error, add, remove, invite } = useContacts(selected?.id ?? null);

    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");

    const stats = {
        total: contacts.length,
        active: contacts.filter(c => c.status === "ACTIVE").length,
        pending: contacts.filter(c => c.status === "PENDING").length,
    };

    const filtered = contacts.filter(c =>
        c.fullName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = async (data: Parameters<typeof add>[0]) => {
        await add(data);
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

                    <ProtectedPersonSelector
                        persons={persons}
                        selected={selected}
                        onSelect={setSelected}
                        loading={personsLoading}
                    />

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

                    {selected && (
                        <>
                            <ContactStatsBar {...stats} />

                            {/* Banner emergencia */}
                            <div className="flex items-center justify-between p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/20">
                                        <Shield size={20} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Asistencia de Emergencia</p>
                                        <p className="text-slate-400 text-xs mt-0.5 max-w-lg">
                                            VERA notificará automáticamente a los contactos de emergencia cuando detecte una situación de alto riesgo.
                                        </p>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-300 text-sm font-medium border border-[#182033] hover:bg-white/5 hover:text-white transition-all flex-shrink-0">
                                    <Settings size={14} /> Configurar
                                </button>
                            </div>

                            {/* Cabecera lista */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <h2 className="text-white font-semibold text-lg">Contactos</h2>
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
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all"
                                        >
                                            <Plus size={16} />
                                            Agregar Contacto
                                        </button>
                                    </div>
                                </div>

                                {showForm && (
                                    <AddContactForm
                                        onAdd={handleAdd}
                                        onCancel={() => setShowForm(false)}
                                    />
                                )}

                                {loading && (
                                    <div className="flex justify-center items-center py-16">
                                        <p className="text-slate-400 text-sm">Cargando contactos...</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                {!loading && !error && filtered.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                                        <div className="p-4 rounded-2xl bg-[#070B1A] border border-[#182033]">
                                            <Plus size={24} className="text-slate-600" />
                                        </div>
                                        <p className="text-slate-400 text-sm">
                                            {search
                                                ? "No se encontraron contactos con ese nombre o email."
                                                : "Todavía no hay contactos. Agregá el primero."}
                                        </p>
                                    </div>
                                )}

                                {!loading && filtered.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filtered.map(c => (
                                            <ContactCard
                                                key={c.id}
                                                contact={c}
                                                onRemove={remove}
                                                onInvite={invite}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <ContactTips />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default TrustedContacts;