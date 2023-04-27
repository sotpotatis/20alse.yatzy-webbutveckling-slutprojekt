import ScoreBoard from "./Scoreboard";
import PlayerWrapper from "./PlayerWrapper";
import { useState } from "react";
import ScoreboardExpandButton from "./ScoreboardExpandButton";
/* ScoreBoardWrapper.jsx
Innehåller poängtabellerna samt information om andra spelare. */
export default function ScoreBoardWrapper() {
    const [isCollapsed, setCollapsed] = useState(true) // Möjliggör att man kan gömma sidebaren
        let children = [<ScoreboardExpandButton isCollapsed={isCollapsed} setCollapsed={setCollapsed}/>]
    if (isCollapsed) {
        children.push(<div className="col-span-2 bg-white border-4 ml-3 border-gray-200 p-3 rounded-lg h-full min-h-full max-h-screen overflow-scroll">
            <ScoreBoard />
        <PlayerWrapper />
    </div>)
    }
    return <>{children}</>
}