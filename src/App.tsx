import type { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './presentation/context/AuthContext';
import Login from './presentation/pages/Login';
import Register from './presentation/pages/Register';

// Componente que protege rutas privadas.
// Si no hay token, redirige al login.
function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-[#0a0b10] text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">¡Bienvenido, {user?.fullName}! 👋</h1>
      <p className="text-gray-400">El dashboard de VERA va acá.</p>
      <button
        onClick={logout}
        className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      {/* Redirige la raíz al login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;