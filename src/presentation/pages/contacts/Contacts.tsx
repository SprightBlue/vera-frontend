import { useState, useMemo } from "react";
import { UserPlus, Search, Users } from "lucide-react";
import Sidebar from "../../../features/shared/components/Sidebar.tsx";
import Header from "../../../features/shared/components/Header.tsx";
import ProtectedPersonSelector from "../../components/contacts/ProtectedPersonSelector";
import CreateContactModal from "../../components/contacts/CreateContactModal";
import ContactCard from "../../components/contacts/ContactCard";
import ContactStatsBar from "../../components/contacts/ContactStatsBar";
import ContactTips from "../../components/contacts/ContactTips";
import { useAuth } from "../../context/AuthContext";
import { useProtectedPersonSelector } from "../../hooks/contacts/useProtectedPersonSelector";
import { useContacts } from "../../hooks/contacts/useContacts";
import type { AddContactRequest } from "../../../infrastructure/api/contacts-api";
import { ActionButton } from "@/features/shared/components/ActionButton";

function TrustedContacts() {
    const { user } = useAuth();
    const { persons, selected, setSelected, loading: personsLoading, error: personsError } = useProtectedPersonSelector();

    const protectedUserId = selected?.protectedUserId ?? null;
    const { contacts, loading: contactsLoading, error: contactsError, invite, remove, reload } = useContacts(protectedUserId);

    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!search.trim()) return contacts;
        const q = search.toLowerCase();
        return contacts.filter(c =>
            c.fullName.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.relationship.toLowerCase().includes(q)
        );
    }, [contacts, search]);

    const stats = useMemo(() => ({
        total: contacts.length,
        active: contacts.filter(c => c.status === "ACTIVE").length,
        pending: contacts.filter(c => c.status === "PENDING").length,
    }), [contacts]);

    const handleInvite = async (data: AddContactRequest) => {
        await invite(data);
    };

    return (
        <div className="flex min-h-screen bg-[#050816]">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 ml-[79.2px] lg:ml-[224px]">
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
                            <Users size={40} className="text-slate-600" />
                            <p className="text-slate-400 text-sm">
                                No tenés personas protegidas activas aún.<br />
                                Agregá una desde el Panel Principal para gestionar sus contactos.
                            </p>
                        </div>
                    )}

                    {selected && protectedUserId !== null && (
                        <>
                            {showForm && (
                                <CreateContactModal
                                    onInvite={handleInvite}
                                    onClose={() => setShowForm(false)}
                                    onSuccess={() => void reload()}
                                />
                            )}

                            {contacts.length > 0 && (
                                <ContactStatsBar
                                    total={stats.total}
                                    active={stats.active}
                                    pending={stats.pending}
                                />
                            )}

                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Buscar contacto por nombre, email o relación..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#070B1A] border border-[#182033] text-white text-base placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                    />
                                </div>
                                <ActionButton variant="info" icon={UserPlus} onClick={() => setShowForm(true)}>
                                    Agregar Contacto
                                </ActionButton>
                            </div>

                            {contactsError && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {contactsError}
                                </div>
                            )}

                            {contactsLoading && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[1, 2, 3].map(n => (
                                        <div key={n} className="h-[180px] rounded-2xl bg-[#070B1A] border border-[#182033] animate-pulse" />
                                    ))}
                                </div>
                            )}

                            {!contactsLoading && filtered.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filtered.map(contact => (
                                        <ContactCard
                                            key={contact.id}
                                            contact={contact}
                                            onRemove={remove}
                                        />
                                    ))}
                                </div>
                            )}

                            {!contactsLoading && contacts.length === 0 && !showForm && (
                                <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                                    <div className="p-4 rounded-2xl bg-[#070B1A] border border-[#182033]">
                                        <Users size={32} className="text-slate-600" />
                                    </div>
                                    <p className="text-white text-lg font-medium">Sin contactos de confianza</p>
                                    <p className="text-slate-400 text-sm max-w-sm">
                                        Agregá personas del entorno de <span className="text-white">{selected.fullName}</span> para que VERA pueda notificarlas ante situaciones de riesgo.
                                    </p>
                                    <ActionButton variant="info" icon={UserPlus} onClick={() => setShowForm(true)} className="mt-1">
                                        Agregar primer contacto
                                    </ActionButton>
                                </div>
                            )}

                            {!contactsLoading && contacts.length > 0 && filtered.length === 0 && (
                                <p className="text-slate-400 text-sm text-center py-8">
                                    No se encontraron contactos que coincidan con &ldquo;{search}&rdquo;.
                                </p>
                            )}

                            <ContactTips />
                        </>
                    )}

                    {selected && protectedUserId === null && (
                        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
                            Esta persona aún no aceptó la invitación. Una vez que la acepte podrás gestionar sus contactos de confianza.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default TrustedContacts;