import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../../../context/socket"
import LoadingSpinner from "../../LoadingSpinner"
import ErrorContainer from "../../ErrorContainer"


/* Lobby.jsx
Renderar "lobbyn" som är när man väntar på ett spel. */
export default function Lobby({gameCode}) {
    const socket = useContext(SocketContext) // Kom åt kopplingen till socket-servern
    const checkIsConnected = () => { setConnectionPending(!socket.connected) }
    const [connectionPending, setConnectionPending] = useState(!socket.connected)
    const [errorMessage, setErrorMessage] = useState(null)
    useEffect(() => { // Kolla om vi har en uppkoppling till servern 2 gånger per sekund
        if (connectionPending) {
            setInterval(checkIsConnected, 500)
        }
        else { // Hämta detaljer om spelet från servern
            console.log("Efterfrågar spelinformation...")
            socket.emit("gameInfo", { gameCode: gameCode })
            socket.on("gameInfo", (response) => {
                console.log(`Tog emot spelinformation.`, response)
                if (response.status === "success") {
                    
                }
                else {
                    console.warn(`Misslyckades med att inhämta spelinformation: ${response.errorMessage}.`)
                    setErrorMessage(response.errorMessage)
                }
            })
        }
        
    })
    if (connectionPending) {
        return <LoadingSpinner fullPage={true} text="Ansluter till servern..." />
    }
    else if (errorMessage !== null) {
        return <ErrorContainer message={errorMessage + ". Testa att ansluta lite senare."}/>
    }
    else { 
        
    }
}