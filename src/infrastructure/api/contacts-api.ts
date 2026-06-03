import { apiClient } from "./auth.repository";
import type { Contact } from "../../domain/models/Contact";

export interface AddContactRequest {
    contactEmail: string;
    relationship: string;
}

export async function getContactsByProtectedPerson(protectedPersonId: number): Promise<Contact[]> {
    const { data } = await apiClient.get<Contact[]>(
        `/api/v1/contacts/protected-person/${protectedPersonId}`
    );
    return data;
}

export async function addContact(
    protectedPersonId: number,
    payload: AddContactRequest
): Promise<Contact> {
    const { data } = await apiClient.post<Contact>(
        `/api/v1/contacts/protected-person/${protectedPersonId}`,
        payload
    );
    return data;
}

export async function removeContact(contactId: number): Promise<void> {
    await apiClient.delete(`/api/v1/contacts/${contactId}`);
}

export async function generateInviteLink(contactId: number): Promise<string> {
    const { data } = await apiClient.post<{ link: string }>(
        `/api/v1/contacts/${contactId}/invite`
    );
    return data.link;
}