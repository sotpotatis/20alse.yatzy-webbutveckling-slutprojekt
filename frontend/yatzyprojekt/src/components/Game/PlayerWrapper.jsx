import Heading from "../Heading";
import Player from "../Player/Player";
import { createRef, useEffect, useState } from "react";
import { findDOMNode } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
/* PlayerWrapper.jsx
En behållare för spelare som är med i spelet. */
export default function PlayerWrapper({ gameState, player }) {
  const players = gameState.players;
  const currentPlayerName = gameState.currentPlayerName;
  const playerName = player.name;
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  // Skapa spelarelement (element för varje spelare i spelet)
  let playerElements = [];
  let activePlayerNumber = null;
  let activePlayerIndex = null;
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    // Beräkna spelarens totala poäng.
    let playerTotalScore = 0;
    for (const score of player.scores) {
      playerTotalScore += score.points;
    }
    const playerKey = `player-${player.name}`;
    const isCurrentTurn = player.name === currentPlayerName;
    let playerElement = (
      <Player
        index={i + 1}
        id={playerKey}
        key={playerKey}
        type="compact"
        name={player.name}
        score={playerTotalScore}
        isMe={player.name === playerName}
        isCurrentTurn={isCurrentTurn}
      />
    );
    playerElements.push(playerElement);
    if (isCurrentTurn) {
      activePlayerIndex = i;
      activePlayerNumber = i + 1;
    }
  }
  // Visa max tre spelare i taget i menyn
  let playerElementsToShow = [];
  if (playerElements.length > 3){
    if (activePlayerIndex + 3 < playerElements.length - 1) {
      playerElementsToShow = playerElements.slice(
        activePlayerIndex,
        activePlayerIndex + 3
      );
    } else {
      const overflow = activePlayerIndex + 3 - playerElements.length;
      playerElementsToShow = playerElements.slice(
        activePlayerIndex,
        playerElements.length
      );
      playerElementsToShow.push(...playerElements.slice(0, overflow));
    }
    }
  else {
    playerElementsToShow = playerElements
  }
  return (
    <div className="p-3 overflow-auto">
      <div className="pt-3 " key="players">
        {playerElementsToShow}
      </div>
    </div>
  );
}
