import Button from "../Button"
import Dice from "./Dice"

/* DiceWrapper.jsx
Renderar en "behållare" som innehåller tärningar. */
export default function DiceWrapper({ diceStates, isClaimedBy }) {
    let children = []
    // Generera element för varje tärning
    let dices = []
    let i = 1
    for (const diceData of diceStates) {
        dices.push(
            <Dice key={`dice-${i}`} activeSide={diceData.number} isLocked={diceData.locked}/>
        )
        i ++
    }
    // Lägg till alla tärningar
    children.push(<div key="dices-wrapper" className="grid grid-cols-5 gap-x-12">
        {dices}
    </div>)
    // Om isClaimedBy.isMe är false kan inte användarens webbläsare klicka på tärningarna eftersom någon annan
    // håller på att rulla de. Detta används för multiplayer-läget.
    if (!isClaimedBy.me) {
        children.push(
            <div key="message" className="absolute top-0 flex items-center text-center justify-center z-10 bg-gray-500 opacity-50 hover:cursor-disabled">
                <p className="font-bold">{isClaimedBy.name} kastar tärningar just nu.</p>
        </div>)
    }
    return <div className={`col-span-3 py-12 px-3`} key="dices-page">
        {children}
        <div key="buttons" className="flex flex-row gap-x-12 p-3 w-full justify-center">
            <Button color="green" text="Slå" icon="ooui:reload" />
            <Button color="red" text="Avsluta" icon="majesticons:close-line" />
        </div>
    </div>
}
DiceWrapper.defaultProps = {
    isClaimedBy: {
        isMe: true,
        name: null
    }
}