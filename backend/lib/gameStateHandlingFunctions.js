/* gameStateHandlingFunctions.js
Funktioner speciellt dedikerade till att hantera spelstatus. */
import {
  calculateAllPoints,
  possibleDiceStates,
} from "20alse-yatzy-shared-code";
// NU är det dags att börja köra själva spelet. Vi börjar alltså här.
// Skapa lite hjälpfunktioner
/**
 * Hämtar vilken spelare som står på tur härnäst
 * @return {*} Nästa spelare som ska spela
 */
function getNextPlayer() {
  console.log("Hittar nästa användare som ska spela...");
  let currentPlayerIndex = 0;
  for (
    currentPlayerIndex = 0;
    currentPlayerIndex < game.players.length;
    currentPlayerIndex++
  ) {
    const player = game.players[currentPlayerIndex];
    if (player.name === game.currentPlayerName) {
      break;
    }
  }
  // Hitta nästa spelare
  if (currentPlayerIndex < game.players.length - 1) {
    return game.players[currentPlayerIndex + 1];
  } else {
    // (om vi har kommit till slutet av listan vill vi börja om från början
    return game.players[0];
  }
}
// Väntar tills alla tärningar har uppdaterats och kallar sedan en funktion
/**
 * Möjliggör att uppdatera tärningar och vänta tills alla tärningars status har uppdaterats i databasen.
 * Inkluderar en timeout på 20 sekunder för alla uppdateringar.
 * @param dices En lista på alla tärningar som ska uppdateras
 * @param updateFunction En funktion som ska köras på varje tärning. Ska returnera tärningens uppdaterade status.
 * @param callback En callback som ska köras när alla tärningar har uppdaterats.
 * @param timeoutCallback En funktion som körs vid en timeout. Kan användas för att skicka info om ett fel uppstår.
 */
function waitForDiceUpdate(
  dices,
  updateFunction,
  callback,
  timeoutCallback = null
) {
  let numberOfDiceUpdated = 0; // Vi behöver en counter då funktionen kör async. Hade varit lite snyggare om jag gjort alla funktioner här async.
  // men det finns ju alltid något som kan förbättras.
  for (const dice of dices) {
    const updatedDice = updateFunction(dice); // updateFunction passas som argument och specificerar vad som ska uppdateras på tärningen
    updatedDice.save().then(() => {
      // Efter varje tärning uppdaterats, uppdatera nästa tärning.
      numberOfDiceUpdated += 1;
    });
  }
  // Vänta tills alla tärningar har uppdaterats och skicka sedan ett uppdaterat "gameState"
  console.log("Väntar tills alla tärningar har uppdaterats...");
  let secondsElapsed = 0;
  const interval = setInterval(() => {
    if (numberOfDiceUpdated < dices.length) {
      console.log(`Väntar fortfarande på tärningsuppdateringar...`);
      if (secondsElapsed > 20) {
        console.log("Timeout nådd. Skickar felmeddelande.");
        if (timeoutCallback !== null) {
          timeoutCallback();
        }
      }
    } else {
      clearInterval(interval); // Ta bort kontrollen och gå vidare
      callback();
    }
  }, 100); // Kolla var 0.1 sekund
}
/** Förbereder spelplanen för en ny spelare.
 * @param newPlayerName Spelarens nya namn.
 * @param callback En callback som ska köras när alla aktuella saker har uppdaterats i databasen.
 */
function prepareForPlayer(newPlayerName, callback) {
  console.log("Förbereder för en ny spelare...");
  game.currentPlayerName = newPlayerName; // Uppdatera den aktuella spelarens namn.
  game.currentTurnNumber = 0;
  game.save().then(() => {
    // Återställ varje tärning
    waitForDiceUpdate(
      game.dices,
      (dice) => {
        dice.saved = false;
        dice.number = "empty";
        return dice;
      },
      () => {
        console.log(
          "Alla tärningar har uppdaterats och spelet är nu redo för nästa spelare."
        );
        callback();
      }
    );
  });
}
/**Genererar slumpmässiga nummer på tärningarna i spelet
 * @param callback En funktion som ska köras efter att numrena genererats klart.
 * @param timeoutCallback En funktion som ska köras vid ett eventuellt fel
 */
function generateDiceNumbers(callback, timeoutCallback = null) {
  console.log("Genererar nummer på tärningarna....");
  waitForDiceUpdate(
    game.dices,
    (dice) => {
      dice.number = randomNumber(1, 6);
      return dice;
    },
    () => {
      console.log("Numret på alla tärningar har uppdaterats.");
      callback();
    },
    timeoutCallback
  );
}
/**
 * Uppdaterar poängen för den aktuella användaren som spelar spelet.
 * @param typeOfPoint Typen av poäng som användaren vill uppdatera. Till exempel "ettor" för att
 * uppdatera poängen för användarens ettor.
 * @param callback En funktion som ska köra när användarens poäng uppdaterats.
 */
