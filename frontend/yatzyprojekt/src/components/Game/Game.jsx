import {useContext, useEffect, useState} from "react"
import { useSearchParams } from "react-router-dom"
import Container from "../../components/Container"
import ErrorContainer from "../../components/ErrorContainer"
import DiceWrapper from "./DiceWrapper"
import ScoreBoardWrapper from "./ScoreboardWrapper"
import PlayerWrapper from "./PlayerWrapper"
import { calculateAllPoints, possibleDiceStates } from "20alse-yatzy-shared-code";
import LoadingSpinner from "../../components/LoadingSpinner";
import {SocketContext} from "../../context/socket.js";
import LocalGameStateHandler from "../../lib/localGameStateHandler.js";
/* GamePage.jsx
Innehåller själva spelet. */
export default function Game() {
    // Variabler som hanterar status i själva spelet
    // currentGameState är ett JSON-objekt med aktuell spelstatus som följer ett visst format.
    // Om spelet körs i multiplayerläge hämtas denna status från en server, annars skapas denna status i webbläsaren.
    // Statusen är ett objekt med massa info.
    const socket = useContext(SocketContext)
    // Om spelet är i multiplayerläge eller inte sätts med URL-parametern ?mode. Hämta detta nedan.
    const [searchParams, setSearchParams] = useSearchParams()
    const gameMode = searchParams.get("mode") || "local"
    const [currentGameState, setCurrentGameState] = useState(null)
    const [player, setPlayer] = useState(null) // Information om den användaren som spelar spelet.
    const [localGameStateHandler, setLocalGameStateHandler] = useState(gameMode !== "multiplayer" ?
    new LocalGameStateHandler(setCurrentGameState, setPlayer): null) // Initiera en hanterare för spelstatus om vi använder ett lokalt spel.
    // Spåra om saker och ting laddas
    const [isLoading, setLoading] = useState(false) // Vi behöver ladda lite saker om vi har multiplayer
    // Spåra felmeddelande
    const [errorMessage, setErrorMessage] = useState(null)
    // Om vi är i multiplayerläge så kommer vi att ha spelets ID som en URL-parameter.
    const gameCode = searchParams.get("gameCode") || null
    if (gameMode === "multiplayer" && gameCode === null) { // Validera URL-parametrar.
        return <ErrorContainer message="Du har inte angivit ett spel-ID. Om du inte skrivit in länken manuellt, kontakta hemsidesadministratören."/>
    }
    else if (gameMode !== "local" && gameMode !== "multiplayer") {
        return <ErrorContainer message="Du har inte angivit ett spel-ID. Om du inte skrivit in länken manuellt, kontakta hemsidesadministratören."/>
    }
    const [connectionPending, setConnectionPending] = useState(gameMode === "multiplayer" && !socket.connected)
    const checkIsConnected = () => {setConnectionPending(!socket.connected)}
    useEffect(()=> {
        if (gameMode === "multiplayer" && connectionPending) {
            setTimeout(checkIsConnected, 500)
        }
        // Kolla efter uppkoppling 2 gånger per sekund
    })
    if ((currentGameState === null || player === null) && (!connectionPending || gameMode !== "multiplayer")){ // Detta händer vid spelet start: då ska vi hämta spelstatus
        if (gameMode === "multiplayer"){ // Multiplayer: status ska hämtas från servern
            console.log("Prenumererar på event för multiplayer...")
            // Prenumerera på uppdateringar
            socket.on("gameUpdate", (response)=>{
                console.log("Tog emot information om uppdaterad speldata: ", response)
                if (response.status === "success"){
                    setCurrentGameState(response.gameData)
                    // Uppdatera även användarens aktuella spelare.
                }
                else {
                    console.warn("Fel! Ett fel inträffade under spelets gång.")
                    setErrorMessage(response.errorMessage)
                }
            })
            socket.on("getMe", (response)=>{
                console.log("Tog emot information om aktuell spelare: ", response)
                if (response.status === "success"){
                    setPlayer(response.you)
                }
                else {
                    console.warn("Fel! Ett fel inträffade när spelare skulle hämtas.")
                    setErrorMessage(response.errorMessage)
                }
            })
            console.log("Prenumererat.")
            console.log("Efterfrågar uppdatering om spel...")
            socket.emit("getGameState", {gameCode: gameCode})
            socket.emit("getMe")
        }
        else {
            console.log("Skapar ursprunglig status för enspelarläge...")
            localGameStateHandler.createInitialGameState(2)
        }
    }
    // Rendera nu all information
    let children = [] // Element som ska renderas
    if (errorMessage !== null){
        children.push(<ErrorContainer message={errorMessage}/>) // Rendera ett felmeddelande om vi har det.
    }
    else if (connectionPending){ // Om vi inte är anslutna till servern, visa ett meddelande
        children.push(<LoadingSpinner text={"Ansluter till servern..."} fullPage={true}/>)
    }
    else if (currentGameState === null || player === null || isLoading) { // Om vi laddar saker (händer endast på multiplayer), visa ett meddelande
        children.push(<LoadingSpinner text={"Kontaktar servern..."} fullPage={true}/>)
    }
    else {
        console.log("Renderar spelstatus...")
        // Skapa lite funktioner för när man klickar på olika knappar.
        // Funktioner är olika baserade på om användaren spelar i enspelarläge eller flerspelarläge
        let doneFunction = null
        let reRollFunction = null
        if (gameMode === "multiplayer"){
            // TODO implementera
        }
        else {
            reRollFunction = ()=>{
                localGameStateHandler.onReRollButtonClick({...currentGameState})
                if (currentGameState.currentTurnNumber >= 3){
                    doneFunction()
                }
            }
            doneFunction = ()=>{
                localGameStateHandler.onDoneButtonClick({...currentGameState})
            }
        }
        children.push(<div className="grid grid-cols-5 w-screen h-screen">
            <DiceWrapper diceStates={currentGameState.dices}
            gameState={currentGameState}
             setGameState={setCurrentGameState}
            isClaimedBy={
                {
                    name: currentGameState.currentPlayerName,
                    me: currentGameState.currentPlayerName === player.name
            }
            }
            onReRollButtonClick={reRollFunction}
            onDoneButtonClick={doneFunction}/>
        <ScoreBoardWrapper gameState={currentGameState} setGameState={setCurrentGameState} player={player}/>
    </div>)
    }
    return children
    }
