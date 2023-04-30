const { possibleDiceStates } = require("../gameStateCalculations.cjs")
const { randomNumber, randomNumberExcept } = require("./utils")
test("Testar att funktionen för kåk fungerar", () => {
    // Generera numret som ska förekomma tre gånger
    const number1 = randomNumber(1, 6)
    const number2 = randomNumberExcept(1, 6, number1)
    expect(possibleDiceStates.kåk.calculatePoints([
        number1, number1, number1, number2, number2
    ])).toBe(number1*3 + number2*2)
})