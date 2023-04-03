/* GameCodeForm.jsx
Här matar man in spelets kod för att gå med i det. */
import InputField from "../../InputField";
import { setState } from "react";
export default function GameCodeForm(props) {
    const [gameCode, setGameCode] = [props.gameCode, props.setGameCode]
    return <div>
        <form onSubmit={(form) => {
            console.log("Går med i spel...")
            // TODO: Dubbelkolla att spelet finns och gå med i det
        }}>
            <InputField type={"text"} value={gameCode} placeholder={"Kod"}
                label={"Spelkod"} id="game-code-input"
                onChange={(event) => {
                    setGameCode(event.target.value)
                } } />
        </form>
    </div>
}