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
                // Solo mostramos personas activas (que aceptaron la invitación)
                // para gestionar sus contactos de confianza
                const active = data.filter(p => p.status === "ACTIVE" || p.protectedUserId !== null);
                setPersons(active);
                if (active.length > 0) setSelected(active[0]);
            })
            .catch(() => setError("No se pudieron cargar las personas protegidas."))
            .finally(() => setLoading(false));
    }, []);

    return { persons, selected, setSelected, loading, error };
}
