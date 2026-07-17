export interface ProtectedPerson {
    id: number;
    protectedUserId: number | null;
    fullName: string;
    relationship: string;
    contactNumber: string;
    email: string;
    notifyHighRisk: boolean;
    receiveAlertSummaries?: boolean;
    sensitivityLevel: string;
    status?: string;
    image?: string;
}

export interface UpdateProtectedConfig {
    sensitivity: string;
    urgentMonitoring: boolean;
    weeklySummary: boolean;
}

export interface UpdateProtectedInfo {
    fullName: string;
    relationship: string;
    contactNumber: string;
    image?: string;
}