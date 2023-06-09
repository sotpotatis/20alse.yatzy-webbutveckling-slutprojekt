/* socket.js
Hanterar kommunikationen mellan webbklienten och servern
för multiplayer och för att spara poäng. */

import { nanoid } from "nanoid";
import {
  calculateAllPoints,
  possibleDiceStates,
} from "20alse-yatzy-shared-code";
function generateWebsocketResponse(status, data) {
  if (data === null) {
    data = {};
  }
  data.status = status;
  return data;
}
function generateSuccessResponse(data) {
  return generateWebsocketResponse("success", data);
}
function generateErrorResponse(errorMessage, data = null) {
  if (data === null) {
    data = {};
  }
  data.errorMessage = errorMessage;
  return generateWebsocketResponse("error", data);
}
/**
 * Hjälpfunktion för att hitta ett spel med hjälp av dess ID.
 * @param {object} models Sequelize-modeller, se argumenten till funktionen socketHandler.
 * @param {string} requestedgameCode Den spelkoden för spelet som efterfrågas.
 * @param {Array} include Extra information att inkludera från modellen. Till exempel följande för att inkludera spelarna
 * som är anslutna till spelet: [{
    model: models.Player,
    as: "players"
}]
@param {function} callback En callback-funktion som exekveras när spelare har hittats.
 */
function findGameById(models, requestedgameCode, include, callback) {
  models.Game.findAll({
    where: { gameCode: requestedgameCode.toString() },
    include: include,
  })
    .then((data) => {
      if (data.hasOwnProperty("length") && data.length > 0) {
        console.log("Skickar vidare första möjliga spel till callback.");
        callback(data[0]);
      } else {
        console.log("Inget spel hittades. Talar om detta för callbacken.");
        callback(null);
      }
    })
    .catch((error) => {
      console.log(
        `Ett fel uppstod när vi letade efter spel: ${error}. Talar om detta för callbacken.`
      );
      callback(null);
    });
}
/**
 * Hjälpfunktion för att hitta en spelare med hjälp av dess namn.
 * @param {object} models Sequelize-modeller, se argumenten till funktionen socketHandler.
 * @param {string} playerName Den spelkoden för spelet som efterfrågas.
 * @param {Array} include Extra information att inkludera från modellen. Till exempel följande för att inkludera poängen
för spelaren [{
    model: models.Score,
    as: "scores"
}]
@param {function} callback En callback-funktion som exekveras när spelare har hittats.
 */
function findPlayerByName(models, playerName, include, callback) {
  // Special-attribut: genom att lägga till "secret" i include-listan kan man få användarens hemliga nyckel
  const scope = include.includes("secret")
    ? models.Player
    : models.Player.scope("withSecret");
  scope
    .findAll({
      where: { name: playerName },
      include: include,
    })
    .then((data) => {
      console.log(`Tog emot data om spelare:`, data);
      if (data.hasOwnProperty("length") && data.length > 0) {
        console.log("Skickar vidare första möjliga spelare till callback.");
        callback(data[0]);
      } else {
        console.log("Ingen spelare hittades. Talar om detta för callbacken.");
        callback(null);
      }
    })
    .catch((error) => {
      console.log(
        `Ett fel uppstod när vi letade efter en spelare: ${error}. Talar om detta för callbacken.`
      );
      callback(null);
    });
}

/**
 * För att möjliggöra multiplayer där man kan gå med och sedan spela som önskad spelare så måste vi implementera någon
 * form av autentisering. Vi gör detta genom att ge användaren en unik "secretKey" som är en textsträng som genereras av servern.
 * Denna används för att kunna återansluta om sidan laddas om och sparas i användarens lokala webbläsarlagring ("local storage")
 * @param {object} models Sequelize-modeller, se argumenten till funktionen socketHandler.
 * @param secretKey Användarens hemliga nyckel som används för autentisering
 * @param callback Funktion som tar emot en lista i formatet [autentisering ok, spelardata on autentisering är ok (annars null)].
 */
