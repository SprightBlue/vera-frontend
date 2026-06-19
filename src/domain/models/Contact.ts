export type ContactStatus = "ACTIVE" | "PENDING";

export interface Contact {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    relationship: string;
    emergencyContact: boolean;
    status: ContactStatus;
}
