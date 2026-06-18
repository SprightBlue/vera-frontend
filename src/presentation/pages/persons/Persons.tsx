import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Mail } from "lucide-react";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { deleteProtectedPerson } from "../../../infrastructure/api/protected-person-api";

interface ProtectedPerson {
  id: number;
  fullName: string;
  email: string;
  contactNumber: string;
  relationship: string;
  status: string;
  photo?: string;
  lastActivity?: string;
}

function Persons() {

  const { user } = useAuth();
  const [persons, setPersons] = useState<ProtectedPerson[]>([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const miToken = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token') || '';

        const response = await axios.get('http://localhost:8080/api/v1/trust/protected-people', {
          headers: { Authorization: `Bearer ${miToken}` }
        });
        setPersons(response.data);
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

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("¿Estás seguro de que querés eliminar a esta persona de tus protegidos?");
    if (!confirmed) return;

    try {
      await deleteProtectedPerson(id);

      setPersons(persons.filter(person => person.id !== id));

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
            <h1 className="text-2xl font-semibold text-white mb-8">
              Todas las personas que cuido
            </h1>
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
                      <img
                        src={person.photo ||
                          `https://ui-avatars.com/api/?name=${person.fullName}&background=0D8ABC&color=fff`}
                        className="w-20 h-20 rounded-full object-cover border border-white/10">
                      </img>
                      {/* Info */}
                      <div className="flex flex-col gap-1">
                        <h2 className="text-white text-lg font-semibold">
                          {person.fullName}
                        </h2>

                        <p className="text-md text-blue-400">
                          {person.relationship}
                        </p>

                        <p className="text-sm text-gray-400">
                          Última actividad: {person.lastActivity || 'Sin actividad reciente'}
                        </p>
                        {person.status === 'PENDING' && (
                          <span className="bg-yellow-500/20 text-yellow-500 text-sm px-4 py-1 rounded mt-2 inline-block w-fit">
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
      </main>
    </div>
  );
}

export default Persons;