/* Scoreboard.jsx
Visar den enskilda spelarens poäng. */
import Heading from "../Heading"
import ScoreBoardBadge from "./ScoreboardBadge"
import ScoreBoardScore from "./ScoreboardScore"
import { calculateAllPoints, possibleDiceStates } from "yatzy-shared-code";

export default function ScoreBoard({ gameState }) {
    let scoreElements = [] // Rendera element för varje poäng
    for (const scoreId of Object.keys(possibleDiceStates)) {
        let score = 5 // TODO: Hämta poäng från gameState här.
        const title = possibleDiceStates[scoreId].information.title // Hämta namnet på poängen
        scoreElements.push(
            <ScoreBoardScore title={title} score={score} />
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