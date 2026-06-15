import { useEffect, useState } from "react";
import { getIncidentDetail } from "../../../infrastructure/api/incidents-api";
import type { IncidentDetail } from "../../../domain/models/Incident";

export function useIncidentDetail(incidentId: string | undefined) {
    const [incident, setIncident] = useState<IncidentDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!incidentId) return;
        setLoading(true);
        getIncidentDetail(incidentId)
            .then(setIncident)
            .catch(() => setError("No se pudo cargar el incidente."))
            .finally(() => setLoading(false));
    }, [incidentId]);

    return { incident, setIncident, loading, error };
}