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
          <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                  style: {
                      background: '#0d1222',
                      color: '#fff',
                      border: '1px solid #182033',
                      borderRadius: '0.75rem',
                      padding: '12px 16px',
                      fontSize: '0.9rem',
                  },
                  success: {
                      iconTheme: {
                          primary: '#2563eb',
                          secondary: '#fff',
                      },
                  },
                  error: {
                      iconTheme: {
                          primary: '#ef4444',
                          secondary: '#fff',
                      },
                  },
              }}
          />
          <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);