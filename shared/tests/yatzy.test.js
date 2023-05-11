const { possibleDiceStates } = require("../gameStateCalculations.cjs");
const { randomNumber, randomNumberExcept } = require("./utils");

test("Testar att funktionen för yatzy fungerar", () => {
  // Generera fem olika nummer för yatzy
  const number = randomNumber(1, 6);
  expect(
    possibleDiceStates.yatzy.calculatePoints([
      number,
      number,
      number,
      number,
      number,
    ])
  ).toBe(50);
});
