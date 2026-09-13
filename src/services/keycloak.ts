import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://keycloak-production-66a8.up.railway.app',
  realm: 'capacity-connect',
  clientId: 'capacity-connect-frontend',
});

let keycloakInitPromise: Promise<boolean> | null = null;

export const initKeycloak = () => {
  if (!keycloakInitPromise) {
    keycloakInitPromise = keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      silentCheckSsoFallback: false,
      messageReceiveTimeout: 3000,
    });
  }

  return keycloakInitPromise;
};

export const getKeycloakInitPromise = () =>
  keycloakInitPromise ?? Promise.resolve(keycloak.authenticated ?? false);

export const initKeycloakForCallback = () => {
  if (!keycloakInitPromise) {
    keycloakInitPromise = keycloak.init({
      pkceMethod: 'S256',
      checkLoginIframe: false,
      messageReceiveTimeout: 3000,
    });
  }

  return keycloakInitPromise;
};

export default keycloak;
