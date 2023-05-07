import Badge from "../Badge";
import colors from "tailwindcss/colors.js";

/* ScoreboardBadge.jsx
För att visa poäng i scoreboardet använder jag ett badge-liknande
element. */
export default function ScoreBoardBadge({
  textSize,
  points,
  picked,
  picking,
  isPickable,
  onClick,
}) {
  // Det finns två textstorlekar: big och normal. Avgör vilken klass som ska användas.
  const textSizeClass = textSize === "big" ? "text-xl" : "text-lg";
  let otherClases = "";
  let badgeColor = "";
  // Avgör också vilka färger.
  if (isPickable) {
    if (picking) {
      if (picked) {
        otherClases += "hover:cursor-not-allowed line-through";
        badgeColor = "gray";
      } else {
        otherClases += "hover:cursor-pointer";
        badgeColor = "green";
      }
    } else {
      badgeColor = picked ? "blue" : "gray";
    }
  } else {
    // Om "badgen" inte är involverat i poängplocking ska den alltid vara blå.
    badgeColor = "blue";
  }
  return (
    <Badge
      text={`${points}p`}
      additionalClasses={textSizeClass + " " + otherClases}
      color={badgeColor}
      onClick={onClick}
    />
  );
}
ScoreBoardBadge.defaultProps = {
  textSize: "normal",
  points: 0,
  picked: false,
  picking: false,
  isPickable: false,
  onClick: null,
};
