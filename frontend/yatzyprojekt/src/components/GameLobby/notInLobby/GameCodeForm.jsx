/* GameCodeForm.jsx
Här matar man in spelets kod för att gå med i det. */
import { openURL } from "../../../lib/utils";
import Button from "../../Button";
import InputField from "../../InputField";
export default function GameCodeForm({ gameCode, onGameCode }) {
    // Kolla om en gilltig kod för ett spel ställts in
    const validGameCodeEnterred = gameCode !== null && gameCode.length === 6
    return <div>
        <form className="flex flex-col gap-y-4" onSubmit={() => {}}>
            <InputField type={"text"} value={gameCode} placeholder={"Kod"}
                label={"Spelkod"} id="game-code-input"
                onChange={(event) => {
                    onGameCode(event.target.value) // Uppdatera spelkoden när man angivit den.
                }} />
            <Button disabled={!validGameCodeEnterred} text="Gå med" title={validGameCodeEnterred ? null : "Ange en giltig spelkod för att gå vidare."}
                onClick={() => { // När knappen klickas på, validera spelarkoden. Om giltig, starta lobbyn.
                    if (validGameCodeEnterred) {
                        console.log("Går med i ett spel.")
                        openURL(`?gameCode=${gameCode}`)
                    }
                    else {
                        alert("Ange ett giltig spelkod för att gå vidare.")
                    }
                } } />
        </form>
    </div>
}