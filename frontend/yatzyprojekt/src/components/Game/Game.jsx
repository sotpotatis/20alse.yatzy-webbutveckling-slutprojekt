import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "../../components/Container";
import ErrorContainer from "../../components/ErrorContainer";
import DiceWrapper from "./DiceWrapper";
import ScoreBoardWrapper from "./ScoreboardWrapper";
import PlayerWrapper from "./PlayerWrapper";
import {
  calculateAllPoints,
  possibleDiceStates,
} from "20alse-yatzy-shared-code";
import LoadingSpinner from "../../components/LoadingSpinner";
import { SocketContext } from "../../context/socket.js";
import LocalGameStateHandler from "../../lib/localGameStateHandler.js";
import MultiplayerGameStateHandler from "../../lib/multiplayerGameStateHandler.js";
import WinScreen from "./WinScreen";
import ServerOperationSpinner from "./ServerOperationSpinner";
/* GamePage.jsx
Innehåller själva spelet. */
export default function Game() {
  // Variabler som hanterar status i själva spelet
  // currentGameState är ett JSON-objekt med aktuell spelstatus som följer ett visst format.
  // Om spelet körs i multiplayerläge hämtas denna status från en server, annars skapas denna status i webbläsaren.
  // Statusen är ett objekt med massa info.
  const socket = useContext(SocketContext);
  // Om spelet är i multiplayerläge eller inte sätts med URL-parametern ?mode. Hämta detta nedan.
  const [searchParams, setSearchParams] = useSearchParams();
  const gameMode = searchParams.get("mode") || "local";
  // Om vi är i multiplayerläge så kommer vi att ha spelets ID som en URL-parameter.
  const gameCode = searchParams.get("gameCode") || null;
  // Antalet spelare kan sättas via URL:en om vi kör singleplayer.
  const numberOfPlayers =
    gameMode === "local" ? searchParams.get("numberOfPlayers") || 2 : null;
  const [tentativePoints, setTentativePoints] = useState(null); // Spara preliminära poäng
  // Spåra om saker och ting laddas
  const [isLoading, setLoading] = useState(false); // Vi behöver ladda lite saker om vi har multiplayer
  const [isSmallLoading, setSmallLoading] = useState(false); // Vi behöver ladda lite saker om vi har multiplayer
  const [currentGameState, setCurrentGameState] = useState(null);
  const [player, setPlayer] = useState(null); // Information om den användaren som spelar spelet.
  // Spåra felmeddelande
  const [errorMessage, setErrorMessage] = useState(null);
  const [connectionPending, setConnectionPending] = useState(
    gameMode === "multiplayer" && !socket.connected
  );
  const checkIsConnected = () => {
    setConnectionPending(!socket.connected);
  };
  useEffect(() => {
    // Kolla efter uppkoppling 2 gånger per sekund med multiplayer
    if (gameMode === "multiplayer") {
      if (connectionPending) {
        setInterval(checkIsConnected, 500);
        setCurrentGameState(null);
        setPlayer(null);
      }
    }
  }, []);
  const [gameStateHandler, setGameStateHandler] = useState(
    gameMode !== "multiplayer"
      ? new LocalGameStateHandler(
          setCurrentGameState,
          setPlayer,
          setTentativePoints
        )
      : new MultiplayerGameStateHandler(
          setCurrentGameState,
          setPlayer,
          setTentativePoints,
          setLoading,
          setSmallLoading,
          setErrorMessage
        )
  ); // Initiera en hanterare för spelstatus om vi använder ett lokalt spel.
  // Validera URL-parametrar.
  if (gameMode === "multiplayer" && gameCode === null) {
    return (
      <ErrorContainer message="Du har inte angivit ett spel-ID. Om du inte skrivit in länken manuellt, kontakta hemsidesadministratören." />
    );
  } else if (gameMode !== "local" && gameMode !== "multiplayer") {
    return (
      <ErrorContainer message="Du har inte angivit ett spel-ID. Om du inte skrivit in länken manuellt, kontakta hemsidesadministratören." />
    );
  } else if (
    gameMode === "local" &&
    (Number.isNaN(numberOfPlayers) ||
      numberOfPlayers < 2 ||
      numberOfPlayers > 8)
  ) {
    return (
      <ErrorContainer message="Du har angivit ett otillåtet antal spelare (tillåtet intervall: mellan 2 och 8 spelare) Om du inte skrivit in länken manuellt, kontakta hemsidesadministratören." />
    );
  }
  if (
    (currentGameState === null || player === null) &&
    (!connectionPending || gameMode !== "multiplayer") &&
    errorMessage === null
  ) {
    // Detta händer vid spelet start: då ska vi hämta spelstatus
    if (gameMode === "multiplayer") {
      // Multiplayer: status ska hämtas från servern
      console.log("Prenumererar på event för multiplayer...");
      // Prenumerera på uppdateringar
      socket.on("gameUpdate", (response) => {
        console.log("Tog emot information om uppdaterad speldata: ", response);
        if (response.status === "success") {
          setCurrentGameState(response.gameData);
          // Uppdatera även användarens aktuella spelare.
          // TODO
        } else {
          console.warn("Fel! Ett fel inträffade under spelets gång.");
          setErrorMessage(response.errorMessage);
        }
      });
      socket.on("getMe", (response) => {
        console.log("Tog emot information om aktuell spelare: ", response);
        if (response.status === "success") {
          setPlayer(response.you);
        } else {
          console.warn("Fel! Ett fel inträffade när spelare skulle hämtas.");
          setErrorMessage(response.errorMessage);
        }
      });
      console.log("Prenumererat.");
      console.log("Efterfrågar uppdatering om spel...");
      socket.emit("getGameState", { gameCode: gameCode });
      console.log("Efterfrågar uppdatering om spelare...");
      socket.emit("getMe");
    } else {
      console.log("Skapar ursprunglig status för enspelarläge...");
      gameStateHandler.createInitialGameState(numberOfPlayers);
    }
  }
  // Rendera nu all information
  let children = []; // Element som ska renderas
  if (errorMessage !== null) {
    children.push(<ErrorContainer message={errorMessage} />); // Rendera ett felmeddelande om vi har det.
  } else if (connectionPending) {
    // Om vi inte är anslutna till servern, visa ett meddelande
    children.push(
      <LoadingSpinner text={"Ansluter till servern..."} fullPage={true} />
    );
  } else if (currentGameState === null || player === null || isLoading) {
    // Om vi laddar saker (händer endast på multiplayer), visa ett meddelande
    children.push(
      <LoadingSpinner text={"Kontaktar servern..."} fullPage={true} />
    );
  } else if (
    currentGameState.initialized !== undefined &&
    !currentGameState.initialized
  ) {
    // initialized används av servern
    children.push(
      <LoadingSpinner
        text={"Väntar på att servern ska starta spelet..."}
        fullPage={true}
      />
    );
  } else if (currentGameState.completed) {
    // Om spelets har avslutats
    console.log("Spelet har avslutats. Visar resultatskärm...");
    children.push(<WinScreen gameState={currentGameState} player={player} />);
  } // Om vi fortfarande ska köra spelet
  else {
    console.log("Renderar spel...");
    // Skapa lite funktioner för när man klickar på olika knappar.
    // Funktioner är olika baserade på om användaren spelar i enspelarläge eller flerspelarläge
    let doneFunction = null;
    let reRollFunction = null;
    let scorePickingFunction = null;
    let lockFunction = null;
    if (gameMode === "multiplayer") {
      reRollFunction = () => {
        gameStateHandler.rollDices({ ...currentGameState }, socket);
      };
      doneFunction = () => {
        gameStateHandler.onDoneButtonClick({ ...currentGameState }, socket);
      };
      scorePickingFunction = (scoreId) => {
        console.log(`Plockar poäng ${scoreId}`);
        gameStateHandler.onScorePick({ ...currentGameState }, scoreId, socket);
      };
      lockFunction = (diceIndex) => {
        gameStateHandler.onDiceLocked(
          { ...currentGameState },
          diceIndex,
          socket
        );
      };
    } else {
      reRollFunction = () => {
        gameStateHandler.onReRollButtonClick({ ...currentGameState });
      };
      doneFunction = () => {
        gameStateHandler.onDoneButtonClick({ ...currentGameState });
      };
      lockFunction = (diceIndex) => {
        gameStateHandler.onDiceLocked({ ...currentGameState }, diceIndex);
      };
      scorePickingFunction = (scoreId) => {
        console.log(`Plockar poäng "${scoreId}"...`);
        let newGameState = { ...currentGameState };
        // Hitta den aktuella spelaren och uppdatera dens poäng
        for (let i = 0; i < currentGameState.players.length; i++) {
          const player = currentGameState.players[i];
          if (player.name === currentGameState.currentPlayerName) {
            const score = {
              scoreType: scoreId,
              points: tentativePoints[scoreId].value,
            };
            newGameState.players[i].scores.push(score);
          }
        }
        newGameState.isPickingScore = false;
        setCurrentGameState(newGameState);
        gameStateHandler.prepareGameForNextPlayer(currentGameState, player);
      };
    }
    children.push(
      <div className="grid grid-cols-1 lg:grid-cols-5 w-screen">
        <DiceWrapper
          diceStates={currentGameState.dices}
          gameState={currentGameState}
          setGameState={setCurrentGameState}
          isClaimedBy={{
            name: currentGameState.currentPlayerName,
            me: currentGameState.currentPlayerName === player.name,
          }}
          isSmallLoading={isSmallLoading}
          onReRollButtonClick={reRollFunction}
          onDoneButtonClick={doneFunction}
          onDiceLocked={lockFunction}
        />
        <ScoreBoardWrapper
          gameState={currentGameState}
          setGameState={setCurrentGameState}
          isMultiplayer={gameMode === "multiplayer"}
          player={player}
          tentativePoints={tentativePoints}
          onScorePick={scorePickingFunction}
        />
      </div>
    );
  }
  if (isSmallLoading) {
    // Lägg till liten loading spinner
    children.push(<ServerOperationSpinner />);
  }
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
