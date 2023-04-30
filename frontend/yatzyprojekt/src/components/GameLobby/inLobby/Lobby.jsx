import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../../../context/socket"
import LoadingSpinner from "../../LoadingSpinner"
import ErrorContainer from "../../ErrorContainer"
import {getSavedAuthentication, openURL, saveAuthentication} from "../../../lib/utils.js";
import {useNavigate} from "react-router-dom";
import Player from "../../Player/Player";
import LobbyHeading from "./LobbyHeading";
import Button from "../../Button";
import Heading from "../../Heading";


/* Lobby.jsx
Renderar "lobbyn" som är när man väntar på ett spel. */
export default function Lobby({gameCode, setGameCode}) {
    const socket = useContext(SocketContext) // Kom åt kopplingen till socket-servern
    const navigate = useNavigate() // ...och möjligheten att navigera!
    const checkIsConnected = () => { setConnectionPending(!socket.connected) }
    // Ställ in några variabler för att visa olika laddningsmeddelanden.
    const [connectionPending, setConnectionPending] = useState(!socket.connected)
    // Skapa också variabler för felmeddelanden.
    const [errorMessage, setErrorMessage] = useState(null)
    // Lagra information om spelet när vi har hämtat det från servern.
    const [gameInformation, setGameInformation] = useState(null)
    // Lagra information om spelaren (användaren som är uppkopplad)
    const [player, setPlayer] = useState(null)
    // Skapa en funktion som körs när spelet har startat
    const onGameStart = () => {
        console.log("Omdirigerar till spelets sida...")
        navigate(`/yatzy/game?mode=multiplayer&gameCode=${gameCode}`)
    }
    useEffect(() => {
        if (connectionPending) { // Kolla om vi har en uppkoppling till servern 2 gånger per sekund.
            setInterval(checkIsConnected, 500)
        }
        else if (errorMessage === null) { // Om vi har en uppkoppling till servern, gå vidare
            // Om spelkoden är "new" kontaktas först servern för att skapa ett nytt spel.
            if (gameCode === "new"){
                // Skapa ett nytt spel
                console.log("Ber servern att skapa ett nytt spel...")
                socket.emit("createGame")
                socket.on("createGame", (response) => { // Lyssna efter information om nya spel
                    console.log(`Tog emot information om ett nytt spel.`, response)
                    if (response.status === "success"){
                        console.log("Ett nytt spel har skapats.")
                        setGameCode(response.gameCode)
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
                            navigate(`?gameCode=${gameCode}&error=gameNotFound`)
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
                            socket.on("gameStarted", (response)=>{
                                onGameStart()
                            })
                            setPlayer(response.player) // Spara den aktuella spelaren.
                            saveAuthentication(response.player.secret) // Spara användarens nyckel så vi kan återansluta
                        }
                        else {
                            console.warn(`Misslyckades med att gå med i ett spel: ${response.errorMessage}.`)
                            setErrorMessage(response.errorMessage)
                    }
                    })
                    socket.emit("joinGame", {action: "newPlayer", gameCode: gameCode})
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
    else if (player === null || gameInformation === null){
        return <LoadingSpinner fullPage={true} text="Kontaktar spelservern..." />
    }
    else {
        // Skapa element som visar varje spelare som är med
        let playerElements = []
        let meFound = false // Ett litet hack för att fixa en bugg där spelarens namn inte visas.
        for (const connectedPlayer of gameInformation.players){
            if (connectedPlayer.name === player.name){
                meFound = true
            }
            playerElements.push(<Player name={connectedPlayer.name} score={null} type="card"
            isMe={connectedPlayer.name === player.name}/>)
        }
        if (!meFound){ // Läs ovan: ett litet hack som jag applicerar för att rendera saker korrekt
            playerElements.splice(0, 0, <Player name={player.name} score={null} type="card"
            isMe={true}/>) // Lägg till information om den aktuella spelaren först i listan.
        }
        // Kolla om spelet kan startas eller inte.
        const gameCanNotBeStarted = connectionPending || gameInformation.players === undefined || (gameInformation.players.length < 2 && !(!meFound && gameInformation.players.length === 1))
        let startGameElements = [
            <Button text={"Starta spel"} disabled={gameCanNotBeStarted} color="green" onClick={()=>{
                console.log("Startar spel...")
                // Prenumerera på svar
                socket.on("startGame", (response)=>{
                    console.log("Tog emot ett svar om att starta spelet.")
                    if (response.status === "success"){
                        onGameStart() // Kör funktion för att öppna spelet.
                    }
                    else {
                        console.warn("Det verkar som att spelet misslyckades med att starta!")
                        setErrorMessage(`Kunde inte starta spelet på grund av följande fel: ${response.message}`)
                    }
                })
                // Skicka kommando till servern.
                socket.emit("startGame", {gameCode: gameCode}) // Notera: startGame är kommando för att starta spelet, och gameStarted är eventet som servern skickar tillbaka (prenumereras på ovan)
                }
                }/>
        ] // Lägg till knapp för att starta spelet
        if (gameCanNotBeStarted){ // Om spelet inte kan startas, lägg till en instruktion varför under knappen.
            startGameElements.push(
                <p className="text-sm text-white py-3">Spelet kan startas när minst 1 spelare (förutom du) har anslutit.</p>
            )
        }
        return <div key="gameLobby" className="p-3 text-white">
            <LobbyHeading baseURL="https://20alse.ssis.nu/yatzy" gameCode={gameCode}/>
            <Heading size={2}>Anslutna spelare</Heading>
            <div key="players" className="p-12 grid grid-cols-4 gap-x-12 gap-y-12">
                {playerElements}
            </div>
            <div key="startGame" className="relative bottom-0 p-12">
                {startGameElements}
            </div>
        </div>
    }
}