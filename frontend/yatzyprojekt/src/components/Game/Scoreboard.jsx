/* Scoreboard.jsx
Visar den enskilda spelarens poäng. */
import Heading from "../Heading"
import ScoreBoardBadge from "./ScoreboardBadge"
import ScoreBoardScore from "./ScoreboardScore"
import { calculateAllPoints, possibleDiceStates } from "20alse-yatzy-shared-code";

export default function ScoreBoard({ gameState, setGameState, player, isMultiplayer, tentativePoints, onScorePick}) {
    let scoreElements = [] // Rendera element för varje poäng
    // Hitta aktuell spelare
    let currentPlayerPoints = {} // Skapa mapping: poängtyp --> antalet poäng
    let currentPlayerTotalPoints = 0
    for (const gamePlayer of gameState.players){
        //...och beräkna dennes totalpoäng!...
        if (gamePlayer.name === gameState.currentPlayerName){
            for (const score of gamePlayer.scores){
                currentPlayerPoints[score.scoreType] = score.points
                currentPlayerTotalPoints += score.points
            }
        }
    }
    // Kolla om vi just nu väljer poäng.
    let isPickingScore = (player.name === gameState.currentPlayerName && gameState.isPickingScore)
    for (const scoreId of Object.keys(possibleDiceStates)) {
        // Hämta poäng från gameState här.
        const hasBeenClaimed = currentPlayerPoints[scoreId] !== undefined
        let score = hasBeenClaimed ? currentPlayerPoints[scoreId]: (gameState.isPickingScore ? tentativePoints[scoreId].value : 0)
        const title = possibleDiceStates[scoreId].information.name // Hämta namnet på poängen
        scoreElements.push(
            <ScoreBoardScore title={title} points={score} pickMode={
                isPickingScore
            }
         onPick={!hasBeenClaimed ? ()=>{
             onScorePick(scoreId)
         }:null}
            hasBeenPicked={hasBeenClaimed}
            />
        )
    }
    return <div className="p-3">
        <div key="scoreboard-heading" className="flex flex-row gap-x-4">
            <Heading size={2}>{gameState.currentPlayerName}'s poäng</Heading>
            <ScoreBoardBadge size="big" points={currentPlayerTotalPoints} isPickable={false} />
        </div>
        <div key="scoreboard-body" className="grid grid-cols-1 md:grid-cols-2 md:grid-flow-col grid-rows-6">
            {scoreElements}
        </div>
    </div>
}