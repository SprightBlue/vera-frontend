import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, ChevronDown, Users } from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import { useAuth } from "../../context/AuthContext";
import { getProtectedPersons, deleteProtectedPerson } from "../../../infrastructure/api/protected-person-api";
import CreateProtectedPersonModal from "../../components/protected-persons/CreateProtectedPersonModal";
import type { ProtectedPerson } from "../../../domain/models/ProtectedPerson";
import {PersonAvatar} from "@/presentation/components/common/PersonAvatar.tsx";

function Persons() {

  const navigate = useNavigate();
  const { user } = useAuth();
  const [persons, setPersons] = useState<ProtectedPerson[]>([]);
  const [relationshipFilter, setRelationshipFilter] = useState("Todos");
  const [cargando, setCargando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [open, setOpenFilter] = useState(false);

  // Opciones del filtro por "Tipo de relación"
  const options = [
    "Todos",
    "Familiar",
    "Contacto de confianza",
    "Profesional"
  ];

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        await loadProtectedPersons();
      }
      catch {
        toast.error("No se pudieron cargar las personas protegidas");
      }
      finally {
        setCargando(false);
      }
    };
    fetchPersons();
  }, []);

  // Se obtienen todas las personas protejidas por el usuario
  const loadProtectedPersons = useCallback(async () => {
    try {
      const protectedPersons = await getProtectedPersons();
      if (protectedPersons.length > 0) {
        setPersons(protectedPersons);
      }
    }
    catch {
      toast.error("Error cargando personas protegidas");
    }
  }, [user?.role]);

  // Se crea la lista filtrada y se actualiza al cambiar el valor del select
  const filteredPersons = persons.filter((person) => {
    if (relationshipFilter === "Todos") return true;

    return person.relationship === relationshipFilter;
  });

  // Se elimina una persona protejida asociada a un usuario
  const handleDelete = async (id: number, fullName: string, status: string) => {
    toast(
        (t) => (
            <div className="flex flex-col gap-3 text-white min-w-[260px]">
              <p className="text-white text-sm">
                ¿Eliminar a <span className="font-semibold">{fullName}</span> de tus protegidos?
              </p>
              <div className="flex justify-end gap-2">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition"
                >
                  Cancelar
                </button>
                <button
                    onClick={async () => {
                      toast.dismiss(t.id);
                      try {
                        await deleteProtectedPerson(id, status);
                        setPersons(prev => prev.filter(person => person.id !== id));
                        toast.success(`${fullName} fue eliminado correctamente`);
                      } catch {
                        toast.error("No se pudo eliminar la persona");
                      }
                    }}
                    className="px-3 py-1.5 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
        ),
        {
          style: {
            background: "#070B1A",
            border: "1px solid #182033",
            borderRadius: "0.75rem",
            padding: "1rem",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.4)",
          },
        }
    );
  };

  return (

    <div className="flex min-h-screen bg-[#050816]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 ml-[79.2px] lg:ml-[224px]">
        <Header
          userName={user?.fullName ?? "Usuario"}
          title="Personas que cuido"
          subtitle="Observa los detalles de cada persona a la que protejes"
        />

        <div className="flex justify-center p-8">
          <div className="w-full max-w-5xl mx-auto rounded-2xl bg-[#070B1A] border border-[#182033] p-12">
            <div className="flex flex-col md:flex-row justify-between mb-8">
              {/* Filtro por tipo de relación */}
              <div className="flex items-center gap-3">
                <label className="text-gray-500 font-semibold">
                  Filtrar por:
                </label>
                <div className="relative w-50" tabIndex={0}
                  onBlur={() => setOpenFilter(false)}>
                  <button
                    onClick={() => setOpenFilter(!open)}
                    className="w-full px-5 py-2.5 rounded-xl border border-white/10 bg-[#0B1120] text-white text-left hover:bg-white/10 transition-all cursor-pointer"
                  >
                    {relationshipFilter}

                    <ChevronDown
                      size={18}
                      className={`absolute right-4 top-3.5 transition-transform ${open ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {open && (
                    <div className="absolute z-10 mt-2 w-full rounded-xl border border-white/10 bg-[#0B1120] overflow-hidden">
                      {options.map(option => (
                        <div
                          key={option}
                          onMouseDown={() => {
                            setRelationshipFilter(option);
                            setOpenFilter(false);
                          }}
                          className="px-5 py-2.5 text-white cursor-pointer hover:bg-white/10 transition-colors"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Boton para añadir protejido */}
              <button
                id="add-protected-btn"
                onClick={() => setShowModal(true)}
                className="px-8 py-2.5 mt-4 md:mt-0 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium cursor-pointer"
              >
                <span className="text-lg pr-2">+</span>
                Añadir protegido
              </button>
            </div>
            {/* Tarjetas de personas protejidas */}
            {cargando ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 py-8 flex justify-between items-center">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 w-48 bg-slate-800 rounded" />
                      <div className="h-3 w-32 bg-slate-800/60 rounded" />
                    </div>
                    <div className="h-8 w-24 bg-slate-800 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredPersons.length > 0 ? (
              <div className="flex flex-col gap-5">
                {filteredPersons.map((person) => (
                  <div
                    key={person.id}
                    className="rounded-3xl bg-[#0d1222] border border-[#182033] p-6 flex flex-col lg:flex-row items-center justify-between"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <PersonAvatar fullName={person.fullName} image={person.image} size="md" />
                      <div className="flex flex-col gap-1">
                        <h2 className="text-white text-lg font-semibold">
                          {person.fullName}
                        </h2>

                        <p className="text-md text-blue-400">
                          {person.relationship}
                        </p>

                        <p className="text-sm text-gray-400">
                          Última actividad: Sin actividad reciente
                        </p>
                        {person.status === 'PENDING' && (
                          <span className="bg-yellow-500/20 text-yellow-500 text-sm px-4 py-1 rounded-full border border-yellow-500/30 mt-2 inline-block w-fit">
                            Invitación Pendiente
                          </span>
                        )}

                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-5 mt-2">
                          {person.contactNumber && (
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <Phone size={15} />
                              {person.contactNumber}
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <Mail size={15} />
                            {person.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6 lg:mt-0">
                      <button
                        onClick={() => handleDelete(person.id, person.fullName, person.status ?? "PENDING")}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 transition px-5 py-2 rounded-xl font-medium cursor-pointer"
                      >
                        Eliminar
                      </button>

                      <button
                        onClick={() => navigate(`/persons/${person.id}?status=${person.status}`)}
                        className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-xl font-medium cursor-pointer"
                      >
                        Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-20 gap-4 text-center pb-20">
                <div className="p-4 rounded-full bg-slate-900 border border-slate-800">
                  <Users size={40} className="text-slate-600" />
                </div>
                <div>
                  <h3 className="text-slate-200 font-semibold text-lg">No tenés personas protegidas aún.</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
                    Invitá a una persona de confianza para que se una a tu círculo de protección.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal para añadir protejido */}
        {showModal && (
          <CreateProtectedPersonModal
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              loadProtectedPersons();
            }}
          />
        )}
      </main>
    </div>
  );
}

export default Persons;