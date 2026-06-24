const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function getDashboardData() {
    const token = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token'); 
    
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
    }

    return response.json();
}