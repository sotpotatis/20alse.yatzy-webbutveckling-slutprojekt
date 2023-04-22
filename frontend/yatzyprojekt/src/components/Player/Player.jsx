import Badge from "../Badge";
import Heading from "../Heading";

/* Player.jsx
Renderar information om en spelare i spelet. */
// Det finns några olika stilar som en spelare kan ha.
// 1. card - renderas som ett kort, lämpligt för att visa i t.ex. en lobby
// 2. compact - renderas utan bakgrund, lämplig för att visa i t.ex. en lista
// Klasser för de två stilarna finns nedan.
function PlayerCard({ name, score, isMe }) {
    let children = [<Heading size={3}>{name}</Heading>]
    if (score !== null){
        children.push(<Badge text={score + "p"}/>)
    }
    if (isMe){
        children.push(<p className="text-gray-600 italic">Du</p>)
    }
    return <div key={`player-${name}`} className="bg-white border-2 border-gray-300 p-3 rounded-lg text-black">
        {children}
    </div>
}
function PlayerCompact({ name, score, isMe }) {
    return <div className="p-3 text-black">
        <Heading size={3}>{name}</Heading>
        <Badge text={score + "p"} />
        <hr className="border-2 border-gray-300"/>
    </div>
}
export default function Player({ name, score, type, isMe }) {
    // Returnera den komponent som efterfrågas
    if (type === "card") {
        return <PlayerCard name={name} score={score} isMe={isMe}/>
    }
    else if (type === "compact") {
        return <PlayerCompact name={name} score={score} isMe={isMe}/>
    }
}
Player.defaultProps = {
    type: "card",
    score: null,
    isMe: false
}