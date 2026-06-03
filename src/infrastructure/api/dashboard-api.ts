// Configuración dinámica de la API (usa localhost en tu PC o Render en producción)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function getDashboardData() {
    // Cambiado para usar la URL dinámica con backticks (``)
    const response = await fetch(`${API_BASE_URL}/dashboard`);

    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
    }

    return response.json();
}