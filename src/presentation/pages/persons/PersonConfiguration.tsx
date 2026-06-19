import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { Bell, ShieldAlert, MapPin, MessageSquare, ShieldCheck, Grid2X2 } from "lucide-react";
import { getProtectedPersons, updateProtectedPerson } from "../../../infrastructure/api/protected-person-api";

function PersonConfiguration() {

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.personId || {}; 
  const [isSaving, setIsSaving] = useState(false); 

  // Se crea un form data donde se cargan los datos del formulario
  const [formData, setFormData] = useState({
    sensitivity: "balanced",
    urgentMonitoring: true,
    locationSharing: true,
    messageProtection: true,
    visibleData: {
      deviceHealth: true,
      emergencyContacts: true,
      privateMessages: false,
    },
  });

  useEffect(() => {
    async function fetchCurrentSettings() {
      if (!id) return;
      
      try {
        const data = await getProtectedPersons();
        const currentPerson = data.find((p: any) => p.id === Number(id));
            if (currentPerson) {
              let sensitivityReact = "balanced";
              
              if (currentPerson.sensitivityLevel === "ALTO") sensitivityReact = "high";
              if (currentPerson.sensitivityLevel === "BAJO") sensitivityReact = "low";

              setFormData((prev) => ({
                ...prev,
                sensitivity: sensitivityReact,
                urgentMonitoring: currentPerson.notifyHighRisk ?? true, 
              }));
            }
      } catch (error) {
        console.error("Error al traer la configuración:", error);
      }
    }

    fetchCurrentSettings();
  }, [id]);

  // Cambia cada opción de sensibilidad de alertas
  const handleSensitivityChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      sensitivity: value,
    }));
  };

  // Cambia cada switch de configuración
  const handleToggle = (field: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Modifica las opciones de la información visible
  const handleVisibleData = (field: string) => {
    setFormData((prev: any) => ({
      ...prev,
      visibleData: {
        ...prev.visibleData,
        [field]: !prev.visibleData[field],
      },
    }));
  };

  async function handleSubmit() {
    console.log("El ID actual es:", id); 
    
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

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
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

          {/* Info */}
          <div className="bg-[#0d1222] border border-[#182033] rounded-2xl p-6 flex gap-3 items-start">
            <ShieldCheck className="text-white mt-1" size={22} />

            <div>
              <h2 className="font-semibold text-white text-xl">
                Control de permisos
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                El perfil podrá modificar estas configuraciones en cualquier
                momento.
              </p>
            </div>
          </div>

          {/* Top cards */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Sensitivity */}
            <div className="bg-[#0d1222] border border-[#182033] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="text-white" size={20} />

                <h3 className="font-semibold text-xl">
                  Sensibilidad de alertas
                </h3>
              </div>

              <p className="text-sm text-slate-400 mb-5">
                Elegí la frecuencia de notificaciones.
              </p>

              <div className="flex gap-4 rounded-xl p-1">
                {["low", "balanced", "high"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleSensitivityChange(level)}
                    className={`flex py-2 px-6 rounded-lg text-sm font-medium border border-[#1f2937] bg-[#0b1220] text-slate-300 transition-all cursor-pointer ${formData.sensitivity === level
                      ? "bg-blue-600 text-white"
                      : "text-slate-300"
                      }`}
                  >
                    {level === "low"
                      ? "Bajo"
                      : level === "balanced"
                        ? "Medio"
                        : "Alto"}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgent concerns */}
            <div className="bg-[#0d1222] border border-[#182033] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="text-white" size={20} />

                <h3 className="font-semibold text-xl">
                  Alertas urgentes
                </h3>
              </div>

              <p className="text-sm text-slate-400 mb-5">
                Notificaciones inmediatas para actividades sospechosas.
              </p>

              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-medium text-white">
                  Monitoreo activo
                </span>

                <button
                  type="button"
                  onClick={() => handleToggle("urgentMonitoring")}
                  className={`w-14 h-8 rounded-full transition-all relative cursor-pointer ${formData.urgentMonitoring
                    ? "bg-blue-600"
                    : "bg-gray-300"
                    }`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.urgentMonitoring
                      ? "right-1"
                      : "left-1"
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Connected services */}
          <div className="bg-[#0d1222] border border-[#182033] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Grid2X2 className="w-5 h-5 text-white" />
              <h3 className="font-semibold text-xl">
                Servicios conectados
              </h3>
            </div>

            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 mt-2 text-white" />

                  <div>
                    <h4 className="font-medium text-white">
                      Compartir ubicación
                    </h4>

                    <p className="text-sm text-slate-400">
                      Zonas seguras y movimientos inusuales.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle("locationSharing")}
                  className={`w-14 h-8 rounded-full transition-all relative cursor-pointer ${formData.locationSharing
                    ? "bg-blue-600"
                    : "bg-gray-300"
                    }`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.locationSharing
                      ? "right-1"
                      : "left-1"
                      }`}
                  />
                </button>
              </div>

              {/* Messages */}
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-3">
                  <MessageSquare className="w-5 h-5 mt-2 text-white" />

                  <div>
                    <h4 className="font-medium text-white">
                      Protección de mensajes
                    </h4>

                    <p className="text-sm text-slate-400">
                      Filtrado de remitentes desconocidos y enlaces.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle("messageProtection")}
                  className={`w-14 h-8 rounded-full transition-all relative cursor-pointer ${formData.messageProtection
                    ? "bg-blue-600"
                    : "bg-gray-300"
                    }`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.messageProtection
                      ? "right-1"
                      : "left-1"
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-[#0d1222] border border-[#182033] rounded-2xl p-6">
            <h3 className="font-semibold text-xl mb-5">
              Información visible
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  key: "deviceHealth",
                  label: "Estado del dispositivo",
                },
                {
                  key: "emergencyContacts",
                  label: "Contactos de emergencia",
                },
                {
                  key: "privateMessages",
                  label: "Mensajes privados",
                },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleVisibleData(item.key)}
                  className={`rounded-2xl p-6 transition-all cursor-pointer border border-slate-800 ${formData.visibleData[
                    item.key as keyof typeof formData.visibleData
                  ]
                    ? "bg-[#182033] text-white"
                    : "bg-[#0b1220] text-slate-500"
                    }`}
                >
                  <div className="flex justify-center mb-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${formData.visibleData[
                        item.key as keyof typeof formData.visibleData
                      ]
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-400"
                        }`}
                    />
                  </div>

                  <p className="text-sm font-medium">
                    {item.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
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