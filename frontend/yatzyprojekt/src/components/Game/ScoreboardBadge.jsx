import Badge from "../Badge"

/* ScoreboardBadge.jsx
För att visa poäng i scoreboardet använder jag ett badge-liknande
element. */
export default function ScoreBoardBadge({
    textSize, points
}) {
    // Det finns två textstorlekar: big och normal. Avgör vilken klass som ska användas.
    const textSizeClass = textSize === "big" ? "text-xl": "text-lg"
    return <Badge text={`${points}p`} additionalClasses={textSizeClass}/>
    
}
ScoreBoardBadge.defaultProps = {
    textSize: "normal",
    points: 0
}