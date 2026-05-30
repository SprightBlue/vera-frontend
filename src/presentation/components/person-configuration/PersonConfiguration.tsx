import { useState } from "react";
import {
  Bell,
  ShieldAlert,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Grid2X2
} from "lucide-react";

export default function PersonConfiguration() {

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

  // Aca enviaria los datos del form al backend
  function handleSubmit() {
    console.log(formData);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">

      {/* MAIN */}
      <div className="w-full max-w-4xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            Configurar alertas
          </h1>

          <p className="text-slate-400 mt-2">
            Ajusta las preferencias de monitoreo y seguridad del perfil.
          </p>
        </div>

        {/* Info */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 flex gap-3 items-start">
          <ShieldCheck className="text-white mt-1" size={22} />

          <div>
            <h2 className="font-semibold text-white">
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
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="text-white" size={20} />

              <h3 className="font-semibold text-lg">
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
                  className={`flex py-2 px-6 rounded-lg text-sm font-medium border border-[#1f2937] bg-[#0b1220] text-slate-300 transition-all ${
                    formData.sensitivity === level
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
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="text-white" size={20} />

              <h3 className="font-semibold text-lg">
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
                className={`w-14 h-8 rounded-full transition-all relative ${
                  formData.urgentMonitoring
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                    formData.urgentMonitoring
                      ? "right-1"
                      : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Connected services */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
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
                <MapPin className="text-white" />

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
                className={`w-14 h-8 rounded-full transition-all relative ${
                  formData.locationSharing
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                    formData.locationSharing
                      ? "right-1"
                      : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Messages */}
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3">
                <MessageSquare className="text-white" />

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
                className={`w-14 h-8 rounded-full transition-all relative ${
                  formData.messageProtection
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                    formData.messageProtection
                      ? "right-1"
                      : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
          <h3 className="font-semibold text-xl mb-5">
            Información visible
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
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
                className={`rounded-2xl p-5 transition-all ${
                  formData.visibleData[
                    item.key as keyof typeof formData.visibleData
                  ]
                    ? "bg-[#263451]"
                    : "bg-[#111827]"
                }`}
              >
                <div className="flex justify-center mb-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      formData.visibleData[
                        item.key as keyof typeof formData.visibleData
                      ]
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-400"
                    }`}
                  />
                </div>

                <p className="text-sm font-medium text-white">
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
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold"
          >
            Guardar preferencias
          </button>

          <button
            type="button"
            className="px-5 py-3 rounded-xl border border-[#1f2937] text-slate-300 hover:bg-[#111827]"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}