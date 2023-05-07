import { useState } from "react";
import GameCodeInput from "../components/GameLobby/notInLobby/GameCodeInput";
import Lobby from "../components/GameLobby/inLobby/Lobby";
import { SocketContext, socket } from "../context/socket";
import { useSearchParams } from "react-router-dom";
import { openURL } from "../lib/utils";

/* GameLobby.jsx
Renderar en "lobby", det vill säga en sida där man är när man väntar
på att andra ska gå med under en multiplayer-session */
export default function GameLobby() {
  const [searchParams, setSearchParams] = useSearchParams();
  // Om vi har en spelkod inlagd i URL:en ska användaren skickas vidare till en lobby.
  const gameCodeSpecifiedInURL = searchParams.get("gameCode") !== null;
  const errorSpecifiedInUrl = searchParams.get("error") !== null;
  const [gameCode, setGameCode] = useState(
    gameCodeSpecifiedInURL ? searchParams.get("gameCode") : ""
  );
  const [me, setMe] = useState(null); // Användarens spelare
  // Rendera olika saker beroende på om användaren väntar på ett spel eller inte
  let elementToRender = null;
  if (!gameCodeSpecifiedInURL || errorSpecifiedInUrl) {
    elementToRender = (
      <div className="flex items-center justify-center">
        <GameCodeInput
          gameCode={gameCode}
          onGameCode={(gameCode) => {
            console.log(`Spelkod uppdaterad.`);
            setGameCode(gameCode);
          }}
        />
      </div>
    );
  } else {
    elementToRender = <Lobby gameCode={gameCode} setGameCode={setGameCode} />;
  }
  return (
    <SocketContext.Provider value={socket}>
      {elementToRender}
    </SocketContext.Provider>
  );
}
