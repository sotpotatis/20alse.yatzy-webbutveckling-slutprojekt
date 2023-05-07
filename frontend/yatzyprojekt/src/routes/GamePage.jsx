/* GamePage.jsx
Innehåller själva spelet. */
import { socket, SocketContext } from "../context/socket.js";
import Game from "../components/Game/Game.jsx";
export default function GamePage() {
  return (
    <SocketContext.Provider value={socket}>
      <Game />
    </SocketContext.Provider>
  );
}
