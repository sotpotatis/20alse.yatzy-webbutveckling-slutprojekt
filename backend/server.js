/* server.js
Server.js exponerar servern som klienter kan koppla upp mot. */
import * as assert from "assert/strict" ;
import defineModels from "./lib/models.js";
import socketHandler from "./lib/socket.js";
import Sequelize from "sequelize";
import * as dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
// Ladda hemligheter från en eventuell .env-fil.
dotenv.config()
const DATABASE_SERVER = process.env.DATABASE_SERVER;
const DATABASE_PORT = parseInt(process.env.DATABASE_PORT) || 1433
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_USER_NAME = process.env.DATABASE_USER_NAME;
const DATABASE_USER_PASSWORD = process.env.DATABASE_USER_PASSWORD;
const DATABASE_DIALECT = process.env.DATABASE_DIALECT || "mysql" // Standard "dialekt" är mysql
const SOCKET_SERVER_ADDRESS = process.env.SOCKET_SERVER_ADDRESS || "localhost"; // Standardadress/host för servern är 3000
const SOCKET_SERVER_PORT = parseInt(process.env.SOCKET_SERVER_PORT )|| 3000; // Standardport är 3000

assert.ok(DATABASE_SERVER, "Du har inte specificerat en databasserver.");
assert.ok(DATABASE_NAME, "Du har inte specificerat ett databasnamn.");
assert.ok(DATABASE_USER_NAME, "Du har inte specificerat en användarnamn för databasen.");
assert.ok(DATABASE_USER_PASSWORD, "Du har inte specificerat ett lösenord för databasen.");

// För att koppla upp samt hantera databas använder jag biblioteket och modellhanteraren Sequelize.
// Här initieras uppkopplingen.
console.log(`Kommer att koppla upp till ${DATABASE_SERVER}:${DATABASE_PORT} som en användare med lösenord ${DATABASE_USER_NAME} och använda databasen ${DATABASE_NAME}.`)
const sequelize = new Sequelize(
    DATABASE_NAME,
    DATABASE_USER_NAME,
    DATABASE_USER_PASSWORD,
    {
        host: DATABASE_SERVER,
        port: DATABASE_PORT,
        dialect: DATABASE_DIALECT
    }
)
// Definera alla modeller för databasen.
defineModels(sequelize)
sequelize.authenticate().then(()=>{
    console.log("Uppkopplad och autentiserad!")
}).catch((error) => { // Ifall ett fel uppstår vid uppkoppling till databasen
    console.log("Ett fel inträffade vid uppkoppling till databasen: ", error)
})
// Lägg till {force: true} i sync() nedan om du vill rensa databasen eller har uppdaterat modeller.
// Du kan även använda {alter: true} om force inte fungerar eller du vill alternera modellerna.
sequelize.sync().then(() => {
    console.log("Databassynkronisering klar.")
    // Starta nu servern som klienter kan koppla upp mot.
    // Servern använder teknologin WebSockets och biblioteket Socket.io
    const httpServer = createServer()
    const socketServer = new Server(httpServer, {
        cors: { // Specificera CORS-regler, annars kommer inte klienter i webbläsare vela koppla upp sig.
            origin: "*",
            methods: ["GET", "POST"]
        }
    })
    socketServer.on("connection", (socket) => {
        console.log("En användare anslöt till servern!")
        socketHandler(socket, sequelize.models) // Registrera meddelandehanterare
    })
    socketServer.on("disconnect", (socket) => {
        console.log("En användare kopplade bort från servern.")
    })
    console.log(`Lyssnar på port ${SOCKET_SERVER_PORT}...`)
    httpServer.listen(SOCKET_SERVER_PORT)
}).catch((error) => { // Ifall fel inträffar under synkroniseringen eller under applikationen
    console.log("Ett fel inträffade när appen kördes: ", error)
})
