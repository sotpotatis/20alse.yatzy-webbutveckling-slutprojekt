import Heading from "../Heading";
import Player from "../Player/Player";
/* PlayerWrapper.jsx
En behållare för spelare som är med i spelet. */
export default function PlayerWrapper({players, currentPlayerName, playerName}) {
    // Skapa spelarelement (element för varje spelare i spelet)
    let playerElements = []
    for (const player of players){
        playerElements.push(
            <Player type="compact" name={player.name} score={4} isMe={player.name === playerName}
            isCurrentTurn={player.name === currentPlayerName}/>
        )
    }
    return <div className="p-3">
        <Heading size={2}>Spelare</Heading>
        <div className="pt-3" key="players">
            {playerElements}
        </div>
    </div>
}