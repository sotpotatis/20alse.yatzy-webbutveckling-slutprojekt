import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../../../context/socket"
import LoadingSpinner from "../../LoadingSpinner"
import ErrorContainer from "../../ErrorContainer"
import {getSavedAuthentication, openURL, saveAuthentication} from "../../../lib/utils.js";
import Player from "../../Player/Player";
import LobbyHeading from "./LobbyHeading";
import Button from "../../Button";
import Heading from "../../Heading";


/* Lobby.jsx
Renderar "lobbyn" som är när man väntar på ett spel. */
export default function Lobby({gameCode, setGameCode}) {
    const socket = useContext(SocketContext) // Kom åt kopplingen till socket-servern
    const checkIsConnected = () => { setConnectionPending(!socket.connected) }
    // Ställ in några variabler för att visa olika laddningsmeddelanden.
    const [connectionPending, setConnectionPending] = useState(!socket.connected)
    const [contactingServer, setContactingServer] = useState(false)
    // Skapa också variabler för felmeddelanden.
    const [errorMessage, setErrorMessage] = useState(null)
    // Lagra information om spelet när vi har hämtat det från servern.
    const [gameInformation, setGameInformation] = useState(null)
    // Lagra information om spelaren (användaren som är uppkopplad)
    const [player, setPlayer] = useState(null)
    // Spåra om ett spel har skapats eller inte
    const [gameCreated, setGameCreated] = useState(false)
    useEffect(() => {
        if (connectionPending) { // Kolla om vi har en uppkoppling till servern 2 gånger per sekund.
            setInterval(checkIsConnected, 500)
        }
        else if (errorMessage === null) { // Om vi har en uppkoppling till servern, gå vidare
            // Om spelkoden är "new" kontaktas först servern för att skapa ett nytt spel.
            if (gameCode === "new" && !gameCreated){
                // Skapa ett nytt spel
                console.log("Ber servern att skapa ett nytt spel...")
                setContactingServer(true)
                socket.emit("createGame")
                socket.on("createGame", (response) => { // Lyssna efter information om nya spel
                    console.log(`Tog emot information om ett nytt spel.`, response)
                    setContactingServer(false)
                    if (response.status === "success"){
                        console.log("Ett nytt spel har skapats.")
                        openURL(`?gameCode=${response.gameCode}`)
                        setGameCreated(true)
                    }
                    else { // Hantera fel
                        console.warn(`Misslyckades med att skapa ett nytt spel: ${response.errorMessage}.`)
                        setErrorMessage(response.errorMessage)
                    }
                })
            }
            else if (gameInformation === null || player === null) {
                // Hämta detaljer om spelet från servern
                if (gameInformation === null){
                    socket.emit("gameInfo", { gameCode: gameCode })
                    socket.on("gameInfo", (response) => { // Hantera fel
                    console.log(`Tog emot spelinformation.`, response)
                    if (response.status === "success") {
                        console.log("Spelinformation har tagits emot.")
                        setGameInformation(response.gameInfo)
                    }
                    else {
                        console.warn(`Misslyckades med att inhämta spelinformation: ${response.errorMessage}.`)
                        // Om felet skulle vara specifikt att ett spel inte går att hittas, omdirigera till där man skriver in spelkoden.
                        if (response.errorType !== null && response.errorType === "gameNotFound"){
                            openURL(`?gameCode=${gameCode}&error=gameNotFound`)
                        }
                        else { // Om vi får ett generiskt fel.
                            setErrorMessage(response.errorMessage)
                        }
                    }
                    })
                }
                else if (player === null) {
                    // Gå med i spelets privata kommunikationskanal.
                    console.log("Går med i spelet...")
                    socket.emit("joinGame", {action: "newPlayer", gameCode: gameCode})
                    socket.on("joinGame", (response)=>{
                        console.log(`Tog emot ett svar om att gå med i spelet.`, response)
                        if (response.status === "success"){
                            // Prenumerera på uppdateringar
                            socket.on("gameUpdate", (response)=>{
                                console.log("Tog emot information om uppdaterad speldata: ", response)
                                if (response.status === "success"){
                                    setGameInformation(response.gameData)
                                }
                                else {
                                    console.warn("Fel! Ett fel inträffade under spelets gång.")
                                    setErrorMessage(response.errorMessage)
                                }
                            })
                            setPlayer(response.player) // Spara den aktuella spelaren.
                            saveAuthentication(response.player.secret) // Spara användarens nyckel så vi kan återansluta
                        }
                        else {
                            console.warn(`Misslyckades med att gå med i ett spel: ${response.errorMessage}.`)
                            setErrorMessage(response.errorMessage)
                    }
                    })
                }

            }
        }
    })
    if (errorMessage !== null) {
        return <ErrorContainer message={errorMessage + ". Testa att ansluta lite senare."}/>
    }
    else if (connectionPending) {
        return <LoadingSpinner fullPage={true} text="Ansluter till spelservern..." />
    }
    else if (contactingServer || player === null || gameInformation === null){
        return <LoadingSpinner fullPage={true} text="Kontaktar spelservern..." />
    }
    else {
        // Skapa element som visar varje spelare som är med
        let playerElements = []
        for (const connectedPlayer of gameInformation.players){
            playerElements.push(<Player name={connectedPlayer.name} score={null} type="card"
            isMe={connectedPlayer.name === player.name}/>)
        }
        return <div key="gameLobby" className="p-3 text-white">
            <LobbyHeading baseURL="https://20alse.ssis.nu/yatzy" gameCode={gameCode}/>
            <Heading size={2}>Anslutna spelare</Heading>
            <div key="players" className="p-12 grid grid-cols-4 gap-x-12 gap-y-12">
                {playerElements}
            </div>
            <div key="startGame" className="relative bottom-0 p-12">
                <Button text={"Starta spel"} color="green" onClick={()=>{
                console.log("Startar spel...")
                }
                }/>
            </div>
        </div>
    }
}