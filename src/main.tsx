import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import keycloak from './services/keycloak';

const rootElement = document.getElementById('root')!;

const renderApp = () => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

keycloak
  .init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    checkLoginIframe: false,
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    silentCheckSsoFallback: false,
    messageReceiveTimeout: 3000,
  })
  .then(() => {
    renderApp();
  })
  .catch((error) => {
    console.error('Keycloak initialization failed:', error);
    renderApp();
  });
