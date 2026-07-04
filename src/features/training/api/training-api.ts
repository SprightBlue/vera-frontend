import api from "@/infrastructure/api/api";

export interface ScenarioOptionDto {
    id: string;
    label: string;
    displayOrder: number;
}

export interface TrainingScenarioDto {
    id: string;
    title: string;
    scenarioType: "WHATSAPP" | "SMS" | "EMAIL";
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    senderName: string;
    senderContact: string;
    messageBody: string;
    options: ScenarioOptionDto[];
}

export interface TrainingSessionResult {
    sessionId: string;
    scenarioId: string;
    scenarioTitle: string;
    scenarioType: string;
    correct: boolean;
    selectedOptionLabel: string;
    feedback: string;
    warningSignals: string | null;
    completedAt: string;
}

export interface TrainingStatsDto {
    completed: number;
    correct: number;
    incorrect: number;
    correctRate: number;
    detectedScams: number;
}

export interface DailyProgressPoint {
    date: string;
    correctRate: number;
    total: number;
}

export interface RecentSessionSummary {
    sessionId: string;
    scenarioTitle: string;
    scenarioType: string;
    correct: boolean;
    completedAt: string;
}

export interface TrainingProgressDto {
    stats: TrainingStatsDto;
    dailyProgress: DailyProgressPoint[];
    recentSessions: RecentSessionSummary[];
}

export async function getScenarios(): Promise<TrainingScenarioDto[]> {
    const res = await api.get<TrainingScenarioDto[]>("/api/v1/training/scenarios");
    return res.data;
}

export async function submitAnswer(scenarioId: string, selectedOptionId: string
): Promise<TrainingSessionResult> {
    const res = await api.post<TrainingSessionResult>(
        `/api/v1/training/scenarios/${scenarioId}/submit`,
        { selectedOptionId }
    );
    return res.data;
}

export async function getProgressForProtected(trustContactId: number): Promise<TrainingProgressDto> {
    const res = await api.get<TrainingProgressDto>(
        `/api/v1/training/protected-person/${trustContactId}/progress`
    );
    return res.data;
}

export async function assignScenario(trustContactId: number, scenarioId: string): Promise<void> {
    await api.post(`/api/v1/training/protected-person/${trustContactId}/assign`, { scenarioId });
}