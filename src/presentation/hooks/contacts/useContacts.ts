import { useCallback, useEffect, useState } from "react";
import {
    addContact,
    inviteContact,
    getContactsByProtectedPerson,
    removeContact,
    type AddContactRequest,
    type InviteContactResponse,
} from "@/presentation/api/contacts-api";
import type { Contact } from "@/presentation/api/Contact.ts";

interface Result {
    contacts: Contact[];
    loading: boolean;
    error: string | null;
    add: (data: AddContactRequest) => Promise<void>;
    invite: (data: AddContactRequest) => Promise<InviteContactResponse>;
    remove: (contactId: number) => Promise<void>;
    reload: () => void;
}

export function useContacts(protectedUserId: number | null): Result {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (protectedUserId === null) {
            setContacts([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            setContacts(await getContactsByProtectedPerson(protectedUserId));
        } catch {
            setError("No se pudieron cargar los contactos.");
        } finally {
            setLoading(false);
        }
    }, [protectedUserId]);

    useEffect(() => { void load(); }, [load]);

    const add = useCallback(async (data: AddContactRequest) => {
        if (protectedUserId === null) return;
        const created = await addContact(protectedUserId, data);
        setContacts(prev => [...prev, created]);
    }, [protectedUserId]);

    const invite = useCallback(async (data: AddContactRequest): Promise<InviteContactResponse> => {
        if (protectedUserId === null) throw new Error("No hay protegido seleccionado");
        const response = await inviteContact(protectedUserId, data);
        setContacts(prev => [...prev, {
            id: Date.now(),
            fullName: data.fullName,
            email: data.contactEmail,
            phone: data.contactPhone,
            relationship: data.relationship,
            sensitivityLevel: data.sensitivityLevel,
            notifyHighRisk: data.notifyHighRisk,
            receiveAlertSummaries: data.receiveAlertSummaries,
            status: "PENDING",
        }]);
        return response;
    }, [protectedUserId]);

    const remove = useCallback(async (contactId: number) => {
        await removeContact(contactId);
        setContacts(prev => prev.filter(c => c.id !== contactId));
    }, []);


    return { contacts, loading, error, add, invite, remove, reload: load };
}