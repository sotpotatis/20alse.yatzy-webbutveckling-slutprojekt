import { useState } from "react"
import GameCodeInput from "../components/GameLobby/notInLobby/GameCodeInput"

/* GameLobby.jsx
Renderar en "lobby", det vill säga en sida där man är när man väntar
på att andra ska gå med under en multiplayer-session */
export default function GameLobby() {
    const [gameCode, setGameCode] = useState(null)
    const [inLobby, setInLobby] = useState(false) // Om användaren väntar på ett spel eller inte
    // Rendera olika saker beroende på om användaren väntar på ett spel eller inte
    let elementToRender = null
    if (!inLobby) {
        elementToRender = <GameCodeInput gameCode={gameCode} setGameCode={ setGameCode} />
    }
    else {
        elementToRender = <GameLobby/>
    }
    return elementToRender
}