import type {SaludoResponse} from '../../domain/models/auth.types';

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080';

export const authRepository = {
    async obtenerHolaMundo(): Promise<SaludoResponse> {
        try {
            const response = await fetch(`${API_URL}/api/hola`);

            if (!response.ok) {
                throw new Error(`Error en el servidor: ${response.status}`);
            }

            return (await response.json()) as SaludoResponse;
        } catch (error) {
            console.error("Error en authRepository al conectar con el Back:", error);
            throw error;
        }
    }
};