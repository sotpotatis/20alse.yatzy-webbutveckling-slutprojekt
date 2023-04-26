/* Dice.jsx
Renderar en tärning. */
// Importera tärningsbilder
import { Icon } from "@iconify/react";
import dice1Image from "../../assets/dice-1.png";
import dice2Image from "../../assets/dice-2.png";
import dice3Image from "../../assets/dice-3.png";
import dice4Image from "../../assets/dice-4.png";
import dice5Image from "../../assets/dice-5.png";
import dice6Image from "../../assets/dice-6.png";
const numberToDiceImage = { // Mappings: tärning --> bild
    "1": dice1Image,
    "2": dice2Image,
    "3": dice3Image,
    "4": dice4Image,
    "5": dice5Image,
    "6": dice6Image
}
export default function Dice({ activeSide, isLocked }) {
    const diceImage = numberToDiceImage[activeSide.toString()] // Hämta bild som ska användas
    let dice = <img src={diceImage} className="w-auto" alt={`Tärning som visar siffran ${activeSide}.`} />
    let children = [
        <div className={`p-2 bg-white ring-4 rounded-[1em] overflow-clip ` + (isLocked ? "ring-sky-400 hover:cursor-not-allowed hover:opacity-50" : "ring-gray-200 hover:cursor-pointer")}>
        {dice}
    </div>
    ]
    if (isLocked) { // Lägg till ikon om tärningen är låst
        children.push(<p className="text-sky-400 z-10 relative left-3/4 bottom-[2em] bg-gray-600 rounded-full border-2 border-sky-400 max-w-min p-1 flex items-center">
        <Icon className="text-3xl" icon="material-symbols:lock"/></p>)
    }
    return <div>
        {children}
    </div>

}
Dice.defaultProps = {
    activeSide: 1,
    isLocked: false
}