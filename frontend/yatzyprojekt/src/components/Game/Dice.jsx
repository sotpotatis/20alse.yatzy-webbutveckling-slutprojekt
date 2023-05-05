/* Dice.jsx
Renderar en tärning. */
// Importera tärningsbilder
import { Icon } from "@iconify/react";

export default function Dice({ activeSide, isLocked, isUnlockable, onLocked }) {
    const diceImage = `dice-${activeSide.toString()}.png`// Hämta bild som ska användas
    let dice = <img src={diceImage} className="w-auto" alt={`Tärning som visar siffran ${activeSide}.`} />
    let children = [
        <div className={`p-2 bg-white ring-8 rounded-[1em] overflow-clip ` + (isLocked ? "ring-sky-400 hover:cursor-not-allowed hover:opacity-80" : "ring-gray-200 hover:cursor-pointer")}>
        {dice}
    </div>
    ]
    if (isLocked) { // Lägg till ikon om tärningen är låst
        children.push(<p className="text-sky-400 z-10 relative left-3/4 bottom-[2em] bg-gray-600 rounded-full border-4 border-sky-400 max-w-min p-1 flex items-center">
        <Icon className="text-3xl" icon="material-symbols:lock"/></p>)
    }
    return <div onClick={!isLocked || isUnlockable ?
        onLocked: null
    }>
        {children}
    </div>

}
Dice.defaultProps = {
    activeSide: 1,
    isLocked: false,
    isUnlockable: false
}