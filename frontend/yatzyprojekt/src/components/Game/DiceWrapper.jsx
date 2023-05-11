import Button from "../Button";
import Dice from "./Dice";
import Heading from "../Heading.jsx";
import { useState } from "react";
import { Helmet } from "react-helmet";

/* DiceWrapper.jsx
Renderar en "behållare" som innehåller tärningar. */
export default function DiceWrapper({
  gameState,
  setGameState,
  isClaimedBy,
  onReRollButtonClick,
  onDoneButtonClick,
  onDiceLocked,
  isSmallLoading,
}) {
  let children = [];
  // Generera element för varje tärning
  let dices = [];
  for (let i = 0; i < gameState.dices.length; i++) {
    const diceData = gameState.dices[i];
    const isLocked = diceData.saved;
    // Skapa en funktion för när användaren låser tärningen
    dices.push(
      <Dice
        key={`dice-${i}`}
        activeSide={diceData.number}
        isLocked={isLocked}
        onLocked={() => {
          onDiceLocked(i);
        }}
      />
    );
  }
  // Lägg till alla tärningar
  children.push(
    // Av responsivitietsskäl är tärningarna gömda när man väljer poäng på en mobil enhet.
    <div
      className={
        `col-span-3 py-20 md:py-12 px-8 text-white` +
        (gameState.isPickingScore ? " hidden md:block" : "")
      }
      key="dices-page"
    >
      <div
        key="dices-wrapper"
        className="grid grid-cols-3 md:grid-cols-5 gap-x-12 gap-y-12"
      >
        {dices}
      </div>
      <div
        key="buttons"
        className="flex flex-row gap-x-12 pt-12 w-full justify-center"
      >
        <Heading size={3} className="py-12">
          Tur{" "}
          {gameState.currentTurnNumber !== null
            ? gameState.currentTurnNumber
            : "-"}
          /3
        </Heading>
        <Button
          color="green"
          text="Slå"
          icon="ooui:reload"
          onClick={onReRollButtonClick}
          disabled={
            gameState.isPickingScore ||
            gameState.currentTurnNumber >= 3 ||
            isSmallLoading
          }
        />
        <Button
          color="red"
          text="Avsluta"
          icon="majesticons:close-line"
          onClick={onDoneButtonClick}
          disabled={
            gameState.isPickingScore ||
            gameState.currentTurnNumber === 0 ||
            isSmallLoading
          }
        />
      </div>
    </div>
  );
  // Om isClaimedBy.isMe är false kan inte användarens webbläsare klicka på tärningarna eftersom någon annan
  // håller på att rulla de. Detta används för multiplayer-läget.
  // Och om användaren håller på att välja en poäng ska man inte heller kunna klicka på tärningarna.
  if (!isClaimedBy.me || gameState.isPickingScore) {
    children.push(
      <div
        key="message"
        className="absolute top-0 h-screen w-screen z-10 bg-gray-500 opacity-50 hover:cursor-disabled"
      ></div>
    );
  }
  return children;
}
DiceWrapper.defaultProps = {
  isClaimedBy: {
    isMe: true,
    name: null,
  },
};
