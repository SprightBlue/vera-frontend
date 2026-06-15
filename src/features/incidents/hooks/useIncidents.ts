import { useState, useEffect } from "react";
import { getProtectedPersons } from "../../../infrastructure/api/protected-person-api";
import {
    getIncidentsByTrustContact,
    getIncidentDetail,
} from "../../../infrastructure/api/incidents-api";
import type { IncidentSummary, IncidentDetail } from "../../../domain/models/Incident";

export interface Person { id: number; fullName: string; status: string; }

export const PAGE_SIZE = 5;

export function useIncidents() {
    const [persons, setPersons] = useState<Person[]>([]);
    const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
    const [incidents, setIncidents] = useState<IncidentSummary[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loadingList, setLoadingList] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [detail, setDetail] = useState<IncidentDetail | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        getProtectedPersons()
            .then(data => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const active = (data as any[]).filter(p => p.status === "ACTIVE") as Person[];
                setPersons(active);
                if (active.length > 0) setSelectedPersonId(active[0].id);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedPersonId == null) return;
        setLoadingList(true);
        setSelectedId(null);
        setDetail(null);
        getIncidentsByTrustContact(selectedPersonId, currentPage, PAGE_SIZE)
            .then(res => {
                setIncidents(res.content);
                setTotalElements(res.totalElements);
                setTotalPages(res.totalPages);
            })
            .catch(console.error)
            .finally(() => setLoadingList(false));
    }, [selectedPersonId, currentPage]);

    useEffect(() => {
        if (!selectedId) return;
        setLoadingDetail(true);
        getIncidentDetail(selectedId)
            .then(setDetail)
            .catch(console.error)
            .finally(() => setLoadingDetail(false));
    }, [selectedId]);

    function selectPerson(id: number) {
        setSelectedPersonId(id);
        setCurrentPage(0);
        setSelectedId(null);
        setDetail(null);
    }

    function goToPage(page: number) {
        setCurrentPage(page);
        setSelectedId(null);
        setDetail(null);
    }

    function closeDetail() {
        setSelectedId(null);
        setDetail(null);
    }

    return {
        persons,
        selectedPersonId,
        selectedPerson: persons.find(p => p.id === selectedPersonId) ?? null,
        selectPerson,
        incidents,
        totalElements,
        totalPages,
        currentPage,
        loadingList,
        goToPage,
        selectedId,
        detail,
        loadingDetail,
        selectIncident: setSelectedId,
        closeDetail,
    };
}