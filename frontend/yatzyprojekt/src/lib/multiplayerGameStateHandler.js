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
    setErrorMessage
  ) {
    this.setCurrentGameState = setCurrentGameState;
    this.setPlayer = setPlayer;
    this.setTentativePoints = setTentativePoints;
    this.setErrorMessage = setErrorMessage;
    this.setLoading = setLoading;
    const functions = [
      "errorHandler",
        "rollDices",
        "onDoneButtonClick",
        "onScorePick"
    ];
    bindFunctions(functions, this); // Binda alla funktioner, se kommentar i bindFunctions för mer info
  }
  /**
   * Felhanterare som kollar ifall ett fel uppstod i ett socket-svar.
   * @param socketResponse Svaret från socket.
   * @param onSuccess En funktion som ska köras ifall förfrågan lyckades
   */
  errorHandler(socketResponse, onSuccess = null) {
    console.log("Tog emot serversvar:", socketResponse);
    if (socketResponse.status === "error") {
      console.warn(`Tog emot ett fel från servern: ${socketResponse.message}`);
      this.setErrorMessage(socketResponse.errorMessage);
    }
    // Kör en callback-funktion om någon
    if (onSuccess !== null) {
      onSuccess(socketResponse);
    }
  }
  rollDices(socket) {
    console.log("Skickar meddelade om att kasta tärningar...");
    socket.on("diceRoll", (response)=>{
    this.errorHandler(response, ()=>{
      console.log("Tog emot uppdaterad tärningsstatus från servern", response)
      this.setLoading(false)
    })
    });
    socket.emit("diceRoll")
    this.setLoading(true)
  }
  onDoneButtonClick(gameState, socket) {
    console.log("Hämtar möjliga poäng...");
    // Beräkna nummer
    socket.on("possibleScores", (response) => {
      this.errorHandler(response, () => {
        console.log("Tog emot poäng från servern", response);
        this.setTentativePoints(response.result);
        this.setLoading(false);
      });
    });
    this.setLoading(true);
    socket.emit("possibleScores");
  }
  onScorePick(scoreId, socket) {
    console.log(`Plockar poäng ${scoreId}...`);
    socket.on("pickScore", (response) => {
      this.errorHandler(response, () => {
        if (response.message === "Poängen har uppdaterats.") {
          console.log("Poäng har plockats!");
          this.setLoading(false);
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
    this.setLoading(true);
    socket.emit("pickScore", { requestedScoreType: scoreId });
  }
}
