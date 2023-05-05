/* Scoreboard.jsx
Visar den enskilda spelarens poäng. */
import Heading from "../Heading"
import ScoreBoardBadge from "./ScoreboardBadge"
import ScoreBoardScore from "./ScoreboardScore"
import { calculateAllPoints, possibleDiceStates } from "20alse-yatzy-shared-code";
import Container from "../Container";

export default function ScoreBoard({ gameState, setGameState, player, isMultiplayer, tentativePoints, onScorePick, isMobile}) {
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
    let children = (<><div key="scoreboard-heading" className="flex flex-row gap-x-4">
                <Heading size={2}>{gameState.currentPlayerName}'s poäng</Heading>
                <ScoreBoardBadge size="big" points={currentPlayerTotalPoints} isPickable={false} />
            </div>
            <div key="scoreboard-body" className="grid grid-cols-2 xl:grid-cols-2 xl:grid-flow-col grid-rows-5">
                {scoreElements}
        </div></>)
    // Rendera olika layout för dator och mobil.
    if (!isMobile) {
        return <div className="hidden lg:block">
            {children}
        </div>
    }
    else { // På mobil ska poänglistan bara visas om man väljer poäng.
        return isPickingScore ? <Container children={children} classes={["visible", "md:hidden", "z-40", "absolute", "top-12", "m-12", "bg-none"]}
            width="w-auto" height="h-screen" title={null}/> : null
    }
}
ScoreBoard.defaultProps = {
    isMobile: false
}