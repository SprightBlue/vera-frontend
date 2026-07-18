import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const showCustomExitModal = (onConfirmExit: () => void, onResumeTour: () => void) => {
    const dialog = document.createElement('dialog');
    dialog.className = "bg-[#0f172a] border border-[#1e293b] rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm open:animate-in open:fade-in open:zoom-in-95 outline-none";

    dialog.innerHTML = `
        <h3 class="text-xl font-bold text-white mt-2">¿Saltar el tutorial?</h3>
        <p class="text-slate-400 text-sm leading-relaxed mt-4 mb-6">
            Puedes volver a verlo en cualquier momento desde tu <b>Manual de uso</b>.
        </p>
        <div class="flex gap-3 justify-center">
            <button id="resume-tour-btn" class="flex-1 px-4 py-3 rounded-xl border border-[#1e293b] text-slate-300 hover:bg-[#1e293b] transition-colors cursor-pointer font-medium outline-none">
                Cancelar
            </button>
            <button id="confirm-exit-btn" class="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer font-semibold outline-none">
                Sí, saltar
            </button>
        </div>
    `;

    document.body.appendChild(dialog);

    const resumeBtn = dialog.querySelector('#resume-tour-btn') as HTMLButtonElement;
    const confirmBtn = dialog.querySelector('#confirm-exit-btn') as HTMLButtonElement;

    resumeBtn.addEventListener('click', () => {
        dialog.close();
        document.body.removeChild(dialog);
        onResumeTour();
    });

    confirmBtn.addEventListener('click', () => {
        dialog.close();
        document.body.removeChild(dialog);
        onConfirmExit();
    });

    dialog.showModal();
};

const baseConfig = {
    showProgress: true,
    animate: true,
    nextBtnText: 'Siguiente ➔',
    prevBtnText: '⬅ Anterior',
    doneBtnText: '¡Entendido!',
};

// Pasamos el rol del usuario para armar los pasos dinámicamente sin romper selectores inexistentes
export const startDashboardTour = (userRole?: string, forceStart = false, startAtStep = 0) => {
    if (!forceStart && localStorage.getItem("tour_dashboard_completed")) return;

    let driverObj: any;

    // Definimos los pasos comunes de la parte superior del layout
    const commonHeaderSteps = [
        {
            popover: {
                title: '¡Bienvenido a tu Dashboard! 🛡️',
                description: 'Este es el centro de control de VERA. Aquí verás un resumen de toda la actividad en tiempo real.'
            }
        },
        {
            element: '#user-profile-menu',
            popover: { title: 'Tu perfil', description: 'Accede a la configuración de tu cuenta y revisa tus preferencias de notificaciones.', side: 'left', align: 'start' }
        },
        {
            element: '#notification-bell',
            popover: { title: 'Notificaciones', description: 'Aquí recibirás alertas inmediatas sobre novedades importantes.', side: 'left', align: 'start' }
        },
        {
            element: '#nav-dashboard',
            popover: { title: 'Panel Principal', description: 'Volvé acá siempre que quieras ver el estado general y los accesos rápidos.', side: 'right', align: 'center' }
        },
    ];

    // Pasos específicos según el rol del Sidebar
    const roleSpecificSteps: any[] = [];
    if (userRole === 'CARER') {
        roleSpecificSteps.push(
            {
                element: '#nav-personas',
                popover: { title: 'Personas bajo cuidado', description: 'Administrá a tus protegidos, observá su estado de conexión y sus perfiles de seguridad.', side: 'right', align: 'center' }
            },
            {
                element: '#nav-contactos',
                popover: { title: 'Contactos', description: 'Gestioná la red de contactos de emergencia para actuar rápido ante cualquier riesgo.', side: 'right', align: 'center' }
            },
            {
                element: '#nav-ai-center',
                popover: { title: 'Funciones IA', description: 'Utilizá herramientas inteligentes para analizar mensajes sospechosos o iniciar consultas con el asistente.', side: 'right', align: 'center' }
            },
            {
                element: '#nav-monitoring-center',
                popover: { title: 'Historial', description: 'Revisá el registro central de análisis y eventos de monitoreo.', side: 'right', align: 'center' }
            },
            {
                element: '#nav-incidentes',
                popover: { title: 'Incidentes', description: 'Reportes y alertas críticas sobre amenazas que requirieron tu atención.', side: 'right', align: 'center' }
            },
            {
                element: '#nav-entrenamiento',
                popover: { title: 'Entrenamiento', description: 'Sección educativa para aprender a prevenir fraudes y simular escenarios.', side: 'right', align: 'center' }
            },
            {
                element: '#add-protected-btn',
                popover: { title: 'Añadir Protegido', description: 'Comenzá invitando a la persona que deseás acompañar y cuidar desde aquí.', side: 'top', align: 'center' }
            }
        );
    } else if (userRole === 'PROTECTED') {
        roleSpecificSteps.push(
            {
                element: '#nav-mis-cuidadores',
                popover: { title: 'Mis Cuidadores', description: 'Mirá quiénes son los familiares o encargados asignados para acompañarte en tu seguridad.', side: 'right', align: 'center' }
            },
            {
                element: '#nav-ai-functions',
                popover: { title: 'Funciones IA', description: 'Analizá mensajes, links o archivos dudosos para saber si son estafas antes de abrirlos.', side: 'right', align: 'center' }
            },
            {
                element: '#nav-alerts',
                popover: { title: 'Historial', description: 'Revisá tus análisis anteriores y las alertas automáticas de seguridad que el sistema detectó.', side: 'right', align: 'center' }
            }
        );
    }

    // Pasos fijos de la sección inferior
    const commonFooterSteps = [
        {
            element: '#nav-manual',
            popover: {
                title: 'Manual de uso',
                description: '¿Tenés dudas o querés repetir este tutorial? Podés consultar las guías completas acá cuando quieras.',
                side: 'right',
                align: 'center',
                prevBtnText: '↺ Reiniciar',
                onPrevClick: () => {
                    driverObj.drive(0);
                }
            }
        }
    ];

    const allSteps = [...commonHeaderSteps, ...roleSpecificSteps, ...commonFooterSteps];

    // ¡EL FILTRO MAGICO! -> Chequea que el elemento exista en el DOM antes de mostrarlo
    const activeSteps = allSteps.filter(step => !step.element || document.querySelector(step.element));

    driverObj = driver({
        ...baseConfig,
        steps: activeSteps,
        onDestroyStarted: () => {
            if (!driverObj.hasNextStep()) {
                localStorage.setItem('tour_dashboard_completed', 'true');
                driverObj.destroy();
                return;
            }

            const currentIndex = driverObj.getState().activeIndex ?? 0;
            driverObj.destroy();

            showCustomExitModal(
                () => {
                    localStorage.setItem('tour_dashboard_completed', 'true');
                },
                () => {
                    startDashboardTour(userRole, true, currentIndex);
                }
            );
        }
    });

    driverObj.drive(startAtStep);
};