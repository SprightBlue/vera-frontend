import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// --- NUEVO: Función para el modal (Ahora sin pelear con el escudo) ---
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

    // Si cancela la salida, vuelve al tour
    resumeBtn.addEventListener('click', () => {
        dialog.close();
        document.body.removeChild(dialog);
        onResumeTour(); 
    });

    // Si confirma la salida, se termina
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

export const startDashboardTour = (forceStart = false, startAtStep = 0) => {
    if (!forceStart && localStorage.getItem("tour_dashboard_completed")) return;

    // Declaramos la variable primero para poder usarla adentro de sí misma
    let driverObj: any; 

    driverObj = driver({
        ...baseConfig,
        steps: [
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
                popover: { title: 'Notificaciones', description: 'Aquí recibirás notificaciones inmediatas sobre alertas importantes o actualizaciones de tus protegidos.', side: 'left', align: 'start' } 
            },
            { 
                element: '#nav-personas', 
                popover: { title: 'Personas que cuido', description: 'Administra a tus protegidos, observa su estado de conexión y detalles del perfil.', side: 'right', align: 'center' } 
            },
            { 
                element: '#nav-contactos', 
                popover: { title: 'Contactos', description: 'Crea y gestiona tu red de contactos de emergencia para actuar rápido ante cualquier riesgo.', side: 'right', align: 'center' } 
            },
            { 
                element: '#nav-ai-center',
                popover: { title: 'Centro de IA', description: 'Utiliza nuestra herramienta de inteligencia artificial para analizar o ser asistido ante cualquier amenaza.', side: 'right', align: 'center' }
            },
            { 
                element: '#nav-alertas', 
                popover: { title: 'Alertas', description: 'Revisa el historial completo de todas las amenazas interceptadas por el sistema.', side: 'right', align: 'center' } 
            },
            { 
                element: '#add-protected-btn', 
                popover: { title: 'Añadir Protegido', description: 'Tu primer paso: comienza invitando a la persona que deseas acompañar desde aquí.', side: 'top', align: 'center' } 
            },
            { 
                element: '#nav-manual', 
                popover: { 
                    title: 'Manual de uso', 
                    description: '¿Tienes dudas o quieres repetir este tour? ¡Siempre puedes consultar el manual aquí!', 
                    side: 'right', 
                    align: 'center',
                    // MAGIA AQUÍ: Cambiamos el texto y la acción del botón
                    prevBtnText: '↺ Reiniciar',
                    onPrevClick: () => {
                        driverObj.drive(0); // 0 es el índice de la primera burbuja
                    }
                } 
            }
        ],
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
                    startDashboardTour(true, currentIndex);
                }
            );
        }
    });

    driverObj.drive(startAtStep);
};