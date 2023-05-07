import ScoreBoard from "./Scoreboard";
import PlayerWrapper from "./PlayerWrapper";
import { useState } from "react";
import ScoreboardExpandButton from "./ScoreboardExpandButton";
import Heading from "../Heading.jsx";
/* ScoreBoardWrapper.jsx
Innehåller poängtabellerna samt information om andra spelare. */
export default function ScoreBoardWrapper({
  gameState,
  setGameState,
  player,
  isMultiplayer,
  tentativePoints,
  onScorePick,
}) {
  const [isCollapsed, setCollapsed] = useState(true); // Möjliggör att man kan gömma sidebaren
  let children = [
    <ScoreboardExpandButton
      isCollapsed={isCollapsed}
      setCollapsed={setCollapsed}
    />,
  ];
  if (isCollapsed) {
    children.push(
      <div
        className={
          "col-span-2 bg-white border-4 ml-3 border-gray-200 p-3 h-min lg:h-screen rounded-lg z-20 flex flex-col shrink-0 overflow-hidden"
        }
      >
        <div className={!gameState.isPickingScore ? " hidden md:block" : ""}>
          <ScoreBoard
            tentativePoints={tentativePoints}
            gameState={gameState}
            setGameState={setGameState}
            player={player}
            isMultiplayer={isMultiplayer}
            onScorePick={onScorePick}
          />
        </div>
        <div className={gameState.isPickingScore ? " hidden md:block" : ""}>
          <Heading size={2} additionalClasses="pl-3">
            Spelare
          </Heading>
          <PlayerWrapper gameState={gameState} player={player} />
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
