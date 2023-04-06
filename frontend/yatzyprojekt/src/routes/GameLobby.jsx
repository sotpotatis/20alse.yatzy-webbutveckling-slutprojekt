import { useState } from "react"
import GameCodeInput from "../components/GameLobby/notInLobby/GameCodeInput"
import { SocketContext, socket } from "../context/socket"

/* GameLobby.jsx
Renderar en "lobby", det vill säga en sida där man är när man väntar
på att andra ska gå med under en multiplayer-session */
export default function GameLobby() {
    const [gameCode, setGameCode] = useState(null)
    const [inLobby, setInLobby] = useState(false) // Om användaren väntar på ett spel eller inte
    const [me, setMe] = useState(null) // Användarens spelare
    // Rendera olika saker beroende på om användaren väntar på ett spel eller inte
    let elementToRender = null
    if (!inLobby) {
        elementToRender = <div className="flex items-center justify-center"><GameCodeInput
            gameCode={gameCode}
            onGameCode={
                (gameCode) => {
                console.log(`Spelkod inställd.`)
            }
        }
        /></div>
    }
    else {
        elementToRender = <p>En lobby ska renderas här.</p>
    }
    return <SocketContext.Provider value={socket}>{elementToRender}</SocketContext.Provider>
}