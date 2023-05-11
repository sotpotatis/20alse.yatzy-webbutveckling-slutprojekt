/* MultiplayerGameStateHandler.js
Precos som localGameStateHandler är detta en hanterare för spelstatus,
men för flerspelarläget istället. */
import { bindFunctions } from "./localGameStateHandler.js";

export default class MultiplayerGameStateHandler {
  constructor(
    setCurrentGameState,
    setPlayer,
    setTentativePoints,
    setLoading,
    setSmallLoading,
    setErrorMessage
  ) {
    this.setCurrentGameState = setCurrentGameState;
    this.setPlayer = setPlayer;
    this.setTentativePoints = setTentativePoints;
    this.setErrorMessage = setErrorMessage;
    this.setLoading = setLoading;
    this.setSmallLoading = setSmallLoading;
    const functions = [
      "responseHandler",
      "rollDices",
      "onDoneButtonClick",
      "onScorePick",
    ];
    bindFunctions(functions, this); // Binda alla funktioner, se kommentar i bindFunctions för mer info
  }
  /**
   * Felhanterare som kollar ifall ett fel uppstod i ett socket-svar.
   * @param socketResponse Svaret från socket.
   * @param onSuccess En funktion som ska köras ifall förfrågan lyckades
   */
  responseHandler(socketResponse, onSuccess = null) {
    console.log("Tog emot serversvar:", socketResponse);
    if (socketResponse.status === "error") {
      console.warn(`Tog emot ett fel från servern: ${socketResponse.message}`);
      this.setErrorMessage(socketResponse.errorMessage);
    }
    // Kör en callback-funktion om någon
    if (onSuccess !== null) {
      onSuccess(socketResponse);
      if (socketResponse.gameState !== undefined) {
        // Om serversvaret innehåller ett gameState, uppdatera
        this.setCurrentGameState(socketResponse.gameState);
      }
    }
  }
  rollDices(gameState, socket) {
    console.log("Skickar meddelade om att kasta tärningar...");
    socket.on("rollDice", (response) => {
      this.responseHandler(response, () => {
        console.log(
          "Tog emot uppdaterad tärningsstatus från servern",
          response
        );
        this.setSmallLoading(false);
      });
    });
    socket.emit("rollDice", { gameCode: gameState.gameCode });
    console.log('Meddelande "emittat".');
    this.setSmallLoading(true);
  }
  onDoneButtonClick(gameState, socket) {
    console.log("Hämtar möjliga poäng...");
    // Beräkna nummer
    socket.on("possibleScores", (response) => {
      this.responseHandler(response, () => {
        console.log("Tog emot poäng från servern", response);
        this.setTentativePoints(response.result);
        this.setSmallLoading(false);
      });
    });
    this.setSmallLoading(true);
    socket.emit("possibleScores", { gameCode: gameState.gameCode });
  }
  onScorePick(gameState, scoreId, socket) {
    console.log(`Plockar poäng ${scoreId}...`);
    socket.on("pickScore", (response) => {
      this.responseHandler(response, () => {
        if (response.message === "Poängen har uppdaterats.") {
          console.log("Poäng har plockats!");
          this.setSmallLoading(false);
        } else {
          console.warn(
            `Oväntat svar mottaget från servern: ${response.message}`
          );
          this.setErrorMessage(
            "Oväntat serversvar mottaget. Vänligen försök spela igen senare."
          );
        }
      });
    });
    this.setSmallLoading(true);
    socket.emit("pickScore", {
      requestedScoreType: scoreId,
      gameCode: gameState.gameCode,
    });
  }
  onDiceLocked(gameState, diceIndex, socket) {
    if (gameState.dices[diceIndex].number !== "empty") {
      console.log(`"Togglar" en tärning...`);
      socket.on("toggleDice", (response) => {
        this.responseHandler(response, () => {
          console.log("Tärningen har låsts/låsts upp!");
          this.setSmallLoading(false);
        });
      });
      this.setSmallLoading(true);
      socket.emit("toggleDice", {
        diceIndex: diceIndex,
        gameCode: gameState.gameCode,
      });
    }
  }
}
