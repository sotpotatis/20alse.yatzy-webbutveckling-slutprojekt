/* socket.js
För att multiplayer ska fungera på sidan så använder jag mig av servern Socket.IO för att hantera uppkopplingar.
För att användaren ska kunna koppla upp mot servern så använder jag mig av deras klient. Uppkopplingen definieras här. 
Tack vare React-kontext slipper man skicka vidare en variabel i all oändlighet. */
import io from "socket.io-client";
import { createContext } from "react";
import { getSavedAuthentication } from "../lib/utils.js";
// Lista ut vilken Socket-URL vi ska koppla upp mot
const socketURL =
  import.meta.env.PROD ? "https://169.155.56.78:3000" : "http://localhost:3000/";
let socketOptions = {
  autoConnect: true,
};
// Om det finns en sparad tidigare skapad spelare, lägg till autentisering
const savedAuthorizationToken = getSavedAuthentication();
if (savedAuthorizationToken !== null) {
  console.log("Använder tidigare sparad användare i uppkoppling.");
  socketOptions.auth = { token: savedAuthorizationToken };
}

export const socket = io(socketURL, socketOptions);
export const SocketContext = createContext();
