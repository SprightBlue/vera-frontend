import { useState } from "react";
import { User, Grid2X2, Zap, Info } from "lucide-react";

function AddPerson() {
  // Se crea un form data donde se cargan los datos del formulario
  const [formData, setFormData] = useState({
    fullName: "",
    relation: "",
    contact: "",
    apps: ["WhatsApp", "SMS"], // las que empiezan seleccionadas
    sensitivity: "Medio",
    highRiskAlerts: true,
    alertSummaries: false,
    basicConfiguration: true,
  });

  // Configuracion inicial para los niveles de sensibilidad
  const [sensitivity, setSensitivity] = useState("Medio");

  // Función para cambiar cada switch de configuración
  const handleToggle = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }));
  };

  // Aca enviaria los datos del form al backend
  function handleSubmit() {
    console.log(formData);
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* SIDEBAR */}

      {/* MAIN */}

      <main
        className="
            flex-1
            flex
            flex-col
            min-w-0
        "
      >
        {/* CONTENT */}

        <div className="p-8">
          <div className="w-full max-w-6xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#1554d1]">
                Añadir Nueva Persona
              </h1>

              <p className="text-gray-500 mt-2 text-lg">
                Configura el perfil de seguridad para la persona que vas a
                proteger.
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información Personal */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-[#1554d1]" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Información Personal
                  </h2>
                </div>
                <div className="space-y-5">
                  {/* NOMBRE */}
                  <div>
                    <label className="block font-semibold text-gray-600 mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Maria Garcia"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full bg-[#D8E3FB] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-600 focus:outline-none "
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* RELACIÓN */}
                    <div>
                      <label className="block font-semibold text-gray-600 mb-2">
                        Relación
                      </label>
                      <div className="relative">
                        <select
                          value={formData.relation}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              relation: e.target.value,
                            })
                          }
                          className="w-full bg-[#D8E3FB] rounded-xl px-4 py-3 text-gray-600 placeholder-gray-600 focus:outline-none "
                        >
                          <option value="">Seleccionar...</option>
                          <option value="Padre">Padre</option>
                          <option value="Madre">Madre</option>
                          <option value="Hermano">Hermano</option>
                          <option value="Amigo">Amigo</option>
                        </select>
                      </div>
                    </div>
                    {/* CONTACTO */}
                    <div>
                      <label className="block font-semibold text-gray-600 mb-2">
                        Teléfono o Email (opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="ejemplo@email.com"
                        value={formData.contact}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: e.target.value,
                          })
                        }
                        className="w-full bg-[#D8E3FB] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-600 focus:outline-none "
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Apps */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center gap-2 mb-6">
                  <Grid2X2 className="w-5 h-5 text-[#1554d1]" />

                  <h2 className="text-2xl font-bold text-gray-800">
                    Apps a monitorear
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {["WhatsApp", "SMS", "Gmail", "Telegram"].map((app) => (
                    <label
                      key={app}
                      className="bg-[#e2e8ff] rounded-xl px-4 py-5 flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.apps.includes(app)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // agregar app
                            setFormData({
                              ...formData,
                              apps: [...formData.apps, app],
                            });
                          } else {
                            // eliminar app
                            setFormData({
                              ...formData,
                              apps: formData.apps.filter(
                                (item) => item !== app
                              ),
                            });
                          }
                        }}
                        className="w-5 h-5 accent-[#1554d1] cursor-pointer"
                      />

                      <span className="text-gray-700 font-medium">{app}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sensibilidad */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-5 h-5 text-[#1554d1]" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Nivel de Sensibilidad
                  </h2>
                </div>
                <div className="bg-[#e2e8ff] rounded-full p-1 flex w-full max-w-md mb-5">
                  {["Bajo", "Medio", "Alto"].map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        setSensitivity(level);

                        setFormData((prev) => ({
                          ...prev,
                          sensitivity: level,
                        }));
                      }}
                      className={`flex-1 py-3 rounded-full font-semibold transition-all cursor-pointer ${
                        sensitivity === level
                          ? "bg-[#1554d1] text-white"
                          : "text-gray-600"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="text-gray-500 leading-relaxed text-md">
                  La sensibilidad media detecta patrones de riesgo comunes sin
                  alertar por interacciones casuales.
                </p>
              </div>

              {/* Configuración */}
              <div className="bg-white rounded-2xl p-6 shadow-md space-y-6">
                {/* Enviar alertas de alto riesgo */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Enviar alertas de alto riesgo
                    </p>
                    <p className="text-gray-500 text-md mt-1">
                      Notificar inmediatamente incidentes graves
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("highRiskAlerts")}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      formData.highRiskAlerts ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                        formData.highRiskAlerts
                          ? "translate-x-6"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Ver resúmenes de alertas */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Ver resúmenes de alertas
                    </p>
                    <p className="text-gray-500 text-md mt-1">
                      Recibir informe diario de actividad
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("alertSummaries")}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      formData.alertSummaries ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                        formData.alertSummaries
                          ? "translate-x-6"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Permitir configuración básica */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Permitir configuración básica
                    </p>
                    <p className="text-gray-500 text-md mt-1">
                      El protegido puede editar sus datos básicos
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("basicConfiguration")}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      formData.basicConfiguration
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                        formData.basicConfiguration
                          ? "translate-x-6"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Enlace de invitación */}
            <div className="mt-10 flex flex-col lg:flex-row gap-5 justify-between items-center">
              <div className="flex items-start gap-3 text-gray-500 max-w-xl">
                <Info className="w-5 h-5 text-green-600 mt-1" />

                <p className="text-md leading-relaxed">
                  Al generar el enlace, el protegido recibirá una invitación
                  para instalar VERA y dar su consentimiento explícito.
                </p>
              </div>

              {/* BOTÓN */}

              <button
                onClick={handleSubmit}
                className="flex items-center bg-[#1554d1] hover:bg-[#1148b6] transition-all text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-lg cursor-pointer"
              >
                <span className="px-5">Generar enlace de invitación</span>
                <svg
                  xmlns="http://w3.org"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6 text-white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddPerson;
