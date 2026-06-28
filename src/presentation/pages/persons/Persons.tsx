import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Mail } from "lucide-react";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import { useAuth } from "../../context/AuthContext";
import {getProtectedPersons, deleteProtectedPerson, type ProtectedPerson } from "../../../infrastructure/api/protected-person-api";
import CreateProtectedPersonModal from "../../components/protected-persons/CreateProtectedPersonModal";

function Persons() {

  const navigate = useNavigate();
  const { user } = useAuth();
  const [persons, setPersons] = useState<ProtectedPerson[]>([]);
  const [cargando, setCargando] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        await loadProtectedPersons();
      }
      catch (error) {
        console.error("Error al cargar personas del backend", error);
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
    catch (error) {
      console.error("Error cargando protegidos:", error);
    }
  }, [user?.role]); 

  // Se elimina una persona protejida asociada a un usuario
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("¿Estás seguro de que querés eliminar a esta persona de tus protegidos?");
    if (!confirmed) return;

    try {
      await deleteProtectedPerson(id);

      setPersons(prev => prev.filter(person => person.id !== id));

    } catch (error) {
      console.error("Error al eliminar la persona:", error);
      alert("Hubo un error al intentar eliminar a la persona.");
    }
  };

  return (

    <div className="flex min-h-screen bg-[#050816]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 ml-[260px]">
        <Header
          userName={user?.fullName ?? "Usuario"}
          title="Personas que cuido"
          subtitle="Observa los detalles de cada persona a la que protejes"
        />

        <div className="flex justify-center p-8">
          <div className="w-full bg-[#0d1222] border border-[#182033] rounded-3xl py-8 px-12">
            <div className="flex justify-between mb-8">
              <h1 className="text-2xl font-semibold text-white">
                Todas las personas que cuido
              </h1>
              <button
                id="add-protected-btn"
                onClick={() => setShowModal(true)}
                className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium cursor-pointer"
              >
                Añadir protegido
              </button>
            </div>
            {cargando ? (
              <p className="bg-slate-900/50 border border-slate-800/60 px-8 py-6 rounded-2xl text-gray-400 text-lg">Cargando...</p>
            ) : (
              <div className="flex flex-col gap-5">
                {persons.map((person) => (
                  <div
                    key={person.id}
                    className="rounded-3xl border border-slate-800 bg-[#111827] p-6 flex flex-col lg:flex-row items-center justify-between"
                  >
                    {/* Left */}
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {/* Photo */}
                      {person?.image ? (
                        <img
                          src={person.image}
                          alt="Perfil"
                          className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white">
                          {person?.fullName?.charAt(0) || "U"}
                        </div>
                      )}
                      {/* Info */}
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
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <Phone size={15} />
                            {person.contactNumber}
                          </div>

                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <Mail size={15} />
                            {person.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6 lg:mt-0">
                      <button
                        onClick={() => handleDelete(person.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 transition px-5 py-2 rounded-xl font-medium cursor-pointer"
                      >
                        Eliminar
                      </button>

                      <button
                        onClick={() => navigate(`/persons/${person.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-xl font-medium cursor-pointer"
                      >
                        Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {showModal && (
          <CreateProtectedPersonModal
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              loadProtectedPersons();
              setShowModal(false);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default Persons;