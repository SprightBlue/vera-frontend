import { useCallback, useEffect, useState } from "react";
import { getProgressForProtected, getScenarios, assignScenario, type TrainingProgressDto, type TrainingScenarioDto,} from "../api/training-api";
import { getProtectedPersons } from "@/presentation/api/protected-person-api";
import type { ProtectedPerson } from "@/presentation/api/ProtectedPerson.ts";

export function useTraining() {
    const [persons, setPersons] = useState<ProtectedPerson[]>([]);
    const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
    const [progress, setProgress] = useState<TrainingProgressDto | null>(null);
    const [scenarios, setScenarios] = useState<TrainingScenarioDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getProtectedPersons()
            .then((data) => {
                setPersons(data);
                if (data.length > 0) setSelectedPersonId(data[0].id);
            })
            .catch(() => setError("No se pudieron cargar los protegidos."));

        getScenarios()
            .then(setScenarios)
            .catch(() => {});
    }, []);

    const loadProgress = useCallback(async (trustContactId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProgressForProtected(trustContactId);
            setProgress(data);
        } catch {
            setError("No se pudo cargar el progreso.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedPersonId != null) {
            void loadProgress(selectedPersonId);
        }
    }, [selectedPersonId, loadProgress]);

    const handleAssign = useCallback(
        async (scenarioId: string) => {
            if (selectedPersonId == null) return;
            setAssigning(true);
            try {
                await assignScenario(selectedPersonId, scenarioId);
                await loadProgress(selectedPersonId);
            } finally {
                setAssigning(false);
            }
        },
        [selectedPersonId, loadProgress]
    );

    const selectPerson = useCallback((id: number) => setSelectedPersonId(id), []);

    const selectedPerson = persons.find((p) => p.id === selectedPersonId) ?? null;

    return {
        persons,
        selectedPersonId,
        selectedPerson,
        selectPerson,
        progress,
        scenarios,
        loading,
        assigning,
        error,
        handleAssign,
    };
}