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
                setPersons(data);
                if (data.length > 0) setSelected(data[0]);
            })
            .catch(() => setError("No se pudieron cargar las personas protegidas."))
            .finally(() => setLoading(false));
    }, []);

    return { persons, selected, setSelected, loading, error };
}