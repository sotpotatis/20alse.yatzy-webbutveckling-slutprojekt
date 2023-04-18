import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../../../context/socket"
import LoadingSpinner from "../../LoadingSpinner"
import ErrorContainer from "../../ErrorContainer"
import {openURL} from "../../../lib/utils.js";


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
    useEffect(() => { // Kolla om vi har en uppkoppling till servern 2 gånger per sekund
        if (connectionPending) {
            setInterval(checkIsConnected, 500)
        }
        else { // Om vi har en uppkoppling till servern, gå vidare
            // Om spelkoden är "new" kontaktas först sevrvern för att skapa ett nytt spel.
            if (gameCode === "new"){
                // Skapa ett nytt spel
                console.log("Ber servern att skapa ett nytt spel...")
                setContactingServer(true)
                socket.emit("createGame")
                socket.on("createGame", (response) => { // Lyssna efter information om nya spel
                    console.log(`Tog emot information om ett nytt spel.`, response)
                    setContactingServer(false)
                    if (response.status === "success"){
                        setGameCode(response.gameCode)
                    }
                    else { // Hantera fel
                        console.warn(`Misslyckades med att skapa ett nytt fel: ${response.errorMessage}.`)
                        setErrorMessage(response.errorMessage)
                    }
                })
            }
            else {
                // Hämta detaljer om spelet från servern
                console.log("Efterfrågar spelinformation...")
                setContactingServer(true)
                socket.emit("gameInfo", { gameCode: gameCode })
                socket.on("gameInfo", (response) => { // Hantera fel
                    console.log(`Tog emot spelinformation.`, response)
                    setContactingServer(false)
                    if (response.status === "success") {

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
        }
        
    })
    if (connectionPending) {
        return <LoadingSpinner fullPage={true} text="Ansluter till spelservern..." />
    }
    else if (contactingServer){
        return <LoadingSpinner fullPage={true} text="Kontaktar spelservern..." />
    }
    else if (errorMessage !== null) {
        return <ErrorContainer message={errorMessage + ". Testa att ansluta lite senare."}/>
    }
    else { 
        
    }
}