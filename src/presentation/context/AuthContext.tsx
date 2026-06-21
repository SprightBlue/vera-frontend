import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../../infrastructure/auth.types';

// El contexto de autenticación actúa como el "estado global" de sesión.
// Equivalente a guardar el usuario en req.user en Express,
// pero del lado del cliente y accesible desde cualquier componente.

interface AuthContextType {
  user: AuthUser | null;
  login: (userData: AuthUser, rememberMe?: boolean) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<AuthUser>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Al montar, recupera la sesión guardada en localStorage
  // para que el usuario no tenga que loguearse de nuevo al refrescar.
  useEffect(() => {
   const token =
  localStorage.getItem('vera_token')
  ||
  sessionStorage.getItem('vera_token');

const userData =
  localStorage.getItem('vera_user')
  ||
  sessionStorage.getItem('vera_user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (
  userData: AuthUser,
  rememberMe = false
) => {

  const storage =
    rememberMe
      ? localStorage
      : sessionStorage;

  storage.setItem(
    'vera_token',
    userData.token
  );

  storage.setItem(
    'vera_user',
    JSON.stringify(userData)
  );

  setUser(userData);
};

  const logout = () => {

  localStorage.removeItem(
    'vera_token'
  );

  localStorage.removeItem(
    'vera_user'
  );

  sessionStorage.removeItem(
    'vera_token'
  );

  sessionStorage.removeItem(
    'vera_user'
  );

  setUser(null);
};

// Actualiza datos del usuario en la sesión
const updateUser = (updatedUser: Partial<AuthUser>) => {
  setUser(prevUser => {
    if (!prevUser) return null;
    const newUser = {
      ...prevUser,
      ...updatedUser
    };
    // Mantener sincronizado el storage donde está la sesión
    if (localStorage.getItem('vera_user')) {
      localStorage.setItem(
        'vera_user',
        JSON.stringify(newUser)
      );
    }
    else {
      sessionStorage.setItem(
        'vera_user',
        JSON.stringify(newUser)
      );
    }
    return newUser;
  });
};

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      updateUser,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para consumir el contexto desde cualquier componente
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}