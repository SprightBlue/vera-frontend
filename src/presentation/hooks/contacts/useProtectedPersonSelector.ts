import { useEffect, useState } from "react";
import { getProtectedPersons, type ProtectedPerson } from "../../../infrastructure/api/protected-person-api";

export function useProtectedPersonSelector() {
    const [persons, setPersons] = useState<ProtectedPerson[]>([]);
    const [selected, setSelected] = useState<ProtectedPerson | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getProtectedPersons()
            .then((data) => {
                const active = data.filter(p => p.status === "ACTIVE" || p.protectedUserId !== null);
                setPersons(active);
                if (active.length > 0) setSelected(active[0]);
            })
            .catch((err) => {
                const status = err?.response?.status;
                if (status && status >= 500) {
                    setError("Ocurrió un error al cargar los datos. Intentá de nuevo más tarde.");
                }
                setPersons([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return { persons, selected, setSelected, loading, error };
}