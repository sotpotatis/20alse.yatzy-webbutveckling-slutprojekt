import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import Container from "../components/Container"
import ErrorContainer from "../components/ErrorContainer"
import DiceWrapper from "../components/Game/DiceWrapper"
import ScoreBoardWrapper from "../components/Game/ScoreboardWrapper"
/* Game.jsx
Innehåller själva spelet. */
export default function Game({isMultiplayer, gameCode, gameStateHandler}) {
    // Variabler som hanterar status i själva spelet
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
        return <ErrorContainer message="Du har inte angivit ett spel-ID. Om du inte skrivit in länken manuellt, kontakta hemsidesadministratören."/>
    }
    return <div className="grid grid-cols-5 w-screen h-screen">
        <DiceWrapper diceStates={[{
            number: 1,
            locked: false
        },
        {
            number: 1,
            locked: false
            },
            {
                number: 6,
                locked: true
            },
            {
                number: 5,
                locked: false
            },
            {
                number: 3,
                locked: false
            }]}
            isClaimedBy={
                {
                    name: "Test",
                    me: false
            }
        } />
        <ScoreBoardWrapper/>
    </div>
}