/* LobbyHeading.jsx
En rubrik när man väntar på ett spel som innehåller information om hur man kan få andra att ansluta. */
import Heading from "../../Heading";
import {copyTextToClipboard} from "../../../lib/utils.js";
import {useEffect, useState} from "react";

export default function LobbyHeading({baseURL, gameCode}){
    const joinUrl = `${baseURL}/lobby?gameCode=${gameCode}` // Skapa en fullständig länk för att gå med i spelet
    const [gameCodeCopiedToClipboard, setGameCodeCopiedToClipboard] = useState(false)
    // Skapa en laddningsanimation när man läser in
    const [numberOfDots, setNumberOfDots] = useState(0)
    const updateNumberOfDots = () => {
        if (numberOfDots < 3){
            setNumberOfDots(numberOfDots+1)
        }
        else {
            setNumberOfDots(0)
        }
    }
    let children = [
        <Heading size={1} icon={"eos-icons:three-dots-loading"}>Väntar på spelare{`.`*numberOfDots}</Heading>,
        <p>Låt dina kompisar gå med i spelet genom att skicka följande länk:</p>,
        <p className="select-all px-3 py-1 rounded-full bg-gray-500" onClick={()=> {copyTextToClipboard(joinUrl, (textCopied)=>{
            setGameCodeCopiedToClipboard(textCopied)
        })}}></p>
    ]
    useEffect(()=>{
        setInterval(updateNumberOfDots, 750)
    })
    // Visa ett meddelande om länken för spelet kopierats till klippbordet
    if (gameCodeCopiedToClipboard){
        children.push(<p className="text-blue-400 text-sm">Kopierad till urklipp!</p>)
    }
    return <div>
        {children}
    </div>
}