function validatePlayerAuthorization(models, secretKey, callback) {
  console.log("Validerar autentisering för en spelare...");
  const playerNotAuthenticated = [false, null]; // Svar att returnera ifall spelaren inte är autentiserad
  // Försök att hitta spelaren
  models.Player.scope("withSecret")
    .findAll({
      where: { secret: secretKey },
      include: [
        {
          model: models.Score,
          as: "scores",
        },
      ],
    })
    .then((data) => {
      if (data !== null && data.length > 0) {
        console.log(
          "Hittade en spelare som matchar efterfrågad autentisering."
        );
        const foundPlayer = data[0];
        callback([true, foundPlayer]);
      } else {
        console.warn(
          `Ingen spelare hittades för en försökt autentisering med ${secretKey}!`
        );
        callback(playerNotAuthenticated);
      }
    })
    .catch((error) => {
      console.warn(`Misslyckades att hitta en spelare: ${error}.`);
      callback(playerNotAuthenticated);
    });
}

/**
 * Genererar ett slumpmässigt nummer mellan två tal.
 * @param start Lägsta möjliga numret som ska genereras.
 * @param end Högsta möjliga numret som ska genereras.
 */
function randomNumber(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start)
}
/**
 * Genererar ett roligt spelarnamn.
 * @param models {object} models Sequelize-modeller, se argumenten till funktionen socketHandler.
 * @param callback En callback-funktion som ska ta emot spelarnamnet.
 */
function generatePlayerName(models, callback) {
  // Ett spelarnamn baseras på adjektiv och adjektiv/substantiv.
  const nameBeginnings = [
    "Knasig",
    "Cool",
    "Toppen",
    "Perfekt",
    "Fåfäng",
    "Dansande",
    "Noggrann",
    "Snygg",
  ];
  const nameEndings = [
    "Knasboll",
    "Fåntratt",
    "Gymnast",
    "Kompis",
    "Spelare",
    "Kock",
    "Gamer",
    "Vinnare",
    "Förlorare",
  ];
  const randomItemFromArray = (array) => {
    // Definiera en genväg till att ta en slumpmässig sak från en array
    return array[randomNumber(0, array.length-1)];
  };
  const playerName =
    randomItemFromArray(nameBeginnings) +
    randomItemFromArray(nameEndings) +
    ~~(Math.random() * (99 - 10)) +
    10;
  // Dubbelkolla att spelarnamnet är unikt
  models.Player.findAll({
    where: { name: playerName },
  }).then((data) => {
    if (data !== null && data.length > 0) {
      console.log(
        `Gör om namngenerering: spelarnamnet ${playerName} har redan skapats...`
      );
      generatePlayerName(models, callback); // Kör funktionen igen.
    } else {
      callback(playerName);
    }
  });
}
/**
 * Funktion för att skicka en statusuppdatering om spelets aktuella status till alla som är uppkopplade på spelservern.
 * En statusuppdatering kan skickas till exempel när en ny spelare går med.
 * @param {object} models Sequelize-modeller, se argumenten till funktionen socketHandler.
 * @param {string} requestedGameCode Den spelkoden för spelet som efterfrågas.
 * @param socket Socket-objekt för att skicka meddelanden.
 * @param individual true om meddelandet endast ska skickas till den som efterfrågat det. false om det ska skickas till alla
 * anslutna spelare.
 */
function sendGameStateUpdate(
  models,
  requestedGameCode,
  socket,
  individual = false
) {
  findGameById(
    models,
    requestedGameCode,
    [
      {
        model: models.Player,
        as: "players",
        include: {
          model: models.Score,
          as: "scores",
        },
      },
      {
        model: models.Dice,
        as: "dices",
      },
    ],
    (game) => {
      const sendTo = (socket) => {
        // Hämtar den socket som en information ska skickas till
        return !individual ? socket.to(requestedGameCode.toString()) : socket;
      };
      if (game !== null) {
        console.log(
          `Skickar speluppdatering för spel ${game.gameCode} till ${
            individual ? `avsändaren av meddelandet` : `alla`
          }...`
        );
        sendTo(socket).emit(
          "gameUpdate",
          generateSuccessResponse({
            gameData: game,
          })
        );
        console.log("Meddelande skickat.");
      } else {
        console.warn(
          "Oväntat: spelet som efterfrågade en uppdatering verkar inte existera."
        );
        sendTo(socket).emit(
          "gameUpdate",
          generateErrorResponse("Spelet verkar inte längre existera.")
        );
      }
    }
  );
}
// Skapa lite hjälpfunktioner
/**
 * Hämtar vilken spelare som står på tur härnäst
 * @return {*} Nästa spelare som ska spela
 */
