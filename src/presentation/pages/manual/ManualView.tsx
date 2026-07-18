import { useState } from 'react';
import Sidebar from '@/features/shared/components/Sidebar.tsx';
import Header from '@/features/shared/components/Header.tsx';
import { useAuth } from '@/presentation/context/AuthContext';
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ContactRound,
  TextSearch,
  ShieldAlert,
  Settings,
  ChevronDown,
  X
} from 'lucide-react';

// Estructura de datos para las tarjetas y el modal
const manualSections = [
  {
    id: 'dashboard',
    title: "Director del panel",
    shortDesc: "Visión general y métricas de seguridad.",
    icon: LayoutDashboard,
    gridClass: "md:col-span-2",
    details: "El Director del panel es tu centro de comando. Aquí puedes ver un resumen ejecutivo en tiempo real del estado de protección de todas las personas vinculadas a tu cuenta.",
    steps: [
      "Revisa las tarjetas de métricas diarias.",
      "Observa el gráfico de actividad reciente.",
      "Accede rápidamente a las últimas alertas detectadas."
    ]
  },
  {
    id: 'personas',
    title: "Personas que cuido",
    shortDesc: "Administra a tus protegidos.",
    icon: Users,
    gridClass: "md:col-span-1",
    details: "En esta sección puedes ver el listado de todos tus familiares vinculados. Observa el estado de su conexión y sus detalles de perfil.",
    steps: [
      "Visualiza el listado completo de protegidos.",
      "Verifica cuándo fue su última conexión.",
      "Entra al detalle de cada persona para ver su historial."
    ]
  },
  {
    id: 'contactos',
    title: "Contactos",
    shortDesc: "Gestiona tu red de seguridad.",
    icon: ContactRound,
    gridClass: "md:col-span-1",
    details: "Crea y administra una red de contactos de emergencia. Es vital establecer el vínculo correctamente para asegurar la comunicación en caso de riesgo.",
    steps: [
      "Ve a la pestaña 'Contactos' en el menú lateral.",
      "Haz clic en el botón 'Agregar Contacto'.",
      "Completa los datos y genera el Código de Vinculación.",
      "La otra persona debe descargar la app e ingresar ese código en su dispositivo para confirmar la conexión."
    ]
  },
  {
    id: 'analisis',
    title: "Análisis",
    shortDesc: "Escaneo manual de amenazas.",
    icon: TextSearch,
    gridClass: "md:col-span-1",
    details: "Utiliza el motor inteligente de Vera para analizar manualmente cualquier mensaje, correo o enlace que te parezca sospechoso antes de abrirlo.",
    steps: [
      "Pega el texto o enlace en la barra de análisis.",
      "Haz clic en 'Analizar'.",
      "Revisa el dictamen del sistema (Seguro, Medio, Alto riesgo)."
    ]
  },
  {
    id: 'alertas',
    title: "Alertas",
    shortDesc: "Historial completo de incidentes.",
    icon: ShieldAlert,
    gridClass: "md:col-span-2",
    details: "Un registro detallado de todas las amenazas interceptadas por el sistema en los dispositivos de tus protegidos, clasificadas por severidad.",
    steps: [
      "Filtra las alertas usando los botones superiores.",
      "Haz clic en 'Ver Detalles' para investigar una amenaza.",
      "Marca la alerta como 'Segura' una vez que confirmes que no hay peligro."
    ]
  },
  {
    id: 'configuracion',
    title: "Configuración",
    shortDesc: "Ajustes de cuenta y preferencias.",
    icon: Settings,
    gridClass: "md:col-span-1",
    details: "Personaliza tu experiencia de uso. Ajusta tus datos personales y controla qué tipo de notificaciones deseas recibir en tu correo.",
    steps: [
      "Edita tu información personal.",
      "Activa o desactiva las alertas inmediatas.",
      "Gestiona la seguridad y contraseña de tu cuenta."
    ]
  }
];

const faqs = [
  {
    id: 1,
    question: "¿Qué pasa si detecto una alerta de alto riesgo?",
    answer: "Te recomendamos contactar a tu protegido inmediatamente por un medio alternativo (como una llamada tradicional) y marcar la alerta como revisada en el sistema una vez que confirmes que la situación está bajo control."
  },
  {
    id: 2,
    question: "¿Cuántas personas puedo proteger al mismo tiempo?",
    answer: "Actualmente no hay un límite estricto de personas que puedes vincular a tu cuenta principal de protector. Puedes agregar a toda tu familia."
  },
  {
    id: 3,
    question: "¿El protegido sabe qué información estoy viendo?",
    answer: "Sí. Vera se basa en la transparencia. El protegido debe aceptar la vinculación y es notificado de que el sistema está analizando patrones para su seguridad."
  },
  {
    id: 4,
    question: "¿Puedo usar Vera en múltiples dispositivos?",
    answer: "¡Por supuesto! Tu cuenta de Director/Protector está en la nube, por lo que puedes iniciar sesión desde cualquier navegador web en tu computadora o tablet y mantener el control."
  },
  {
    id: 5,
    question: "¿Cómo elimino o desvinculo a un contacto?",
    answer: "Desde la sección 'Contactos' o 'Personas que cuido', selecciona 'Detalles' en la tarjeta de la persona y utiliza la opción de eliminar para romper el vínculo permanentemente."
  },
  {
    id: 6,
    question: "¿Qué debo hacer si un enlace manual da resultado 'Peligroso'?",
    answer: "Evita abrir el enlace bajo cualquier circunstancia. Si te lo enviaron por mensaje, elimínalo y advierte a la persona que te lo envió que su dispositivo podría estar comprometido."
  }
];

