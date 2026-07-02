import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '@/infrastructure/auth.types';

interface AuthContextType {
    user: AuthUser | null;
    login: (userData: AuthUser, rememberMe?: boolean) => void;
    logout: () => void;
    updateUser: (updatedUser: Partial<AuthUser>) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token');
        const userData = localStorage.getItem('vera_user') || sessionStorage.getItem('vera_user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        setIsLoading(false);
    }, []);

    const login = (userData: AuthUser, rememberMe = false) => {
        localStorage.removeItem("vera_token");
        localStorage.removeItem("vera_user");
        sessionStorage.removeItem("vera_token");
        sessionStorage.removeItem("vera_user");

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("vera_token", userData.token);
        storage.setItem("vera_user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);
    };

    const updateUser = (updatedUser: Partial<AuthUser>) => {
        setUser(prevUser => {
            if (!prevUser) return null;
            const newUser = { ...prevUser, ...updatedUser };
            const storage = localStorage.getItem('vera_user') ? localStorage : sessionStorage;
            storage.setItem('vera_user', JSON.stringify(newUser));
            return newUser;
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            updateUser,
            isAuthenticated: !!user,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return context;
}