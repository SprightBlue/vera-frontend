import { useEffect, useState } from "react";
import { ArrowLeft, Bell, ShieldAlert, ShieldCheck, Mail } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProtectedPersons, updateProtectedPerson } from "../../../infrastructure/api/protected-person-api";

// Definimos una interfaz local para evitar problemas con 'any'
interface APIProtectedPerson {
  id: number;
  sensitivityLevel: string;
  notifyHighRisk: boolean;
  weeklySummaryEnabled?: boolean;
}

function PersonConfiguration() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.personId; 
  const [isSaving, setIsSaving] = useState(false); 

  // Estado limpio: Solo las tres propiedades reales que soporta nuestro backend
  const [formData, setFormData] = useState({
    sensitivity: "balanced",
    urgentMonitoring: true,
    weeklySummary: false,
  });

  useEffect(() => {
    async function fetchCurrentSettings() {
      if (!id) return;
      
      try {
        const data = await getProtectedPersons();
        const currentPerson = data.find((p: APIProtectedPerson) => p.id === Number(id));
        
        if (currentPerson) {
          let sensitivityReact = "balanced";
          if (currentPerson.sensitivityLevel === "ALTO") sensitivityReact = "high";
          if (currentPerson.sensitivityLevel === "BAJO") sensitivityReact = "low";

          setFormData({
            sensitivity: sensitivityReact,
            urgentMonitoring: currentPerson.notifyHighRisk ?? true, 
            weeklySummary: currentPerson.weeklySummaryEnabled ?? false,
          });
        }
      } catch (error) {
        console.error("Error al traer la configuración:", error);
      }
    }

    fetchCurrentSettings();
  }, [id]);

  const handleSensitivityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, sensitivity: value }));
  };

  const handleToggle = (field: "urgentMonitoring" | "weeklySummary") => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  async function handleSubmit() {
    if (!id) {
        alert("¡FALTA EL ID! Revisa la navegación desde la pantalla anterior.");
        return;
    }
    
    try {
      setIsSaving(true);
      await updateProtectedPerson(Number(id), formData);
      alert("¡Configuración guardada con éxito!");
      navigate(`/persons/${id}`);
    } catch (error) {
      console.error("Error al actualizar configuración:", error);
      alert("Error al intentar guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#050816]">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 ml-[260px]">
        <Header
          userName={user?.fullName || "Usuario"}
          title="Personas que cuido"
          subtitle="Observa los detalles de cada persona a la que protejes"
        />
        
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate('/persons')}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-white">Configurar alertas</h1>
            </div>
          </div>

          {/* Info Principal */}
          <div className="bg-[#0d1222] border border-[#182033] rounded-2xl p-6 flex gap-3 items-start">
            <ShieldCheck className="text-white mt-1" size={22} />
            <div>
              <h2 className="font-semibold text-white text-xl">Control de permisos</h2>
              <p className="text-sm text-slate-400 mt-1">
                El perfil podrá modificar estas configuraciones en cualquier momento.
              </p>
            </div>
          </div>

          {/* Grid de Configuraciones Reales */}
          <div className="grid md:grid-cols-2 gap-5">
            
            {/* Sensibilidad */}
            <div className="bg-[#0d1222] border border-[#182033] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="text-white" size={20} />
                <h3 className="font-semibold text-xl">Sensibilidad de alertas</h3>
              </div>
              <p className="text-sm text-slate-400 mb-5">Elegí la frecuencia de notificaciones.</p>

              <div className="flex gap-4 rounded-xl p-1">
                {["low", "balanced", "high"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleSensitivityChange(level)}
                    className={`flex py-2 px-6 rounded-lg text-sm font-medium border border-[#1f2937] bg-[#0b1220] transition-all cursor-pointer ${
                      formData.sensitivity === level ? "bg-blue-600 text-white" : "text-slate-300"
                    }`}
                  >
                    {level === "low" ? "Bajo" : level === "balanced" ? "Medio" : "Alto"}
                  </button>
                ))}
              </div>
            </div>

            {/* Alertas Urgentes */}
            <div className="bg-[#0d1222] border border-[#182033] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="text-white" size={20} />
                <h3 className="font-semibold text-xl">Alertas urgentes</h3>
              </div>
              <p className="text-sm text-slate-400 mb-5">Notificaciones inmediatas para actividades sospechosas.</p>

              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-medium text-white">Monitoreo activo</span>
                <button
                  type="button"
                  onClick={() => handleToggle("urgentMonitoring")}
                  className={`w-14 h-8 rounded-full transition-all relative cursor-pointer ${
                    formData.urgentMonitoring ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                      formData.urgentMonitoring ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Resúmenes Semanales (Nuevo bloque real, ocupando todo el ancho abajo) */}
            <div className="bg-[#0d1222] border border-[#182033] rounded-2xl p-6 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="text-white" size={20} />
                <h3 className="font-semibold text-xl">Resúmenes Semanales</h3>
              </div>
              <p className="text-sm text-slate-400 mb-5">Recibir informes consolidados de actividad cada semana.</p>

              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-medium text-white">Enviar reportes por correo</span>
                <button
                  type="button"
                  onClick={() => handleToggle("weeklySummary")}
                  className={`w-14 h-8 rounded-full transition-all relative cursor-pointer ${
                    formData.weeklySummary ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                      formData.weeklySummary ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

          </div>

          {/* Botones de acción */}
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold cursor-pointer"
            >
              {isSaving ? "Guardando..." : "Guardar preferencias"}
            </button>

            <button
              type="button"
              className="px-5 py-3 rounded-xl border border-[#1f2937] text-slate-300 hover:bg-[#111827] cursor-pointer"
              onClick={() => navigate(`/persons`)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PersonConfiguration;