import ScoreBoard from "./Scoreboard";
import PlayerWrapper from "./PlayerWrapper";
import { useState } from "react";
import ScoreboardExpandButton from "./ScoreboardExpandButton";
import Heading from "../Heading.jsx";
/* ScoreBoardWrapper.jsx
Innehåller poängtabellerna samt information om andra spelare. */
export default function ScoreBoardWrapper({gameState, setGameState, player, isMultiplayer, tentativePoints, onScorePick}) {
    const [isCollapsed, setCollapsed] = useState(true) // Möjliggör att man kan gömma sidebaren
        let children = [<ScoreboardExpandButton isCollapsed={isCollapsed} setCollapsed={setCollapsed}/>]
    if (isCollapsed) {
        children.push(<div className="col-span-2 bg-white border-4 ml-3 border-gray-200 p-3 rounded-lg h-screen min-h-full max-h-full z-20 flex flex-col overflow-hidden">
            <ScoreBoard tentativePoints={tentativePoints} gameState={gameState} setGameState={setGameState} player={player} isMultiplayer={isMultiplayer} onScorePick={onScorePick}/>
            <Heading size={2} additionalClasses="pl-3">Spelare</Heading>
            <PlayerWrapper players={gameState.players} currentPlayerName={gameState.currentPlayerName} playerName={player.name}/>
    </div>)
    }
    return <>{children}</>
}