import { apiClient } from "./auth.repository";
import type { Contact } from "../../domain/models/Contact";

export interface AddContactRequest {
    contactEmail: string;
    relationship: string;
}

// CORREGIDO: Ruta limpia hacia el recurso de contactos filtrando por el ID de la persona protegida
export async function getContactsByProtectedPerson(protectedPersonId: number): Promise<Contact[]> {
    const { data } = await apiClient.get<Contact[]>(
        `/api/v1/contacts/protected/${protectedPersonId}`
    );
    return data;
}

// CORREGIDO: El POST para añadir un contacto a un protegido específico
export async function addContact(
    protectedPersonId: number,
    payload: AddContactRequest
): Promise<Contact> {
    const { data } = await apiClient.post<Contact>(
        `/api/v1/contacts/protected/${protectedPersonId}`,
        payload
    );
    return data;
}

// Mantiene la eliminación del contacto por su ID único de relación
export async function removeContact(contactId: number): Promise<void> {
    await apiClient.delete(`/api/v1/contacts/${contactId}`);
}

// Mantiene la generación del link de invitación usando el ID del contacto creado
export async function generateInviteLink(contactId: number): Promise<string> {
    const { data } = await apiClient.post<{ link: string }>(
        `/api/v1/contacts/${contactId}/invite`
    );
    return data.link;
}