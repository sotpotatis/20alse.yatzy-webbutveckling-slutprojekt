/* ScoreboardBadge.jsx
För att visa poäng i scoreboardet använder jag ett badge-liknande
element. */
export default function ScoreBoardBadge({
    textSize, points
}) {
    // Det finns två textstorlekar: big och normal. Avgör vilken klass som ska användas.
    const textSizeClass = textSize === "big" ? "text-xl": "text-lg"
    return <span className={`${textSizeClass} bg-sky-400 rounded-lg border-2 border-sky-400 px-3 font-bold`}>
        {points}p
    </span>
    
}
ScoreBoardBadge.defaultProps = {
    textSize: "normal",
    points: 0
}