export type ContactStatus = "ACTIVE" | "PENDING";

export interface Contact {
    id: number;
    fullName: string;
    email: string;
    relationship: string;
    status: ContactStatus;
}