function ManualView() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  const [selectedSection, setSelectedSection] = useState<typeof manualSections[0] | null>(null);

  const toggleFaq = (id: number) => setOpenFaq(openFaq === id ? null : id);

  return (
      <div className="flex min-h-screen bg-[#050816]">
        <Sidebar />

        <main className="flex-1 flex flex-col min-w-0 ml-[79.2px] lg:ml-[224px]">
          <Header
              userName={user?.fullName || "Usuario"}
              title="Manual de Uso 📖"
              subtitle="Aprende a utilizar Vera y protege a tus seres queridos."
          />

          <div className="flex-1 flex flex-col items-center p-8">
            <div className="w-full max-w-5xl flex flex-col">

              {/* BOTÓN DE REINICIAR TOUR CORREGIDO */}
              <div className="flex justify-end mb-6">
                <button
                    onClick={() => {
                      localStorage.removeItem("tour_dashboard_completed");
                      navigate("/dashboard");
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0d1222] hover:bg-[#1e293b] border border-[#182033] text-indigo-400 hover:text-indigo-300 rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-indigo-500/10 font-medium text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reiniciar On-Boarding VERA
                </button>
              </div>

              {/* Grilla estilo Bento Box */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-16">
                {manualSections.map((section) => (
                    <div
                        key={section.id}
                        onClick={() => setSelectedSection(section)}
                        className={`
                    ${section.gridClass}
                    bg-[#0d1222] border border-[#182033] rounded-3xl p-8
                    flex flex-col items-center justify-center text-center cursor-pointer
                    transition-all duration-300 ease-out group
                    hover:border-indigo-500/50 hover:shadow-[inset_0_0_30px_rgba(99,102,241,0.15)] hover:-translate-y-1
                  `}
                    >
                      <div className="mb-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-800/80 group-hover:scale-110 transition-transform duration-300">
                        <section.icon className="w-10 h-10 text-indigo-400 group-hover:text-indigo-300" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-200 mb-2">{section.title}</h3>
                      <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">
                        {section.shortDesc}
                      </p>
                    </div>
                ))}
              </div>

              {/* FAQs */}
              <div className="mb-8 w-full max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-100 mb-6 text-center">Preguntas Frecuentes</h2>
                <div className="flex flex-col gap-3">
                  {faqs.map((faq) => (
                      <div
                          key={faq.id}
                          className="bg-[#0d1222] border border-[#182033] rounded-2xl overflow-hidden transition-all duration-200"
                      >
                        <button
                            onClick={() => toggleFaq(faq.id)}
                            className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none hover:bg-white/[0.02] transition-colors"
                        >
                          <span className="font-semibold text-slate-300 text-base md:text-lg pr-4">{faq.question}</span>
                          <ChevronDown className={`w-5 h-5 text-indigo-400 transition-transform duration-300 flex-shrink-0 ${openFaq === faq.id ? 'rotate-180' : ''}`} />
                        </button>
                        <div
                            className={`px-6 transition-all duration-300 ease-in-out ${openFaq === faq.id ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                        >
                          <p className="text-slate-400 text-sm md:text-base leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Modal sin sección de imagen */}
          {selectedSection && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    onClick={() => setSelectedSection(null)}
                ></div>

                <div className="relative bg-[#0d1222] border border-[#182033] w-full max-w-2xl rounded-3xl p-8 shadow-2xl shadow-black animate-in fade-in zoom-in-95 duration-200">

                  <button
                      onClick={() => setSelectedSection(null)}
                      className="absolute top-6 right-6 p-2 rounded-full bg-slate-900 border border-[#182033] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                      <selectedSection.icon className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{selectedSection.title}</h2>
                  </div>

                  <p className="text-slate-300 text-lg leading-relaxed mb-6">
                    {selectedSection.details}
                  </p>

                  <div className="bg-[#050816] rounded-2xl p-6 border border-[#182033]">
                    <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-4">Paso a paso</h4>
                    <ul className="space-y-3">
                      {selectedSection.steps.map((step, index) => (
                          <li key={index} className="flex gap-3 text-slate-400">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm font-bold border border-indigo-500/20">
                        {index + 1}
                      </span>
                            <span>{step}</span>
                          </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
          )}

        </main>
      </div>
  );
}

export default ManualView;