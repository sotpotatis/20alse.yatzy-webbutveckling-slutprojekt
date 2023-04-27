/* Scoreboard.jsx
Visar den enskilda spelarens poäng. */
import Heading from "../Heading"
import ScoreBoardBadge from "./ScoreboardBadge"
import ScoreBoardScore from "./ScoreboardScore"
export default function ScoreBoard({ scores }) {
    return <div className="p-3">
        <div key="scoreboard-heading" className="flex flex-row gap-x-4">
            <Heading size={2}>Dina poäng</Heading>
            <ScoreBoardBadge size="big" points={2} />
        </div>
        <div key="scoreboard-body" className="grid grid-cols-2 grid-flow-col grid-rows-6">
            <ScoreBoardScore title="Ettor" score={5} />
            <ScoreBoardScore title="Tvåor" score={5}/>
            <ScoreBoardScore title="Treor" score={5}/>
            <ScoreBoardScore title="Fyror" score={5}/>
            <ScoreBoardScore title="Femmor" score={5} />
            <ScoreBoardScore title="Stege" score={5}/>
            <ScoreBoardScore title="Kåk" score={5}/>
            <ScoreBoardScore title="Yatzy" score={5}/>
        </div>
    </div>
}