import Button from "../Button"
import Dice from "./Dice"
import Heading from "../Heading.jsx";
import {useState} from "react";
import {Helmet} from "react-helmet";

/* DiceWrapper.jsx
Renderar en "behållare" som innehåller tärningar. */
export default function DiceWrapper({ gameState, setGameState, isClaimedBy, onReRollButtonClick, onDoneButtonClick }) {
    // Vi vill låta användaren kunna låsa upp låsta tärningar ifall tärningen låstes under den aktuella rundan.
    // Därför håller vi koll på när tärningarna låstes.
    const [dicesLockedThisRound, setDicesLockedThisRound] = useState({
        dices: [],
        turnNumber: gameState.turnNumber
    })
    let children = []
    // Generera element för varje tärning
    let dices = []
    for (let i=0;i<gameState.dices.length;i++) {
        const diceData = gameState.dices[i]
        const isLocked = diceData.saved
        const isUnlockable = dicesLockedThisRound.dices.includes(i)
        // Skapa en funktion för när användaren låser tärningen
        const onLocked = () => {
            let newGameState = {...gameState}
            let newDicesLockedThisRound = {...dicesLockedThisRound}
            if (!isLocked){
                console.log(`Låser tärningsstatus för tärning ${i}...`)
                newDicesLockedThisRound.dices.push(i)
                setDicesLockedThisRound(newDicesLockedThisRound)
                newGameState.dices[i].saved = true
            }
            else if (isUnlockable) {
                console.log(`Låser upp tärningsstatus för tärning ${i}...`)
                newDicesLockedThisRound.dices.splice(newDicesLockedThisRound.dices.indexOf(i), 1)
                setDicesLockedThisRound(newDicesLockedThisRound)
                newGameState.dices[i].saved = false
            }
            else {
                console.log(`Går inte att låsa upp tärning ${i}.`)
            }

            setGameState(newGameState)
            console.log("Tärning låst.")
        }
        dices.push(
            <Dice key={`dice-${i}`} activeSide={diceData.number} isLocked={isLocked}
            isUnlockable={isUnlockable}
            onLocked={
                onLocked
            }/>
        )
    }
    // Lägg till alla tärningar
    children.push(
        <div className={`col-span-3 py-12 px-8 text-white`} key="dices-page">
        <div key="dices-wrapper" className="grid grid-cols-3 md:grid-cols-5 gap-x-12 gap-y-12">
            {dices}
        </div>
        <div key="buttons" className="flex flex-row gap-x-12 pt-12 w-full justify-center">
            <Heading size={3} className="py-12">Tur {gameState.currentTurnNumber}/3</Heading>
            <Button color="green" text="Slå" icon="ooui:reload" onClick={onReRollButtonClick}
            disabled={gameState.isPickingScore || gameState.currentTurnNumber >= 3}/>
            <Button color="red" text="Avsluta" icon="majesticons:close-line" onClick={onDoneButtonClick}
            disabled={gameState.isPickingScore}/>
        </div></div>)
    // Om isClaimedBy.isMe är false kan inte användarens webbläsare klicka på tärningarna eftersom någon annan
    // håller på att rulla de. Detta används för multiplayer-läget.
    // Och om användaren håller på att välja en poäng ska man inte heller kunna klicka på tärningarna.
    if (!isClaimedBy.me || gameState.isPickingScore) {
        children.push(
            <div key="message" className="absolute top-0 h-screen w-screen z-10 bg-gray-500 opacity-50 hover:cursor-disabled">
        </div>)
    }
    return children
}
DiceWrapper.defaultProps = {
    isClaimedBy: {
        isMe: true,
        name: null
    }
}