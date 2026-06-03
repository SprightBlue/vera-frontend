import { useCallback, useEffect, useState } from "react";
import {
    addContact,
    generateInviteLink,
    getContactsByProtectedPerson,
    removeContact,
    type AddContactRequest,
} from "../../../infrastructure/api/contacts-api";
import type { Contact } from "../../../domain/models/Contact";

interface Result {
    contacts: Contact[];
    loading: boolean;
    error: string | null;
    add: (data: AddContactRequest) => Promise<void>;
    remove: (contactId: number) => Promise<void>;
    invite: (contactId: number) => Promise<string>;
}

export function useContacts(protectedPersonId: number | null): Result {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (protectedPersonId === null) return;
        setLoading(true);
        setError(null);
        try {
            setContacts(await getContactsByProtectedPerson(protectedPersonId));
        } catch {
            setError("No se pudieron cargar los contactos.");
        } finally {
            setLoading(false);
        }
    }, [protectedPersonId]);

    useEffect(() => { load(); }, [load]);

    const add = useCallback(async (data: AddContactRequest) => {
        if (protectedPersonId === null) return;
        const created = await addContact(protectedPersonId, data);
        setContacts(prev => [...prev, created]);
    }, [protectedPersonId]);

    const remove = useCallback(async (contactId: number) => {
        await removeContact(contactId);
        setContacts(prev => prev.filter(c => c.id !== contactId));
    }, []);

    const invite = useCallback(async (contactId: number): Promise<string> => {
        const link = await generateInviteLink(contactId);
        setContacts(prev =>
            prev.map(c => c.id === contactId ? { ...c, status: "PENDING" as const } : c)
        );
        return link;
    }, []);

    return { contacts, loading, error, add, remove, invite };
}