function updateUserScore(typeOfPoint, callback) {
  console.log("Uppdaterar poäng för den aktuella användaren...");
  let diceNumbers = []; // Skapa en lista som endast innehåller tärningarnas nummer
  for (const dice of game.dices) {
    diceNumbers.push(dice.number);
  }
  // Kör funktion för att hitta poäng för alla tärningar
  const possiblePoints = calculateAllPoints(game.dices);
  // Kolla att användaren inte har plockat denna poäng innan
  findPlayerByName(
    models,
    game.currentPlayerName,
    [{ model: models.Score, as: "scores" }],
    (player) => {
      if (player !== null) {
        let previouslyClaimedScores = []; // Skapa en lista med alla tidigare scores som claimats.
        for (const score of player.scores) {
          previouslyClaimedScores.push(score.scoreType);
        }
        if (previouslyClaimedScores.includes(typeOfPoint)) {
          console.warn(
            `Den aktuella spelaren verkar redan ha plockat poängen ${typeOfPoint}.`
          );
          console.log("Spelplanen kommer inte att uppdateras.");
          callback();
        } else {
          console.log("Uppdaterar poäng...");
          const newScore = models.Score.build({
            scoreType: typeOfPoint,
            score: possiblePoints[typeOfPoint].value,
          });
          player.addScore(newScore).then(callback);
        }
      }
    }
  );
}
/**
 * Uppdaterar spelrundan.
 * @param {*} onScorePick Funktion som körs när användaren valt sin poäng.
 */
function updateRound(game, onScorePick) {
  console.log("Väljer ut en användare som ska spela...");
  const nextPlayer = getNextPlayer();
  console.log(`Nästa spelare: ${nextPlayer.name}.`);
  prepareForPlayer(nextPlayer.name, () => {
    console.log("Spelplanen har förberetts.");
    // Skicka uppdaterat gameState
    console.log("Skickar ett uppdaterat gameState...");
    sendGameStateUpdate(models, game.gameCode, socket);
    console.log("gameState uppdaterad.");
    // Applicera timeout ifall en spelare inte gör något på en minut
    const initialPlayerName = game.currentPlayerName;
    setTimeout(() => {
      if (game.currentPlayerName === initialPlayerName) {
        console.log(
          "Timeout uppnåddes: en spelare har inte gjort något på en minut. Kör kod"
        );
        onScorePick();
      }
    }, 60000);
  });
}
/**
 * Kollar om spelet har tagit slut
 */
function detectGameEnd() {
  for (const player of game.players) {
    if (player.scores.length !== Object.keys(possibleDiceStates).length) {
      // Om användaren inte plockat alla poäng än
      return false; // Returnera false.
    }
  }
  return true; // Om vi kommer hit så har spelet tagit slut!
}

const gameStateHandlers = {
  // Lyssna efter förfrågan att kasta tärningar
  rollDice: (message, socket, models) => {
    console.log("Tog emot en förfrågan att kasta en tärning.");
    generateDiceNumbers(
      () => {
        console.log("Tärningarna har kastats och spelaren har underrättats.");
        sendGameStateUpdate(models, game.gameCode, socket);
        socket.emit(
          "rollDice",
          generateSuccessResponse({ message: "Tärningarna har kastats om." })
        );
      },
      () => {
        socket.emit(
          "rollDice",
          generateErrorResponse(
            "Timeout när databasen skulle kontaktas. Vänligen försök att ansluta igen lite senare."
          )
        );
      }
    );
  },
  possibleScores: (message, socket, models) => {
    // Lyssna efter förfrågan att hämta möjlig poäng
    console.log("Tog emot en förfrågan att hämta möjliga poäng...");
    let diceNumbers = []; // Skapa en lista som endast innehåller tärningarnas nummer
    for (const dice of game.dices) {
      diceNumbers.push(dice.number);
    }
    socket.emit(
      "possibleScores",
      generateSuccessResponse({
        result: calculateAllPoints(diceNumbers),
      })
    );
  },
  // Lyssna efter förfrågan att skriva in sin poäng
  pickScore: (message, socket, models) => {
    console.log("Tog emot en förfrågan om att skriva in poäng.");
    // Vilken poäng som man ska uppdatera finns i message.requestedScoreType.
    if (
      message.requestedScoreType === undefined ||
      !Object.keys(possibleDiceStates).includes(message.requestedScoreType)
    ) {
      console.warn(
        `Tog emot felaktig förfrågan angående att välja att spara en poäng (efterfrågad poängtyp: ${message.requestedScoreType}).`
      );
      socket.emit(
        "pickScore",
        generateErrorResponse(
          "Felaktigt meddelandeformat. Om du inte försökt att hacka eller manipulera spelet är det något fel i min kod. Försök igen lite senare."
        )
      );
      return;
    }
    updateUserScore(message.requestedScoreType, () => {
      socket.emit("pickScore", { message: "Poängen har uppdaterats." });
      sendGameStateUpdate(models, game.gameCode.toString(), socket);
      runGame();
    });
  },
};
export default gameStateHandlers;
