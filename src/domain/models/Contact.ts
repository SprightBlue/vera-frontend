export type ContactStatus = "ACTIVE" | "PENDING";
export type SensitivityLevel = "BAJO" | "MEDIO" | "ALTO";

export interface Contact {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    relationship: string;
    sensitivityLevel: SensitivityLevel;
    notifyHighRisk: boolean;
    receiveAlertSummaries: boolean;
    status: ContactStatus;
}