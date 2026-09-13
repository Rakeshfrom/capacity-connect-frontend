import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initKeycloak } from './services/keycloak';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

initKeycloak().catch((error) => {
  console.error('Keycloak initialization failed:', error);
});
