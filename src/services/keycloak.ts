import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://keycloak-production-66a8.up.railway.app',
  realm: 'capacity-connect',
  clientId: 'capacity-connect-frontend',
});

export default keycloak;
