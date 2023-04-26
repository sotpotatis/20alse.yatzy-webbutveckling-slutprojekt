/* Scoreboard.jsx
Visar den enskilda spelarens poäng. */
import Heading from "../Heading"
import ScoreBoardBadge from "./ScoreboardBadge"
export default function ScoreBoard({scores}){
    return <div className="p-3">
        <div key="scoreboard-heading" className="flex flex-row gap-x-4">
            <Heading size={2}>Dina poäng</Heading>
            <ScoreBoardBadge size="big" points={2} />
        </div>
    </div>
}