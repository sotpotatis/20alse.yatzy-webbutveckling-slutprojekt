/* CreateGame.jsx
Sida för att skapa ett nytt spel. */
import { useEffect } from "react";
import { SocketContext, socket } from "../context/socket";
export default function CreateGame(){
    // Skapa det nya spelet så fort sidan renderats
    // TODO skapa spelet.
    // TODO lägg in laddningsskärm.
    useEffect(()=> {
        console.log("Skapar ett nytt spel...")
        socket.connect()
        console.log("Ett nytt spel har skapats.")
    })
    return <p>Skapar ett nytt spel...</p>
}