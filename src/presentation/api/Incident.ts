export interface IncidentStep {
    id?: string;
    stepKey: string;
    title: string;
    description: string;
    stepOrder: number;
    priority: boolean;
    completed: boolean;
    completedAt?: string;
}

export interface IncidentDetail {
    id: string;
    actionType: string;
    sharedDataTypes: string[];
    description: string;
    status: string;
    protectedUserName: string;
    createdAt: string;
    completedAt?: string;
    prioritySteps: IncidentStep[];
    recommendedSteps: IncidentStep[];
    totalSteps: number;
    completedStepsCount: number;
    priorityStepsCount: number;
    completedPriorityStepsCount: number;
}

export interface IncidentSummary {
    id: string;
    actionType: string;
    status: string;
    createdAt: string;
    completedStepsCount: number;
    totalSteps: number;
}

export const ACTION_TYPE_LABELS: Record<string, string> = {
    SHARED_PERSONAL_OR_BANKING_DATA: "Compartió datos personales o bancarios",
    CLICKED_SUSPICIOUS_LINK: "Hizo clic en un link sospechoso",
    TRANSFERRED_MONEY:  "Realizó una transferencia",
    DOWNLOADED_FILE_OR_APP: "Descargó un archivo o aplicación",
    OTHER_NOT_SURE: "Otra situación / No sabe bien",
};

export const SHARED_DATA_TYPE_LABELS: Record<string, string> = {
    BANKING_DATA: "Datos bancarios",
    CREDENTIALS: "Usuario y contraseña",
    DNI: "Número de DNI",
    PERSONAL_INFO: "Información personal",
    OTHER: "Otro",
};