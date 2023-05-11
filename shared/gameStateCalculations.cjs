/* game_functions.js
Innehåller funktioner för att detektera olika lägen i spelet. */
/**
 * Funktion för att räkna alla nummer som förekommer i en array.
 * @param {*} array Input-arrayen som ska räkna nummer
 * @returns Ett objekt med nycklar för varje nummer mappade till hur ofta de förekommer.
 */
function countNumbersInArray(array) {
  let numbers = {};
  for (const element of array) {
    if (Object.keys(numbers).includes(element.toString())) {
      // Om numret redan har hittats
      numbers[element]++;
    } else {
      // Om det är första gången man hittar numret.
      numbers[element] = 1;
    }
  }
  return numbers;
}
/**
 * Beräknar hur många gånger ett nummer förekommer i en array. Användbar för detektering
 * av de flesta saker man kan få i spelet.
 * Observera att denna funktion räknar hur många gånger ett nummer förekommer i en lista.
 * För att räkna alla gånger ett nummer förekommer, använd countNumbersInArray()
 * @param {object} array Ingångsarrayen.
 * @param {number} number Det nummer som ska räknas
 */
function countNumberInArray(array, number) {
  const numberCounts = countNumbersInArray(array); // Räkna alla nummer i arrayen
  // Om numret finns i arrayen, returnera hur många gånger det förekommer. Annars, returnera 0.
  return Object.keys(numberCounts).includes(number.toString())
    ? numberCounts[number.toString()]
    : 0;
}
/**
 * För ettor, tvåor osv. så är det samma princip för att kolla om användaren kan få de.
 * @param {object} dices Tärningarnas aktuella nummer som en lista.
 * @param {number} number Vilket utfall som ska kollas efter.
 * T.ex. om denna funktion ska detektera ettor, skriv 1.
 */
function checkSingleDicePossible(dices, number) {
  return countNumberInArray(dices, number) >= 1;
}
/**
 * Beräkna förekomsten av par i en uppsättning tärningar.
 * @param {array} dices Tärningarnas aktuella nummer som en lista.
 * @returns En array som innehåller antalet par, de par som hittades
 */
function calculatePairs(dices) {
  const numberCounts = countNumbersInArray(dices);
  let numberOfPairs = 0;
  let foundPairs = [];
  for (const [number, numberCount] of Object.entries(numberCounts)) {
    if (numberCount === 2) {
      numberOfPairs += 1;
      foundPairs.push(number);
    }
  }
  return [numberOfPairs, foundPairs];
}
// Beräkningsfunktioner som används flera gånger i koden
/**
 * För att slippa skriva om kontrollen som kollar om en tärningskast ger poäng för ett visst utfall
 * har jag gjort en funktion som gör det.
 * @param {*} stateInformation Information om utfallet (ett värde av en nyckel i possibleDiceStats)
 * @param {*} dices En array med numrena på de aktuella tärningarna.
 * @param {*} calculationFunction En beräkningsfunktion som ska köras om tärningsutfallet ger mer än två poäng.
 * @returns
 */
function calculateDiceStatePoints(
  stateInformation,
  dices,
  calculationFunction
) {
  // Kolla om funktionen returnerar fler än 0 poäng
  if (stateInformation.givesMoreThanZeroPoints(dices)) {
    return calculationFunction(dices); // Returnera poäng
  } else {
    return 0;
  }
}
/**
 * Räknar ut summan av tärningar.
 * @param {*} dices En array som innehåller numrena på tärningen som kastas just nu.
 * @param {*} include En array med nummer som ska inkluderas. Om null kommer alla nummer inkluderas i beräkningen.
 * Kan användas för att filtrera tärningar som inte ska inkluderas i summan.
 */
