# Backend

Denna mapp innehåller kod för en backend som möjiggör multiplayer.

## Installation

### Med Docker

* Använd `docker-compose.yml` filen för att få en databas och en backend-server i ett.
För att bara köra servern, se [Socket-Server.Dockerfile](Socket-Server.Dockerfile).

### Med Kubernetes

#### Med OpenShift

Kommandona under "Inte OpenShift" har använts för att skapa en OpenShift-konfiguration. De finns direkt i denna mapp.

#### Inte OpenShift

* `kompose convert --provider="<önskad provider>"`
* `kompose apply`
* Kör nu de kommandon som du använder för att deploya.