import { useState, useEffect } from "react";
import { getProtectedPersons } from "@/presentation/api/protected-person-api";
import {
    getIncidentsByTrustContact,
    getIncidentDetail,
    getMyIncidents,
} from "@/presentation/api/incidents-api";
import type { IncidentSummary, IncidentDetail } from "@/presentation/api/Incident.ts";
import { useAuth } from "../../../presentation/context/AuthContext";
import toast from "react-hot-toast";
import type {ProtectedPerson} from "@/presentation/api/ProtectedPerson.ts";

export const PAGE_SIZE = 5;

export function useIncidents() {
    const { user } = useAuth();

    const [persons, setPersons] = useState<ProtectedPerson[]>([]);
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
        if (user?.role === 'PROTECTED') {
            if (user.id) {
                setSelectedPersonId(user.id);
            }
        } else if (user?.role === 'CARER') {
            getProtectedPersons()
                .then(data => {
                    const active = data.filter(p => p.status === "ACTIVE");
                    setPersons(active);
                    if (active.length > 0) setSelectedPersonId(active[0].id);
                })
                .catch(() => toast.error("No se pudieron cargar las personas protegidas"));
        }
    }, [user]);

    useEffect(() => {
        if (user?.role === 'CARER' && selectedPersonId == null) return;        

        setLoadingList(true);
        setSelectedId(null);
        setDetail(null);
        
        const fetchIncidents = user?.role === 'PROTECTED'
            ? getMyIncidents(currentPage, PAGE_SIZE) 
            : getIncidentsByTrustContact(selectedPersonId!, currentPage, PAGE_SIZE); 
          
        fetchIncidents
            .then(res => {
                setIncidents(res.content);
                setTotalElements(res.totalElements);
                setTotalPages(res.totalPages);
            })
            .catch(() => toast.error("No se pudieron cargar los incidentes"))
            .finally(() => setLoadingList(false));
    }, [selectedPersonId, currentPage]);

    useEffect(() => {
        if (!selectedId) return;
        setLoadingDetail(true);
        getIncidentDetail(selectedId)
            .then(setDetail)
            .catch(() => toast.error("No se pudo cargar el detalle del incidente"))
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