/* socket.js
För att multiplayer ska fungera på sidan så använder jag mig av servern Socket.IO för att hantera uppkopplingar.
För att användaren ska kunna koppla upp mot servern så använder jag mig av deras klient. Uppkopplingen definieras här. 
Tack vare React-kontext slipper man skicka vidare en variabel i all oändlighet. */
import io from "socket.io-client";
import {createContext} from "react";
// Lista ut vilken Socket-URL vi ska koppla upp mot
const socketURL = process.env.NODE_ENV === "production" ? "": "http://localhost:3000"
export const socket = io(
    socketURL, {
        autoConnect: true
    }
)
export const SocketContext = createContext()