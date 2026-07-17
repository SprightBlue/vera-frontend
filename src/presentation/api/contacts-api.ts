import { apiClient } from "./auth.repository.ts";
import type { Contact } from "./Contact.ts";

export interface AddContactRequest {
    fullName: string;
    contactPhone?: string;
    contactEmail: string;
    relationship: string;
    sensitivityLevel: "BAJO" | "MEDIO" | "ALTO";
    notifyHighRisk: boolean;
    receiveAlertSummaries: boolean;
}

export interface InviteContactResponse {
    token: string;
    invitationLink: string;
}

export async function getContactsByProtectedPerson(protectedUserId: number): Promise<Contact[]> {
    const { data } = await apiClient.get<Contact[]>(
        `/api/v1/contacts/protected-person/${protectedUserId}`
    );
    return data;
}

export async function addContact(
    protectedUserId: number,
    payload: AddContactRequest
): Promise<Contact> {
    const { data } = await apiClient.post<Contact>(
        `/api/v1/contacts/protected-person/${protectedUserId}`,
        payload
    );
    return data;
}

export async function inviteContact(
    protectedUserId: number,
    payload: AddContactRequest
): Promise<InviteContactResponse> {
    const { data } = await apiClient.post<InviteContactResponse>(
        `/api/v1/contacts/protected-person/${protectedUserId}/invite`,
        payload
    );
    return data;
}

export async function removeContact(contactId: number): Promise<void> {
    await apiClient.delete(`/api/v1/contacts/${contactId}`);
}