import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './presentation/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId="864823467452-lmkbghnfj5r49gbij0spnehcu9du3d80.apps.googleusercontent.com"
    >
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);