import Badge from "../Badge";
import Heading from "../Heading";

/* Player.jsx
Renderar information om en spelare i spelet. */
// Det finns några olika stilar som en spelare kan ha.
// 1. card - renderas som ett kort, lämpligt för att visa i t.ex. en lobby
// 2. compact - renderas utan bakgrund, lämplig för att visa i t.ex. en lista
// Klasser för de två stilarna finns nedan.
function PlayerCard({ playerName, playerScore }) {
    return <div className="bg-white border-2 border-gray-300 p-3 rounded-lg">
        <Heading size={3}>{playerName}</Heading>
        <Badge text={playerScore + "p"}/>
    </div>
}
function PlayerCompact({ playerName, playerScore }) {
    return <div className="p-3">
        <Heading size={3}>{playerName}</Heading>
        <Badge text={playerScore + "p"} />
        <hr className="border-2 border-gray-300"/>
    </div>
}
export default function Player({ playerName, playerScore, type }) {
    // Returnera den komponent som efterfrågas
    if (type === "card") {
        return <PlayerCard playerName={playerName} playerScore={playerScore}/>
    }
    else if (type === "compact") {
        return <PlayerCompact playerName={playerName} playerScore={playerScore}/>
    }
}