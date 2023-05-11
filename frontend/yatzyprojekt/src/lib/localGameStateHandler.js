/* localGameStateHandler.js
Det finns ett lokalt spelarläge. Här definierar vi de olika funktionerna för det. */
import {
  calculateAllPoints,
  possibleDiceStates,
} from "20alse-yatzy-shared-code";
// Tärningsstatus för 6st tomma tärningar.
const emptyDices = [
  { saved: false, number: "empty" },
  { saved: false, number: "empty" },
  { saved: false, number: "empty" },
  { saved: false, number: "empty" },
  { saved: false, number: "empty" },
];
/**
 * Genererar ett slumpmässigt nummer mellan två tal.
 * @param start Lägsta möjliga numret som ska genereras.
 * @param end Högsta möjliga numret som ska genereras.
 */
function randomNumber(start, end) {
  return ~~(Math.random() * (end - start + 1)) + start; // (~~ är snabbare än Math.floor, se https://stackoverflow.com/a/50189413)
}
/** JavaScript har ju den roliga saken att för att komma åt this i varje funktion
/* måste man ha kört .bind(this) i funktionen...
/* Här gör jag det lite enklare för mig att hålla koll på saker och ting
/* genom att binda alla funktioner med en for-loop.
 @param functions En lista av funktioner att "binda"
 @param thisValue Värdet av this.
*/
export function bindFunctions(functions, thisValue) {
  for (const functionToBind of functions) {
    thisValue[functionToBind] = thisValue[functionToBind].bind(thisValue);
  }
}
export default class LocalGameStateHandler {
  constructor(setGameState, setCurrentPlayer, setTentativePoints) {
    this.setGameState = setGameState;
    this.setCurrentPlayer = setCurrentPlayer;
    this.setTentativePoints = setTentativePoints;
    const functions = [
      "announceNewGameState",
      "announceNewCurrentPlayer",
      "generateDice",
      "generateDices",
      "prepareGameForNextPlayer",
      "createInitialGameState",
      "onDoneButtonClick",
      "onReRollButtonClick",
      "onDiceLocked",
      "checkWin",
      "onScoreClaim",
    ];
    bindFunctions(functions, this); // Binda alla funktioner, se kommentar i bindFunctions för mer info
  }
  announceNewGameState(gameState) {
    this.setGameState(gameState);
  }
  announceNewCurrentPlayer(currentPlayer) {
    this.setCurrentPlayer(currentPlayer);
  }
  generateDice() {
    return {
      number: randomNumber(1, 6),
      saved: false,
    };
  }
  generateDices() {
    let newDices = [];
    for (let i = 0; i < 5; i++) {
      newDices.push(this.generateDice());
    }
    return newDices;
  }
  prepareGameForNextPlayer(gameState, player) {
    // Kolla om den aktuella spelaren är den sista spelaren
    let currentPlayerIndex;
    for (
      currentPlayerIndex = 0;
      currentPlayerIndex < gameState.players.length;
      currentPlayerIndex++
    ) {
      if (
        gameState.currentPlayerName ===
        gameState.players[currentPlayerIndex].name
      ) {
        // Om den aktuella spelaren hittades
        break;
      }
    }
    // Avgör nästa spelare. Om vi är sist i listan vill vi börja om från början
    const nextPlayer =
      currentPlayerIndex < gameState.players.length - 1
        ? gameState.players[currentPlayerIndex + 1]
        : gameState.players[0];
    gameState.currentPlayerName = nextPlayer.name;
    gameState.currentTurnNumber = 0;
    gameState.isPickingScore = false;
    gameState.dices = emptyDices; // Återställ tärningar
    if (this.checkWin(gameState)) {
      console.log("Vinnare av spelet har detekterats!");
      gameState.completed = true;
    }
    this.announceNewGameState(gameState);
    this.announceNewCurrentPlayer(nextPlayer);
    console.log("Spel förberett för nästa spelare.");
  }
  createInitialGameState(numberOfPlayers) {
    // Skapa spelare
    let players = [];
    for (
      let playerNumber = 1;
      playerNumber <= numberOfPlayers;
      playerNumber++
    ) {
      players.push({
        name: `Spelare ${playerNumber}`,
        isOnline: true,
        scores: [],
      });
    }
    let gameState = {
      gameCode: null,
      completed: false,
      currentPlayerName: players[0].name,
      dices: [],
      players: players,
      started: true,
      currentTurnNumber: 0,
      isPickingScore: false,
    };
    // Rensa tärningar
    gameState.dices = emptyDices;
    console.log("Skapat ursprunglig spelstatus: ", gameState);
    this.announceNewGameState(gameState);
    this.announceNewCurrentPlayer(players[0]);
  }
  onDoneButtonClick(gameState) {
    console.log("Beräknar poäng...");
    gameState.isPickingScore = true;
    // Beräkna poäng
    let diceNumbers = [];
    for (const dice of gameState.dices) {
      diceNumbers.push(dice.number);
    }
    const points = calculateAllPoints(diceNumbers);
    console.log("Beräknade poäng", points);
    this.setTentativePoints(points);
    this.announceNewGameState(gameState);
  }
  onReRollButtonClick(gameState) {
    if (gameState.currentTurnNumber <= 3) {
      // Kolla så att användaren får kasta tärningar
      console.log("Kastar om tärningar...");
      let newDices = [];
      for (const dice of gameState.dices) {
        let newDice = !dice.saved ? this.generateDice() : dice; // Skapa en ny tärning om den aktuella tärningen inte är låst.
        newDices.push(newDice);
      }
      gameState.dices = newDices;
      gameState.currentTurnNumber += 1;
      console.log("Tärningar har kastats om.");
      this.announceNewGameState(gameState);
      if (gameState.currentTurnNumber === 3) {
        this.onDoneButtonClick(gameState);
      }
    }
  }
  onDiceLocked(gameState, diceIndex) {
    if (gameState.dices[diceIndex].number !== "empty") {
      if (!gameState.dices[diceIndex].saved) {
        console.log(`Låser tärningsstatus för tärning ${diceIndex}...`);
        gameState.dices[diceIndex].saved = true;
      } else {
        console.log(`Låser upp tärningsstatus för tärning ${diceIndex}...`);
        gameState.dices[diceIndex].saved = false;
      }
      this.setGameState(gameState);
      console.log("Tärning låst.");
    }
  }
  checkWin(gameState) {
    for (const player of gameState.players) {
      // Användaren plockar poäng som allteftersom läggs till på deras player.scores lista.
      // Om denna lista är full för alla användare har spelaren vunnit spelet.
      if (!(player.scores.length === Object.keys(possibleDiceStates).length)) {
        return false;
      }
    }
    // Om vi kommer hit är listan full för alla användare
    return true;
  }
  onScoreClaim(gameState) {
    console.log("Användaren har valt en poäng.");
  }
}