function calculateSumOfDices(dices, include = null) {
  let sum = 0;
  for (const dice of dices) {
    if (
      include === null ||
      include.includes(dice) ||
      include.includes(dice.toString())
    ) {
      // Om tärningen ska inkluderas i beräkningen.
      sum += dice;
    }
  }
  return sum;
}
/**
 * Funktion för att hitta om ett nummer förekommer flera gånger. Denna funktion används till beräkning av tretal/triss och fyrtal.
 * Notera att den skiljer sig mot calculatePairs på ett sätt: calculatePairs förväntar sig att fler än ett par är möjligt, medan
 * denna funktion inte gör det utan antar alltså att numberOfPresences >= 3.
 * @param {object} dices En array som innehåller numrena på tärningarna som kastats.
 * @param {number} numberOfPresences Hur många gånger man vill att numret funktionen ev. returnerar efter ska förekomma. T.ex. 3 för triss,
 * 4 för fyrtal, etc.
 * @returns Om ett nummer som förekommer numberOfPresences gånger returneras det numret. Annars returneras null.
 */
function findNumberPresentMultipleTimes(dices, numberOfPresences) {
  const numberCounts = countNumbersInArray(dices); // Räkna förekomsten av alla nummer
  for (const [number, numberCount] of Object.entries(numberCounts)) {
    if (numberCount === numberOfPresences) {
      // Om numret hittas så många gånger som vi vill, returnera.
      return number;
    }
  }
  return null;
}
// För varje möjlig sak att få i spelet, definiera en funktion som returnerar
// om saken ger poäng eller inte. Man kan ju alltid välja att få saken även om den ger 0 poäng.
// Returnera även poäng och inkludera information om
// den möjliga saken.
// dices-argmentet är en lista med tärningars poäng: t.ex. [0,1,2,3,4]
const possibleDiceStates = {
  ettor: {
    information: {
      name: "Ettor",
      description: "Här läggs antalet ettor du har ihop.",
      pointsInformation: "Summan av alla ettor.",
    },
    givesMoreThanZeroPoints: (dices) => {
      return checkSingleDicePossible(dices, 1);
    },
    calculatePoints: (dices) => {
      return calculateDiceStatePoints(
        possibleDiceStates.ettor,
        dices,
        (dices) => {
          // Definiera en funktion som körs om tärningen är en etta.
          return calculateSumOfDices(dices, [1]);
        }
      );
    },
  },
  tvåor: {
    information: {
      name: "Tvåor",
      description: "Här läggs antalet tvåor du har ihop.",
      pointsInformation: "Summan av alla tvåor.",
    },
    givesMoreThanZeroPoints: (dices) => {
      return checkSingleDicePossible(dices, 2);
    },
    calculatePoints: (dices) => {
      return calculateDiceStatePoints(
        possibleDiceStates.tvåor,
        dices,
        (dices) => {
          // Definiera en funktion som körs om tärningen är en tvåa.
          return calculateSumOfDices(dices, [2]);
        }
      );
    },
  },
  treor: {
    information: {
      name: "Treor",
      description: "Här läggs antalet treor du har ihop.",
      pointsInformation: "Summan av alla treor.",
    },
    givesMoreThanZeroPoints: (dices) => {
      return checkSingleDicePossible(dices, 3);
    },
    calculatePoints: (dices) => {
      return calculateDiceStatePoints(
        possibleDiceStates.treor,
        dices,
        (dices) => {
          // Definiera en funktion som körs om tärningen är en trea.
          return calculateSumOfDices(dices, [3]);
        }
      );
    },
  },
  fyror: {
    information: {
      name: "Fyror",
      description: "Här läggs antalet fyror du har ihop.",
      pointsInformation: "Summan av alla fyror.",
    },
    givesMoreThanZeroPoints: (dices) => {
      return checkSingleDicePossible(dices, 4);
    },
    calculatePoints: (dices) => {
      return calculateDiceStatePoints(
        possibleDiceStates.fyror,
        dices,
        (dices) => {
          // Definiera en funktion som körs om tärningen är en fyra.
          return calculateSumOfDices(dices, [4]);
        }
      );
    },
  },
  femmor: {
    information: {
      name: "Femmor",
      description: "Här läggs antalet femmor du har ihop.",
      pointsInformation: "Summan av alla femmor.",
    },
    givesMoreThanZeroPoints: (dices) => {
      return checkSingleDicePossible(dices, 5);
    },
    calculatePoints: (dices) => {
      return calculateDiceStatePoints(
        possibleDiceStates.femmor,
        dices,
        (dices) => {
          // Definiera en funktion som körs om tärningen är en femma.
          return calculateSumOfDices(dices, [5]);
        }
      );
    },
  },
  sexor: {
    information: {
      name: "Sexor",
      description: "Här läggs antalet sexor du har ihop.",
      pointsInformation: "Summan av alla sexor.",
    },
    givesMoreThanZeroPoints: (dices) => {
      return checkSingleDicePossible(dices, 6);
    },
    calculatePoints: (dices) => {
      return calculateDiceStatePoints(
        possibleDiceStates.sexor,
        dices,
        (dices) => {
          // Definiera en funktion som körs om tärningen är en sexa.
          return calculateSumOfDices(dices, [6]);
        }
      );
    },
  },
  par: {
    information: {
      name: "Par",
      description: "Ett nummer förekommer två gånger.",
      pointsInformation: "Summan av de tärningar som ingår i paret.",
    },
    givesMoreThanZeroPoints: (dices) => {
      return calculatePairs(dices)[0] === 1;
    },
    calculatePoints: (dices) => {
      return calculateDiceStatePoints(
        possibleDiceStates.par,
        dices,
        (dices) => {
          return calculateSumOfDices(dices, calculatePairs(dices)[1]); // calculatePairs ger tillbaka de tärningar som ger poäng för par.
        }
      );
    },
  },
  två_par: {
    information: {
      name: "Två par",
      description: "Två olika nummer förekommer två gånger.",
      pointsInformation: "Summan av de tärningar som ingår i paren.",
    },
    givesMoreThanZeroPoints: (dices) => {
      return calculatePairs(dices)[0] === 2;
    },
    calculatePoints: (dices) => {
      return calculateDiceStatePoints(
        possibleDiceStates.två_par,
        dices,
        (dices) => {
          return calculateSumOfDices(dices, calculatePairs(dices)[1]); // calculatePairs ger tillbaka de tärningar som ger poäng för par.
        }
      );
    },
  },
  triss: {
    information: {
      name: "Triss",
      description: "Ett nummer förekommer tre gånger.",
      pointsInformation: "Summan av de tärningar som förekommer tre gånger.",
    },
    givesMoreThanZeroPoints: (dices) => {
      return findNumberPresentMultipleTimes(dices, 3) !== null; // Kolla om vi har ett nummer som förekommer tre gånger.
    },
    calculatePoints: (dices) => {
      return calculateDiceStatePoints(
        possibleDiceStates.triss,
        dices,
        (dices) => {
          // Hitta det nummer som förekommer tre gånger och returnera poängen detta ger.
          return findNumberPresentMultipleTimes(dices, 3) * 3;
        }
      );
    },
  },
  fyrtal: {
    information: {
      name: "Fyrtal",
      description: "Ett nummer förekommer fyra gånger.",
      pointsInformation: "Summan av de tärningar som förekommer fyra gånger.",
    },
    givesMoreThanZeroPoints: (dices) => {
      return findNumberPresentMultipleTimes(dices, 4) !== null; // Kolla om vi har ett nummer som förekommer fyra gånger.
    },
    calculatePoints: (dices) => {
      return calculateDiceStatePoints(
        possibleDiceStates.fyrtal,
        dices,
        (dices) => {
          // Hitta det nummer som förekommer fyra gånger och returnera poängen detta ger.
          return findNumberPresentMultipleTimes(dices, 4) * 4;
        }
      );
    },
  },
  kåk: {
    information: {
      name: "Kåk",
      description:
        "Tre av tärningarna visar ett och samma tal och de övriga två visar ett annat (men samma) tal.",
      pointsInformation: "Summan av alla tärningar på brädet.",
    },
    calculatePoints: (dices) => {
      return calculateDiceStatePoints(
        possibleDiceStates.kåk,
        dices,
        (dices) => {
          return calculateSumOfDices(dices, null);
        }
      );
    },
    givesMoreThanZeroPoints: (dices) => {
      // Tre av tärningarna ska visa samma tal medan övriga två ska visa ett av samma tal.
      const numberCounts = countNumbersInArray(dices);
      const foundNumbers = Object.keys(numberCounts);
      if (foundNumbers.length === 2) {
        // Krav 1: Tärningarna ska visa två nummer
        return (
          numberCounts[foundNumbers[0]] === 3 ||
          numberCounts[foundNumbers[1]] === 3
        ); // Krav 2: 3 av tärningarna ska visa samma tal
      }
    },
  },
  liten_stege: {
    information: {
      name: "Liten stege",
      description: "Kombinationen 1-2-3-4-5 i tärningsprickar.",
      pointsInformation: "15 poäng.",
    },
    givesMoreThanZeroPoints: (dices) => {
      // Vi ska ha 1, 2, 3, 4 och 5.
      const numberCounts = countNumbersInArray(dices);
      const foundNumbers = Object.keys(numberCounts);
      if (foundNumbers.length === 5) {
        // Steg 1: 5 unika nummer.
        return !foundNumbers.includes("6"); // Steg 2: Inkluderar inte 6.
      }
    },
    calculatePoints: (dices) => {
      return calculateDiceStatePoints(
        possibleDiceStates.liten_stege,
        dices,
        (dices) => {
          return 15; // En liten stege ger alltid 15 poäng om den upptäcks.
        }
      );
    },
  },
  stor_stege: {
    information: {
      name: "Stor stege",
      description: "Kombinationen 2-3-4-5-6 i tärningsprickar.",
      pointsInformation: "20 poäng.",
    },
    givesMoreThanZeroPoints: (dices) => {
      // Vi ska ha 2, 3, 4, 5 och 6.
      const numberCounts = countNumbersInArray(dices);
      const foundNumbers = Object.keys(numberCounts);
      if (foundNumbers.length === 5) {
        // Steg 1: 5 unika nummer.
        return !foundNumbers.includes("1"); // Steg 2: Inkluderar inte 1.
      }
    },
    calculatePoints: (dices) => {
      return calculateDiceStatePoints(
        possibleDiceStates.stor_stege,
        dices,
        (dices) => {
          return 20; // En stor stege ger alltid 20 poäng om den upptäcks.
        }
      );
    },
  },
  chans: {
    information: {
      name: "Chans",
      description: "Chans kan alltid ge poäng.",
      pointsInformation: "Summan av alla tärningar på brädet.",
    },
    givesMoreThanZeroPoints: (dices) => {
      return true; // Chans kan alltid ge poäng
    },
    calculatePoints: (dices) => {
      return calculateSumOfDices(dices); // Chans är bara summan av alla tärningar och man kan alltid få det.
    },
  },
  yatzy: {
    information: {
      name: "Yatzy",
      description: "Om fem tärningar visar likadant får du Yatzy!",
      pointsInformation: "Yatzy ger alltid 50 poäng.",
    },
    givesMoreThanZeroPoints: (dices) => {
      // Yatzy fås om alla elementen i arrayen är lika.
      return countNumberInArray(dices, dices[0]) === dices.length;
    },
    calculatePoints: (dices) => {
      return calculateDiceStatePoints(
        possibleDiceStates.yatzy,
        dices,
        (dices) => {
          return 50; // Yatzy ger alltid 50 poäng om det upptäcks.
        }
      );
    },
  },
};
/**
 * Beräknar möjliga poäng för alla kategorier för en uppsättning tärningar.
 * @param {*} dices Tärningarnas nummer som poäng ska beräknas för.
 */
function calculateAllPoints(dices) {
  let points = {}; // Skapa en mapping: poängtyp --> poäng
  for (const [pointType, pointInformation] of Object.entries(
    possibleDiceStates
  )) {
    points[pointType] = {
      information: pointInformation.information, // Inkludera information om poängen.
      value: pointInformation.calculatePoints(dices),
    };
  }
  return points;
}
exports.possibleDiceStates = possibleDiceStates;
exports.calculateAllPoints = calculateAllPoints;
