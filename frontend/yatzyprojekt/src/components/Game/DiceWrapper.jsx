import Button from "../Button"
import Dice from "./Dice"

/* DiceWrapper.jsx
Renderar en "behållare" som innehåller tärningar. */
export default function DiceWrapper({ gameState, setGameState, isClaimedBy, onReRollButtonClick, onDoneButtonClick }) {
    let children = []
    // Generera element för varje tärning
    let dices = []
    for (let i=0;i<gameState.dices.length;i++) {
        const diceData = gameState.dices[i]
        // Skapa en funktion för när användaren låser tärningen
        const onLocked = () => {
            let newGameState = {...gameState}
            console.log(`Låser tärningsstatus för tärning ${i}...`)
            newGameState.dices[i].saved = true
            setGameState(newGameState)
            console.log("Tärning låst.")
        }
        dices.push(
            <Dice key={`dice-${i}`} activeSide={diceData.number} isLocked={diceData.saved}
            onLocked={
                onLocked
            }/>
        )
    }
    // Lägg till alla tärningar
    children.push(<div key="dices-wrapper" className="grid grid-cols-5 gap-x-12">
        {dices}
    </div>)
    // Om isClaimedBy.isMe är false kan inte användarens webbläsare klicka på tärningarna eftersom någon annan
    // håller på att rulla de. Detta används för multiplayer-läget.
    // Och om användaren håller på att välja en poäng ska man inte heller kunna klicka på tärningarna.
    if (!isClaimedBy.me && gameState.isPickingScore) {
        children.push(
            <div key="message" className="absolute top-0 w-full h-full z-10 bg-gray-500 opacity-50 hover:cursor-disabled">
                <p className="font-bold">{isClaimedBy.name} kastar tärningar just nu.</p>
        </div>)
    }
    return <div className={`col-span-3 py-12 px-3`} key="dices-page">
        {children}
        <div key="buttons" className="flex flex-row gap-x-12 p-3 w-full justify-center">
            <Button color="green" text="Slå" icon="ooui:reload" onClick={onReRollButtonClick} />
            <Button color="red" text="Avsluta" icon="majesticons:close-line" onClick={onDoneButtonClick}/>
        </div>
    </div>
}
DiceWrapper.defaultProps = {
    isClaimedBy: {
        isMe: true,
        name: null
    }
}