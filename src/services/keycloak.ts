import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8081',
  realm: 'capacity-connect',
  clientId: 'capacity-connect-frontend',
});

export default keycloak;
