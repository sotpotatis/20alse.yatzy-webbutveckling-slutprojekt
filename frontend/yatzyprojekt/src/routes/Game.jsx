import { useState } from "react"

/* Game.jsx
Innehåller själva spelet. */
export default function Game({isMultiplayer, gameCode, gameStateHandler}) {
    // Variabler som hanterar status i själva spelet
    /*const [currentTurn, setCurrentTurn] = useState(null)
    const [currentScore, setCurrentScore] = useState(null)
    const [ownPlayer, setOwnPlayer] = useState(null)*/
    // currentGameState är ett JSON-objekt med aktuell spelstatus som följer ett visst format.
    // Om spelet körs i flerspelarläge hämtas denna status från en server, annars skapas denna status i webbläsaren.
    const [currentGameState, setCurrentGameState] = useState(null)
    return <h1>Hello world!</h1>
}