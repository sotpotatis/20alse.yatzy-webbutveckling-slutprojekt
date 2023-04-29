/* par.test.js
Testar att funktionerna för par och fungerar.
 */
const { possibleDiceStates } = require("../gameStateCalculations")
const { randomNumber, randomNumberExcept } = require("./utils")
test("Testar att funktionen för triss fungerar", () => {
    const number = randomNumber(1, 6) // Genererar numret som ska förekomma i par
    expect(possibleDiceStates.triss.calculatePoints(
        [
            number,
            number,
            number,
            randomNumberExcept(1, 6, number),
            randomNumberExcept(1, 6, number),
            randomNumberExcept(1, 6, number)
        ]
    )).toBe(number*3)
})
test("Testar att funktionen för fyrtal fungerar", () => {
    const number = randomNumber(1, 6) // Genererar numret som ska förekomma i par
    expect(possibleDiceStates.fyrtal.calculatePoints(
        [
            number,
            number,
            number,
            number,
            randomNumberExcept(1, 6, number)
        ]
    )).toBe(number*4)
})