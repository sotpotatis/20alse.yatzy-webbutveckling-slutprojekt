import Heading from "../Heading";
import ScoreBoardBadge from "./ScoreboardBadge";

/* ScoreboardScore.jsx
Visar poäng för en kategori i poängtabellen, t.ex. "Ettor" och "Yatzy". */
export default function ScoreBoardScore({title, score}) {
    return <div key={`score-title`} className="flex flex-row items-center text-center gap-x-2">
        <Heading size={4}>{title}</Heading>
        <ScoreBoardBadge score={score}/>
    </div>
}