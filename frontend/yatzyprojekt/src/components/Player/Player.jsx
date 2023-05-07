import Badge from "../Badge";
import ScoreBoardBadge from "../Game/ScoreboardBadge";
import Heading from "../Heading";
import Avatar from "./Avatar";

/* Player.jsx
Renderar information om en spelare i spelet. */
// Det finns några olika stilar som en spelare kan ha.
// 1. card - renderas som ett kort, lämpligt för att visa i t.ex. en lobby
// 2. compact - renderas utan bakgrund, lämplig för att visa i t.ex. en lista
// Klasser för de två stilarna finns nedan.
function PlayerCard({ name, score, isMe, isCurrentTurn }) {
  let children = [<Heading size={3}>{name}</Heading>];
  if (score !== null) {
    children.push(<Badge text={score + "p"} />);
  }
  if (isMe) {
    children.push(<p className="text-gray-600 italic">Du</p>);
  }
  return (
    <div
      key={`player-${name}`}
      className="bg-white border-2 border-gray-300 p-3 rounded-lg text-black"
    >
      {children}
    </div>
  );
}
function PlayerCompact({ name, index, score, isMe, isCurrentTurn }) {
  // Vi vill ha fyra delar med info:
  // 1: avataren
  // 2: användarens poäng
  // 3: om användaren är du eller inte
  // 4: om användaren just nu kastar tärniningar
  let nameElements = [
    <Heading size={3}>{name}</Heading>,
    <ScoreBoardBadge points={score} />,
  ];
  // Lägg till information om spelaren är "du" (den som använder sidan eller inte)
  if (isMe) {
    nameElements.push(<Badge color="green" text="Du" />);
  }
  // Indikera ifall det är den aktuella spelarens tur
  return (
    <>
      <a name={`player-${index}`} />
      <div
        className={
          `flex flex-row flex-wrap p-3 rounded-lg` +
          (isCurrentTurn ? " bg-green-600 text-white" : " text-black")
        }
      >
        <Avatar playerName={name} />
        <div className="p-3 flex flex-row gap-x-3">{nameElements}</div>
      </div>
      <hr className="border-2 border-gray-300 my-3" />
    </>
  );
}
export default function Player({
  name,
  index,
  score,
  type,
  isMe,
  isCurrentTurn,
}) {
  // Returnera den komponent som efterfrågas
  if (type === "card") {
    return (
      <PlayerCard
        name={name}
        score={score}
        isMe={isMe}
        isCurrentTurn={isCurrentTurn}
      />
    );
  } else if (type === "compact") {
    return (
      <PlayerCompact
        name={name}
        score={score}
        isMe={isMe}
        index={index}
        isCurrentTurn={isCurrentTurn}
      />
    );
  }
}
Player.defaultProps = {
  type: "card",
  score: null,
  isMe: true,
  isCurrentTurn: true,
};