function getNextPlayer(game) {
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
function prepareForPlayer(game, models, socket, newPlayerName, callback) {
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
      (game, models, socket) => {
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
function generateDiceNumbers(
  game,
  models,
  socket,
  callback,
  timeoutCallback = null
) {
  console.log("Genererar nummer på tärningarna....");
  waitForDiceUpdate(
    game.dices,
    (dice) => {
      if (!dice.saved) {
        dice.number = randomNumber(1, 6);
      }
      return dice;
    },
    () => {
      console.log("Numret på alla tärningar har uppdaterats.");
      game.currentTurnNumber += 1;
      game.save().then(() => {
        console.log("Turnumret i spelet har uppdaterats.");
        callback(game, models, socket);
      });
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
function updateUserScore(game, models, socket, typeOfPoint, callback) {
  console.log("Uppdaterar poäng för den aktuella användaren...");
  let diceNumbers = []; // Skapa en lista som endast innehåller tärningarnas nummer
  for (const dice of game.dices) {
    diceNumbers.push(dice.number);
  }
  // Kör funktion för att hitta poäng för alla tärningar
  const possiblePoints = calculateAllPoints(diceNumbers);
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
          callback(game, models, socket);
        } else {
          console.log("Uppdaterar poäng...");
          models.Score.create({
            scoreType: typeOfPoint,
            points: possiblePoints[typeOfPoint].value,
          }).then((newScore) => {
            console.log("En ny poäng har lagts till.");
            player.addScore(newScore).then(() => {
              game.isPickingScore = false;
              game.save().then(() => {
                callback(game);
              });
            });
          });
        }
      }
    }
  );
}
/**
 * Uppdaterar spelrundan.
 * @param {*} onScorePick Funktion som körs när användaren valt sin poäng.
 */
let playerTimeout = null;
function updateRound(game, models, socket, onScorePick, whenPrepared = null) {
  console.log("Väljer ut en användare som ska spela...");
  const nextPlayer = getNextPlayer(game);
  console.log(`Nästa spelare: ${nextPlayer.name}.`);
  if (playerTimeout !== null) {
    // Rensa tidigare kontroller efter inaktiva användare.
    clearInterval(playerTimeout);
  }
  prepareForPlayer(game, models, socket, nextPlayer.name, () => {
    console.log("Spelplanen har förberetts.");
    // Skicka uppdaterat gameState
    console.log("Skickar ett uppdaterat gameState...");
    sendGameStateUpdate(models, game.gameCode, socket);
    console.log("gameState uppdaterad.");
    if (whenPrepared !== null) {
      // Kör extra callback om specificerad
      whenPrepared(game);
    }
    // Applicera timeout ifall en spelare inte gör något på en och en halv minut (har ökats från en minut, se dokumentationen (utvärdering/användartester för mer info/motivering))
    const initialPlayerName = game.currentPlayerName;
    playerTimeout = setTimeout(() => {
      if (game.currentPlayerName === initialPlayerName) {
        console.log(
          "Timeout uppnåddes: en spelare har inte gjort något på en minut. Byter spelare..."
        );
        updateRound(game, models, socket, onScorePick);
      }
    }, 90000);
  });
}

function toggleDiceLocked(game, number, callback, timeoutCallback = false) {
  console.log(`Låser/låser upp tärning nummer ${number}...`);
  waitForDiceUpdate(
    [game.dices[number]],
    (dice) => {
      dice.saved = !dice.saved;
      return dice;
    },
    callback,
    timeoutCallback
  );
}
/**
 * Kollar om spelet har tagit slut
 */
function detectGameEnd(game) {
  for (const player of game.players) {
    console.log(
      `Detektering av spelslut: spelarens poänglängd är: ${player.scores.length}`
    );
    if (player.scores.length !== Object.keys(possibleDiceStates).length) {
      // Om användaren inte plockat alla poäng än
      return false; // Returnera false.
    }
  }
  return true; // Om vi kommer hit så har spelet tagit slut!
}
let updateInterval = null;
const runGame = (game, models, socket, whenPrepared = null) => {
  // Skapa en rekursiv funktion som kör spelet.
  if (updateInterval !== null) {
    clearInterval(updateInterval);
  }
  updateInterval = setInterval(() => {
    sendGameStateUpdate(models, game.gameCode, socket); // Skicka uppdaterad gameState.
  }, 10000); // Skicka uppdaterad spelstatus till alla klienter var 2.5e sekund.
  if (detectGameEnd(game)) {
    console.log("Spelet är slut!");
    // Uppdatera att spelet tagit slut.
    game.completed = true;
    game.save().then(() => {
      // Uppdatera i databasen
      console.log(
        "Spelet har uppdaterats som slut i databasen. Skickar status..."
      );
      clearInterval(updateInterval); // Rensa utskick av uppdaterad speldata då det ställs in igen
      sendGameStateUpdate(models, game.gameCode, socket); // Skicka uppdaterad gameState.
      return;
    });
  } else {
    console.log("Spelet är inte slut. Kör spelrunda...");
    updateRound(
      game,
      models,
      socket,
      () => {
        console.log("Användaren har valt sin poäng. Startar om spel...");
        runGame(game, models, socket); // Kör denna funktion igen när användaren har valt sina poäng.
      },
      whenPrepared
    );
  }
};
const includeEverything = (models) => {
  // Inkluderar all information som har med ett spel att göra
  return [
    {
      model: models.Player,
      as: "players",
      include: {
        model: models.Score,
        as: "scores",
      },
    },
    {
      model: models.Dice,
      as: "dices",
    },
  ];
};
const socketHandlers = {
  // Lyssna efter förfrågan att kasta tärningar
  rollDice: (message, socket, models) => {
    console.log("Tog emot en förfrågan att kasta en tärning.");
    if (message.gameCode === undefined) {
      socket.emit(
        "rollDice",
        generateErrorResponse(
          "Du har inte inkluderat en spelkod i ditt meddelande"
        )
      );
    } else {
      findGameById(
        models,
        message.gameCode.toString(),
        includeEverything(models),
        (game) => {
          if (game !== null) {
            // Hitta spel från meddelande
            generateDiceNumbers(
              game,
              models,
              socket,
              () => {
                console.log(
                  "Tärningarna har kastats och spelaren har underrättats."
                );
                socket.emit(
                  "rollDice",
                  generateSuccessResponse({
                    message: "Tärningarna har kastats om.",
                    gameState: game,
                  })
                );
                sendGameStateUpdate(models, game.gameCode, socket);
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
          } else {
            socket.emit(
              "rollDice",
              generateErrorResponse(
                "Ett oväntat fel inträffade: spelet verkar inte längre existera. Testa att starta ett nytt spel."
              )
            );
          }
        }
      );
    }
  },
  toggleDice: (message, socket, models) => {
    console.log("Tog emot en förfrågan att låsa/låsa upp en tärning.");
    if (message.gameCode === undefined) {
      socket.emit(
        "toggleDice",
        generateErrorResponse(
          "Du har inte inkluderat en spelkod i ditt meddelande"
        )
      );
    } else if (
      message.diceIndex === undefined ||
      message.diceIndex < 0 ||
      message.diceIndex > 4
    ) {
      socket.emit(
        "toggleDice",
        generateErrorResponse(
          "Du har angivit ett ogiltigt tärningsnummer i ditt meddelande."
        )
      );
    } else {
      findGameById(
        models,
        message.gameCode.toString(),
        includeEverything(models),
        (game) => {
          if (game !== null) {
            // Hitta spel från meddelande
            toggleDiceLocked(
              game,
              message.diceIndex,
              () => {
                console.log("Tärningen har uppdaterats.");
                socket.emit(
                  "toggleDice",
                  generateSuccessResponse({
                    message: "Tärningen har uppdaterats.",
                    gameState: game,
                  })
                );
                sendGameStateUpdate(models, game.gameCode, socket);
              },
              () => {
                socket.emit(
                  "toggleDice",
                  generateErrorResponse(
                    "Timeout när databasen skulle kontaktas. Vänligen försök att ansluta igen lite senare."
                  )
                );
              }
            );
          } else {
            socket.emit(
              "toggleDice",
              generateErrorResponse(
                "Ett oväntat fel inträffade: spelet verkar inte längre existera. Testa att starta ett nytt spel."
              )
            );
          }
        }
      );
    }
  },
  possibleScores: (message, socket, models) => {
    // Lyssna efter förfrågan att hämta möjlig poäng
    console.log(
      `Tog emot en förfrågan att hämta möjliga poäng med spelkoden ${message.gameCode}`
    );
    if (message.gameCode === undefined) {
      socket.emit(
        "possibleScores",
        generateErrorResponse(
          "Du har inte inkluderat en spelkod i ditt meddelande"
        )
      );
    } else {
      findGameById(
        models,
        message.gameCode.toString(),
        includeEverything(models),
        (game) => {
          if (game !== null) {
            console.log("Tog emot en förfrågan att hämta möjliga poäng...");
            let diceNumbers = []; // Skapa en lista som endast innehåller tärningarnas nummer
            for (const dice of game.dices) {
              diceNumbers.push(dice.number);
            }
            game.isPickingScore = true; // Uppdatera att användaren håller på att plocka poäng
            game
              .save()
              .then(() => {
                socket.emit(
                  "possibleScores",
                  generateSuccessResponse({
                    result: calculateAllPoints(diceNumbers),
                    gameState: game,
                  })
                );
              })
              .catch((error) => {
                console.warn(`Misslyckades att uppdatera ett spel!`, error);
                socket.emit(
                  "possibleScores",
                  generateErrorResponse(
                    "Ett internt serverfel inträffade när spelet skulle uppdateras. Vänligen försök igen lite senare."
                  )
                );
                sendGameStateUpdate(models, game.gameCode, socket);
              });
          } else {
            socket.emit(
              "possibleScores",
              generateErrorResponse(
                "Ett oväntat fel inträffade: spelet verkar inte längre existera. Testa att starta ett nytt spel."
              )
            );
          }
        }
      );
    }
  },
  // Lyssna efter förfrågan att skriva in sin poäng
  pickScore: (message, socket, models) => {
    console.log("Tog emot en förfrågan om att skriva in poäng.");
    if (message.gameCode === undefined) {
      socket.emit(
        "pickScore",
        generateErrorResponse(
          "Du har inte inkluderat en spelkod i ditt meddelande"
        )
      );
    } else {
      findGameById(
        models,
        message.gameCode.toString(),
        includeEverything(models),
        (game) => {
          if (game !== null) {
            // Vilken poäng som man ska uppdatera finns i message.requestedScoreType.
            if (
              message.requestedScoreType === undefined ||
              !Object.keys(possibleDiceStates).includes(
                message.requestedScoreType
              )
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
            updateUserScore(
              game,
              models,
              socket,
              message.requestedScoreType,
              (game) => {
                sendGameStateUpdate(models, game.gameCode.toString(), socket);
                runGame(game, models, socket, (game) => {
                  socket.emit("pickScore", {
                    message: "Poängen har uppdaterats.",
                    gameState: game,
                  });
                });
              }
            );
          } else {
            socket.emit(
              "pickScore",
              generateErrorResponse(
                "Ett oväntat fel inträffade: spelet verkar inte längre existera. Testa att starta ett nytt spel."
              )
            );
          }
        }
      );
    }
  },
  createGame: (message, socket, models) => {
    // createGame --> efterfrågan om att skapa ett spel
    console.log("Tog emot en förfrågan av att skapa ett spel.");
    const game = models.Game.build();
    game.save().then(() => {
      console.log("Ett spel skapades!", game);
      console.log("Skapar tärningar...");
      // Skapa - och lägg till - 5st tärningar
      let dicesAdded = 0;
      for (let i = 0; i < 5; i++) {
        const onDiceAddError = (error) => {
          console.warn(
            `Ett fel inträffade när en tärning skulle läggas till: ${error}.`
          );
          socket.emit(
            "createGame",
            generateErrorResponse("Internt serverfel.")
          );
        };
        models.Dice.create({
          number: "empty",
          saved: false,
        })
          .then((dice) => {
            game
              .addDice(dice)
              .then(() => {
                console.log("En tärning lades till.");
                dicesAdded += 1;
              })
              .catch(onDiceAddError);
          })
          .catch(onDiceAddError);
        let timeElapsed = 0; // Timer för att vänta på tärningsuppdateringar
        let interval = setInterval(() => {
          if (dicesAdded === 5) {
            console.log("Spelet har skapats!");
            // Skicka information till den som skapade spelet om dess ID
            socket.emit(
              "createGame",
              generateSuccessResponse({
                gameCode: game.gameCode,
              })
            );
            console.log("...och information om det är ute i världsrymden!");
            clearInterval(interval);
          } else if (timeElapsed > 20) {
            console.warn("Timeout på att skapa tärningar uppnåddes.");
            socket.emit(
              "createGame",
              generateErrorResponse(
                "Internt serverfel: en timeout nåddes när databasen försökte kontaktas. Var vänlig försök igen lite senare."
              )
            );
            clearInterval(interval);
          }
          timeElapsed += 0.1;
        }, 100);
      }
    });
  },
  joinGame: (message, socket, models) => {
    // joinGame --> efterfrågan om att gå med i ett spel
    if (message.action === "newPlayer") {
      console.log("Tog emot en förfrågan att gå med i ett spel.");
      // Hämta detaljer från meddelandet
      const requestedgameCode = message.gameCode;
      // Kolla om spelets ID finns
      findGameById(
        models,
        requestedgameCode,
        [
          {
            model: models.Player,
            as: "players",
          },
        ],
        (game) => {
          console.log("Hittat spel: " + JSON.stringify(game));
          if (game === null) {
            console.log("Kunde inte hitta ett spel.");
            socket.emit(
              "joinGame",
              generateErrorResponse(
                "Kunde inte hitta ett spel med det efterfrågade ID:t"
              )
            );
            return;
          }
          // Om vi kommer hit finns spelet. Kolla att det inte är startat
          if (game.started) {
            console.log("Spelet är redan startat.");
            socket.emit(
              "joinGame",
              generateErrorResponse(
                "Spelet är redan startat. Vänta tills det är klart eller starta ett nytt spel."
              )
            );
            return;
          }
          // Skapa en funktion för att lägga en till ny spelare till spelet.
          const addPlayer = (player) => {
            console.log("Lägger till spelare...");
            const afterPlayerWasAdded = () => {
              // Funktion att köra när en spelare lagts till.
              console.log("En spelare har lagts till i spelet.");
              // Låt spelaren gå med i ett rum/kommunikationskanal kopplat till spelet.
              socket.join(game.gameCode.toString());
              console.log(
                `Användaren gick med i spelet och i rummet ${game.gameCode.toString()}.`
              );
              // Bekräfta att spelaren har gått med spelaren själv.
              socket.emit(
                "joinGame",
                generateSuccessResponse({ player: player })
              );
              // Bekräfta att spelaren har gått med för hela rummet.
              sendGameStateUpdate(models, game.gameCode, socket);
            };
            // Om användaren inte redan är med i spelet, anslut hen
            let previousPlayerNames = [];
            for (const previousPlayer of previousPlayerNames) {
              previousPlayerNames.push(previousPlayer.name);
            }
            if (!previousPlayerNames.includes(player.name)) {
              console.log(
                "Spelaren ska läggas till som en ny spelare i spelet."
              );
              game
                .addPlayer(player)
                .then(afterPlayerWasAdded)
                .catch((error) => {
                  console.warn(
                    `Ett fel inträffade när en spelare skulle läggas till: ${error}`
                  );
                  socket.emit(
                    "joinGame",
                    generateErrorResponse(
                      "Ett internt serverfel inträffade. Var vänlig och försök igen senare."
                    )
                  );
                });
            } else {
              console.log("Spelaren ska återansluta till spelet.");
              afterPlayerWasAdded();
            }
          };
          // Kolla autentisering. Det är möjligt att användaren har loggat in som en tidigare användare.
          // Om vi har hamnat här kan spelaren gå med i spelet.
          console.log("Låter spelaren gå med i spelet...");
          if (socket.handshake.auth.token !== undefined) {
            console.log("Autentisering specificerades i uppkopplingen.");
            // Validera autentisiering
            validatePlayerAuthorization(
              models,
              socket.handshake.auth.token,
              ([validAuthentication, player]) => {
                if (!validAuthentication) {
                  console.warn(
                    `Uppkoppling till servern med en tidigare token tilläts inte. Skickar fel...`
                  );
                  socket.emit(
                    "joinGame",
                    generateErrorResponse(
                      "Ett fel inträffade vid autentisering till servern. Detta beror troligtvis på att databasen har ändrats senast du senast spelade. Testa att rensa dina cookies och ladda sedan om sidan!"
                    )
                  );
                } else {
                  console.log("En förautentiserad användare hittades.");
                  // Rensa tidigare poäng för spelaren då en poäng är unika för användaren men inte identifieras
                  // baserat på vilket det aktuella spelet är (potentiell förbättringspunkt).
                  let removedScores = 0;
                  let scoreRemovalTimeElapsed = 0;
                  for (const score of player.scores) {
                    player.removeScore(score).then(() => {
                      removedScores += 1;
                    });
                  }
                  let scoreRemoveCheckInterval = setInterval(() => {
                    if (removedScores === player.scores.length) {
                      console.log(
                        "Alla tidigare poäng borttagna för spelaren."
                      );
                      addPlayer(player); // Lägg till spelaren i spelet.
                      clearInterval(scoreRemoveCheckInterval);
                    } else if (scoreRemoveCheckInterval >= 20) {
                      console.warn(
                        "Timeout när tidigare poäng för användaren skulle tas bort! Skickar meddelande..."
                      );
                      socket.emit(
                        "joinGame",
                        generateErrorResponse(
                          "Timeout vid autentisering när dina tidigare poäng skulle rensas. Detta problem löses nästan alltid av att ladda om sidan. Annars, testa att gå med lite senare!"
                        )
                      );
                      clearInterval(scoreRemoveCheckInterval);
                    }
                    scoreRemovalTimeElapsed += 0.1;
                  }, 100);
                }
              }
            );
          } else {
            console.log(
              "Ingen autentisering specificerades i uppkopplingen. Skapar en ny spelare..."
            );
            const previousPlayers = game.players || 0;
            const playerNumber = previousPlayers.length + 1;
            const gameCode = game.gameCode;
            generatePlayerName(models, (name) => {
              console.log(`Skapar en spelare med namn: ${name}`);
              models.Player.create({
                name: name,
                playerId: socket.id,
                secret: nanoid(),
                gameGameCode: gameCode,
              }).then(addPlayer);
            });
          }
        }
      );
    }
  },
  getMe: (message, socket, models) => {
    // getMe --> skickar information om den aktuella spelaren.
    console.log("Tog emot en förfrågan om att hämta aktuell spelare.");
    if (socket.handshake.auth.token !== undefined) {
      console.log("Autentisering specificerades i uppkopplingen.");
      // Validera autentisiering
      validatePlayerAuthorization(
        models,
        socket.handshake.auth.token,
        ([validAuthentication, player]) => {
          if (!validAuthentication) {
            console.warn(
              `Uppkoppling till servern med en tidigare token tilläts inte. Skickar fel...`
            );
            socket.emit(
              "getMe",
              generateErrorResponse(
                "Ett fel inträffade vid autentisering till servern. Testa att rensa dina cookies!"
              )
            );
          } else {
            console.log("Efterfrågad spelare hittades...");
            socket.emit("getMe", generateSuccessResponse({ you: player }));
          }
        }
      );
    } else {
      socket.emit(
        "getMe",
        generateErrorResponse(
          "Denna funktion är endast tillgänglig för autentiserade användare."
        )
      );
    }
  },
  gameInfo: (message, socket, models) => {
    // gameInfo --> hämta information om ett spel
    console.log("Skickar information om ett spel från servern...");
    const requestedgameCode = message.gameCode;
    findGameById(
      models,
      requestedgameCode,
      [
        {
          model: models.Player,
          as: "players",
        },
      ],
      (requestedGame) => {
        console.log(`Spelinformation: ${requestedGame}.`);
        // Vi får null tillbaka om inget spel kunde hittas.
        if (requestedGame !== null) {
          // Om ett spel kunde hittas
          socket.emit(
            "gameInfo",
            generateSuccessResponse({
              gameInfo: requestedGame,
            })
          );
        } else {
          // Om inget spel med efterfrågat ID kunde hittas.
          socket.emit(
            "gameInfo",
            generateErrorResponse(
              "Det spel du försöker gå med i kunde inte hittas.",
              {
                errorType: "gameNotFound",
              }
            )
          );
        }
      }
    );
  },
  disconnect: (message, socket, models) => {
    console.log(`En klient (${socket.id}) kopplade bort från servern.`);
  },
  startGame: (message, socket, models) => {
    // Starta ett spel
    console.log("Tog emot en förfrågan om att starta ett spel!");
    findGameById(
      models,
      message.gameCode,
      [
        {
          model: models.Player,
          as: "players",
          include: {
            model: models.Score,
            as: "scores",
          },
        },
        {
          model: models.Dice,
          as: "dices",
        },
      ],
      (game) => {
        if (game === null) {
          console.log("Kunde inte hitta ett spel.");
          socket.emit(
            "startGame",
            generateErrorResponse(
              "Kunde inte hitta ett spel med det efterfrågade ID:t"
            )
          );
          return;
        }
        // Om vi kommer hit finns spelet. Kolla att det inte är startat
        if (game.started) {
          console.log("Spelet är redan startat.");
          socket.emit(
            "startGame",
            generateErrorResponse("Spelet är redan startat.")
          );
        }
        // Om vi kommer hit är allting redo så att säga!
        game.started = true;
        // Sätt spelet som initierat
        game.initialized = true;
        game
          .save()
          .then(() => {
            console.log("Spelet har startats.");
            // NU är det dags att börja köra själva spelet. Vi börjar alltså här.
            console.log("Meddelar alla anslutna att spelet är redo...");
            socket.emit("startGame", generateSuccessResponse({})); // Meddelar den som försökt starta spelet
            socket
              .to(game.gameCode.toString())
              .emit("gameStarted", generateSuccessResponse({}));
            console.log("Kör spel!");
            runGame(game, models, socket); // Kör spele
          })
          .catch((error) => {
            console.warn(
              `Ett fel inträffade när spelet skulle startas: ${error}`
            );
            socket.emit(
              "startGame",
              generateErrorResponse(
                "Ett internt serverfel inträffade. Testa att komma tillbaka lite senare."
              )
            );
          });
      }
    );
  },
  getGameState: (message, socket, models) => {
    // getGameState: efterfråga status av det aktuella spelet.
    console.log("Tog emot en förfrågan att hämta status för ett spel!");
    if (message.gameCode === undefined) {
      socket.emit(
        "getGameState",
        generateErrorResponse(
          "Var vänlig att inkludera en spelkod i ditt meddelande."
        )
      );
      return;
    }
    const requestedGameCode = message.gameCode; // Hämta spelkod från meddelande
    findGameById(models, requestedGameCode, [], (game) => {
      // Steg 1: validera att spelet verkligen existerar
      if (game === null) {
        console.log(`Ett efterfrågat spel verkar inte finnas!`);
        socket.emit(
          "getGameState",
          generateErrorResponse("Spelet du efterfrågar verkar inte existera.")
        );
      } else {
        console.log(`Skickar spelstatus för spel ${requestedGameCode}...`);
        socket.join(requestedGameCode.toString()); // Se till att användaren är med i rummet för spelstatus
        sendGameStateUpdate(models, requestedGameCode, socket, true);
      }
    });
  },
};
/**
 * För att socket-servern inte ska krascha om ett enda kommando kraschar en gång så vill vi ha en funktion
 * som implementerar felhantering.
 * @param {*} handler Funktionen som efterfrågas.
 * @param {*} socket Ett socket-objekt för den aktuella uppkopplingen.
 * @param {*} message Meddelandet som togs emot.
 * @param {object} models Åtkomst till sequelize-modeller för det aktuella spelet.
 */
function runSocketHandlerWithErrorHandling(handler, message, socket, models) {
  // Dubbelkolla att efterfrågad handler existerar
  if (!Object.keys(socketHandlers).includes(handler)) {
    console.warn(
      `Okänd/oregistrerad hanterare ${socketHandler} efterfrågades.`
    );
    socket.emit(
      handler,
      generateErrorResponse("Odefinierad hanterare efterfrågad.")
    );
  }
  try {
    // Kör hanterare för att skicka ett svar för meddelande
    socketHandlers[handler](message, socket, models);
  } catch (e) {
    console.warn(`Fångade upp ett ohanterat fel i ${handler}: ${e}`);
    // Skicka ut ett felmeddelande
    socket.emit(
      handler,
      generateErrorResponse(
        `Ett internt serverfel inträffade. (förfrågan: ${handler})`
      )
    );
  }
}
/**
 * Funktion som lägger till hanterare för alla meddelanden som skickas till socket-servern.
 * Denna funktion hanterar alltså saker såsom skapandet av nya spel, uppdaterande av spelstatus etc.
 * @param {object} socket Ett socket-objekt som fås när en Socket.IO-uppkoppling-skapas
 * @param {object} models Åtkomst till att hantera samt komma åt Sequelize-modeller (sequelize.models) som innehåller samt definierar speldata.
 */
export default function socketHandler(socket, models) {
  // Registrera alla hanterare, se dokumentation ovan för felhantering etc.
  for (const handlerName of Object.keys(socketHandlers)) {
    socket.on(handlerName, (message) => {
      runSocketHandlerWithErrorHandling(handlerName, message, socket, models);
    });
  }
}
