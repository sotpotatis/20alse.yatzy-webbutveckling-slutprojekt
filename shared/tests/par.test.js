/* par.test.js
Testar att funktionerna för par och fungerar.
 */
const { possibleDiceStates } = require("../gameStateCalculations")
const { randomNumber, randomNumberExcept } = require("./utils")
test("Testar att funktionen för par fungerar", () => {
    const number = randomNumber(1, 6) // Genererar numret som ska förekomma i par
    expect(possibleDiceStates.par.calculatePoints(
        [
            number,
            number,
            randomNumberExcept(1, 6, number),
            randomNumberExcept(1, 6, number),
            randomNumberExcept(1, 6, number)
        ]
    )).toBe(number*2)
})
test("Testar att funktionen för två par fungerar", () => {
    // Genererar numrena som ska förekomma i par
    const number1 = randomNumber(1, 6)
    const number2 = randomNumberExcept(1, 6, number1)
    expect(possibleDiceStates.par.calculatePoints(
        [
            number1,
            number2,
            number1,
            number2,
            randomNumberExcept(1, 6, [number1, number2])
        ]
    )).toBe(number1*2 + number2*2)
})