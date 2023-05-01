import Heading from "../Heading";
import ScoreBoardBadge from "./ScoreboardBadge";

/* ScoreboardScore.jsx
Visar poäng för en kategori i poängtabellen, t.ex. "Ettor" och "Yatzy". */
export default function ScoreBoardScore({title, points, pickMode, hasBeenPicked, onPick}) {
    let conditionalClasses = "" // Applicera klasserat baserat på om poängen just nu håller på att väljas eller inte
    if (pickMode){ // Om användaren ska välja poäng i scoreboarden
        conditionalClasses += !hasBeenPicked ? "" : " hover:cursor-not-allowed"
    }
    return <div key={`score-title`} className={`flex flex-row justify-between border-b-2 px-3 py-3 border-gray-200 text-center gap-x-2 ${conditionalClasses}`}>
        <Heading size={4}>{title}</Heading>
        <ScoreBoardBadge points={points} picked={hasBeenPicked} picking={pickMode} onClick={onPick} isPickable={true}/>
    </div>
}