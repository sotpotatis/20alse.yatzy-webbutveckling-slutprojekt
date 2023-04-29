/* GameCodeForm.jsx
Här matar man in spelets kod för att gå med i det. */
import { openURL } from "../../../lib/utils";
import Button from "../../Button";
import InputField from "../../InputField";
import {useState} from "react";
import {redirect, useNavigate, useSearchParams} from "react-router-dom";
export default function GameCodeForm({ gameCode, onGameCode }) {
    const navigate = useNavigate()
    const [gameCodeHasBeenUpdated, setGameCodeHasBeenUpdated] = useState(false)
    // Kolla om en giltig kod för ett spel ställts in (ska vara ett nummer större än 0)
    const validGameCodeEnterred = !Number.isNaN(Number.parseInt(gameCode)) && Number(gameCode) > 0
    // Det finns ett specialfall ifall användaren försökt att gå med i ett spel men det inte finns någon kod för det aktuella spelet.
    // I sådana fall omdirigerar lobbyn (se GameLobby/inLobby/Lobby.jsx) tillbaka till denna sida men med en parameter error=gameNotFound.
    // Vi hanterar detta här nere
    const [searchParams, setSearchParams] = useSearchParams()
    // ...och om det är något fel med spelkoden så vill vi ju berätta det för användaren (WCAG!). Så vi skapar lite variabler här enre för att hålla koll på det
    let showInputFieldInvalidMessage = false
    let inputFieldInvalidExplanation = null
    if (searchParams.get("error") === "gameNotFound" && !gameCodeHasBeenUpdated){
        inputFieldInvalidExplanation = "Hittade inget spel med den koden. Kolla med den som skickat koden till dig!"
        showInputFieldInvalidMessage = true
    }
    else {
        inputFieldInvalidExplanation = "Ange en giltig spelkod (endast siffror)."
        // (vi vill visa ett felmeddelande om användaren angivit minst ett tecken i spelkoden och det som just nu är angivet är ogiltigt)
        showInputFieldInvalidMessage = !validGameCodeEnterred && gameCode !== null && gameCode.length > 0
    }
    return <div key="game-code-form">
        <form className="flex flex-col gap-y-4">
            <InputField type={"text"} value={gameCode} invalid={showInputFieldInvalidMessage} invalidExplanation={inputFieldInvalidExplanation} placeholder={"Kod"}
                label={"Spelkod"} id="game-code-input"
                onChange={(event) => {
                    setGameCodeHasBeenUpdated(true)
                    onGameCode(event.target.value) // Uppdatera spelkoden när man angivit den.
                }} />
            <Button type="button" disabled={!validGameCodeEnterred} text="Gå med" title={validGameCodeEnterred ? null : "Ange en giltig spelkod för att gå vidare."}
                onClick={() => { // När knappen klickas på, validera spelarkoden. Om giltig, starta lobbyn.
                    if (validGameCodeEnterred) {
                        console.log("Går med i ett spel.")
                        navigate(`?gameCode=${gameCode}`)
                    }
                } } />
        </form>
    </div>
}