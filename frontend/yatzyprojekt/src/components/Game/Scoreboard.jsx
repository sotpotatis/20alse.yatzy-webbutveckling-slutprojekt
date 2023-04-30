/* Scoreboard.jsx
Visar den enskilda spelarens poäng. */
import Heading from "../Heading"
import ScoreBoardBadge from "./ScoreboardBadge"
import ScoreBoardScore from "./ScoreboardScore"
import { calculateAllPoints, possibleDiceStates } from "20alse-yatzy-shared-code";

export default function ScoreBoard({ gameState, setGameState, player }) {
    let scoreElements = [] // Rendera element för varje poäng
    // Hitta aktuell spelare
    let currentPlayerPoints = null
    for (const gamePlayer of gameState.players){
        if (gamePlayer.name === gameState.currentPlayerName){
            currentPlayerPoints = gamePlayer.points
        }
    }
    // Kolla om vi just nu väljer poäng.
    let isPickingScore = (player.name === gameState.currentPlayerName && gameState.isPickingScore)
    for (const scoreId of Object.keys(possibleDiceStates)) {
        // Hämta poäng från gameState här.
        let claimedPoints = {} // Skapa mapping: poängtyp --> antalet poäng
        for (const currentPlayerPoint in currentPlayerPoints){
            claimedPoints[currentPlayerPoint.scoreType] = currentPlayerPoint.points
        }
        let score = claimedPoints[scoreId] !== undefined ? claimedPoints[scoreId]: 0
        const title = possibleDiceStates[scoreId].information.name // Hämta namnet på poängen
        scoreElements.push(
            <ScoreBoardScore title={title} score={score} pickMode={
                isPickingScore && claimedPoints[scoreId] === undefined
            }
         onPick={()=>{
             console.log("TODO: Implementera!")
         }}
            hasBeenPicked={claimedPoints[scoreId]}/>
        )
    }
    return <div className="p-3">
        <div key="scoreboard-heading" className="flex flex-row gap-x-4">
            <Heading size={2}>Dina poäng</Heading>
            <ScoreBoardBadge size="big" points={2} />
        </div>
        <div key="scoreboard-body" className="grid grid-cols-2 grid-flow-col grid-rows-6">
            {scoreElements}
        </div>
    </div>
}