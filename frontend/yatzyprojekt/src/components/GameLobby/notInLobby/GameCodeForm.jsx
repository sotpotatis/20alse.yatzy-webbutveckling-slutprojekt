/* GameCodeForm.jsx
Här matar man in spelets kod för att gå med i det. */
import Button from "../../Button";
import InputField from "../../InputField";
import { useState } from "react";
export default function GameCodeForm({ gameCode, onGameCode }) {
    const [validGameCodeEnterred, setValidGameCodeEnterred] = useState(false) // Om en gilltig kod för ett spel ställts in
    return <div>
        <form className="flex flex-col gap-y-4" onSubmit={(form) => {
            console.log("Går med i spel...")
            // TODO: Dubbelkolla att spelet finns och gå med i det
        }}>
            <InputField type={"text"} value={gameCode} placeholder={"Kod"}
                label={"Spelkod"} id="game-code-input"
                onChange={(event) => {
                        onGameCode(event.target.value) // Uppdatera spelkoden när man angivit den.
                }} />
            <Button disabled={!validGameCodeEnterred} text="Gå med" title={validGameCodeEnterred ? null : "Ange en giltig spelkod för att gå vidare."}
                onClick={() => { // När knappen klickas på, validera spelarkoden. Om giltig, starta lobbyn.
                    if (validGameCodeEnterred) {
                        // TODO: Gör saker här
                    }
                    else {
                        alert("Ange ett giltig spelkod för att gå vidare.")
                    }
                } } />
        </form>
    </div>
}