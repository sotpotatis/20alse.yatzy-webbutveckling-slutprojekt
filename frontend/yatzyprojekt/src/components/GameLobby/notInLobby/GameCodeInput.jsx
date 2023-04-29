import Container from "../../Container";
import GameCodeForm from "./GameCodeForm";

/* GameCodeInput.jsx 
Steget där man går med i ett spel. */
export default function GameCodeInput({gameCode, onGameCode}) {
    return <Container title="Gå med i ett spel" children={
        [<p>Skriv in spelets kod nedan. Koden får du av din kompis!</p>,
        <GameCodeForm gameCode={gameCode} onGameCode={onGameCode} />]
    }/>
}