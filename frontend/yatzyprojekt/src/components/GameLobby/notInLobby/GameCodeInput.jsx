import GameCodeForm from "./GameCodeForm";

/* GameCodeInput.jsx 
Steget där man går med i ett spel. */
export default function GameCodeInput(props) {
    const [gameCode, setGameCode] = [props.gameCode, props.setGameCode]
    return <div id="game-code-input" className="h-full w-full flex-col gap-y-8 flex items-center justify-center align-center text-center">
        <h1 className="text-3xl font-bold">Gå med i ett spel</h1>
        <p>Skriv in spelets kod nedan. Koden får du av din kompis!</p>
        <GameCodeForm gameCode={gameCode} setGameCode={setGameCode} />
    </div>
}