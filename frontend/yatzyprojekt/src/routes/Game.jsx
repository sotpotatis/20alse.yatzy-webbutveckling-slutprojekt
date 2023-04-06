import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import Container from "../components/Container"
import ErrorContainer from "../components/ErrorContainer"
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
    // Om spelet är i flerspelarläge eller inte sätts med URL-parametern ?mode. Hämta detta nedan.
    const [searchParams, setSearchParams] = useSearchParams()
    const gameMode = searchParams.get("mode") || "singleplayer"
    // Om vi är i multiplayerläge så kommer vi att ha spelets ID som en URL-parameter.
    const gameId = searchParams.get("id") || null
    if (gameMode === "multiplayer" && gameId === null) { // Validera URL-parametrar.
        return <ErrorContainer message="Du har inte angivit ett spel-ID. Om du inte skrivit in länken manuellt, kontakta hemsidesadministratören."/>
    }
    else if (gameMode !== "singleplayer" && gameMode !== "multiplayer") {
        return <ErrorContainer message="Du har inte angivit ett spelID. Om du inte skrivit in länken manuellt, kontakta hemsidesadministratören."/>
    }
    return <h1>{gameMode}</h1>
}