# Webbutveckling-slutprojekt: Albins yatzyprojekt!
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

Detta är git-repositoryt för mitt slutprojekt inom kursen Webbutveckling 1. Det är ett projekt tillsammans med Gränsnittsdesign.

## Om projektet

Projektet implementerar ett fungerande yatzyspel som både går att köras lokalt eller online via online multiplayer med två eller flera spelare
som spelar.

### Frontend

Frontendet, eller den delen som användaren ser av detta projekt utgörs av en hemsida skriven i React. Stöd för att navigera till undersidor via URL:en
tillhandahålls av React Router. För att applicera stilar på hemsidan används Tailwind CSS.

### Backend/multiplayerserver

Backendet använder teknologin WebSockets som är bra för att kommunicera i realtid mellan klienter bland annat i webbläsare. Biblioteket Socket.IO används för att
skapa denna uppkoppling. Socket.IO innehåller bland annat automatisk återanslutning, identifiering och bakåtkompatbilitet med riktigt gamla webbläsare.
Backendet kommunicerar med en databas via ORM (Object Relationship Manager)-biblioteket Sequelize. Slutligen körs backendet som en Docker-container som hostas på hemsidan [fly.io](https://fly.io) 


### Delad kod

I mappen `shared` ([länk](shared/)) finns beräkningskoden för yatzyt. Då beräkningar både ska göras på den lokala yatzyspelsfunktionaliteten (som kör i webbläsaren) och onlinespelet (som körs på en server)
så har jag förenklat det hela för mig genom att använda exakt samma kod för båda ställena.
