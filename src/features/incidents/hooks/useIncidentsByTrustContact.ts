import { useEffect, useState } from "react";
import { getIncidentsByTrustContact } from "@/presentation/api/incidents-api";
import type { IncidentSummary } from "@/presentation/api/Incident.ts";

export function useIncidentsByTrustContact(trustContactId: number | null) {
    const [incidents, setIncidents] = useState<IncidentSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!trustContactId) return;
        setLoading(true);
        getIncidentsByTrustContact(trustContactId)
            .then(data => setIncidents(data.content))
            .catch(() => setError("No se pudieron cargar los incidentes."))
            .finally(() => setLoading(false));
    }, [trustContactId]);

    return { incidents, loading, error };
}