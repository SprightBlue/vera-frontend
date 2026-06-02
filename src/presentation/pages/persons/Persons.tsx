import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import { Phone, Mail } from "lucide-react";
/* Utilizar cuando se haga la conexion con backend */
//import { ProtectedPersonApi } from "../../../infrastructure/api/protected-person-api";

interface ProtectedPerson {
  id: number;
  photo: string;
  fullName: string;
  relationshipType: string;
  lastActivity: string;
  phone: string;
  email: string;
}

async function getProtectedPeople(): Promise<ProtectedPerson[]> {
  // Simulación de API

  return [
    {
      id: 1,
      photo:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      fullName: "Sophia Williams",
      relationshipType: "Familiar",
      lastActivity: "Hace 2 minutos",
      phone: "+1 202 555 0123",
      email: "sophia@example.com",
    },
    {
      id: 1,
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      fullName: "Michael Johnson",
      relationshipType: "Profesional",
      lastActivity: "10 minutes ago",
      phone: "+1 202 555 0199",
      email: "michael@example.com",
    },
    {
      id: 1,
      photo:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      fullName: "Emma Brown",
      relationshipType: "Familiar",
      lastActivity: "30 minutes ago",
      phone: "+1 202 555 0177",
      email: "emma@example.com",
    },
  ];
}

function Persons() {

  const [people, setPeople] = useState<ProtectedPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const data = await getProtectedPeople();
        setPeople(data);
      } catch (error) {
        console.error("Error loading protected people", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  return (

    <div className="flex min-h-screen bg-[#050816]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 ml-[260px]">
        <Header
          userName="Usuario"
          title="Personas que cuido"
          subtitle="Observa los detalles de cada persona a la que protejes"
        />

        <div className="w-full max-w-3xl p-8">
          <h1 className="text-2xl font-semibold text-white mb-8">
            Todas las personas que cuido
          </h1>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="flex flex-col gap-4">
              {people.map((person) => (
                <div
                  key={person.id}
                  className="bg-[#0d1222] border border-[#182033] rounded-2xl p-5 flex items-center justify-between shadow-lg"
                >
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    {/* Photo */}
                    <img
                      src={person.photo}
                      alt={person.fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#2f3b55]"
                    />

                    {/* Info */}
                    <div className="flex flex-col gap-1">
                      <h2 className="text-white text-lg font-semibold">
                        {person.fullName}
                      </h2>

                      <p className="text-sm text-blue-400">
                        {person.relationshipType}
                      </p>

                      <p className="text-sm text-gray-400">
                        Última actividad: {person.lastActivity}
                      </p>

                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-5 mt-2">
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <Phone size={15} />
                          {person.phone}
                        </div>

                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <Mail size={15} />
                          {person.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <button onClick={() => navigate(`/persons/${person.id}`)} className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-xl font-medium cursor-pointer">
                    Detalles
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Persons;