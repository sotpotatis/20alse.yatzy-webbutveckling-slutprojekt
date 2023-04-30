import {socket, SocketContext} from "../context/socket.js";
import Game from "../components/Game/Game.jsx";
/* GamePage.jsx
Innehåller själva spelet. */
export default function GamePage() {
    return <SocketContext.Provider value={socket}><Game/></SocketContext.Provider>
    }
    