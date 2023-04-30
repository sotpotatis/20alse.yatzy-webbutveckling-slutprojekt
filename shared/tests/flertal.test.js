/* flertal.test.js
Testar att funktioner relaterade till flertal fungerar.
*/
const { possibleDiceStates } = require("../gameStateCalculations.cjs")
const { randomNumberExcept } = require("./utils")
const functionsToTest = [
    "ettor",
    "tvåor",
    "treor",
    "fyror",
    "femmor",
    "sexor"
]
// Definera de olika funktionerna som testar
for (let i = 0; i < functionsToTest.length; i++){
    const functionNameToTest = functionsToTest[i]
    const functionToTest = possibleDiceStates[functionNameToTest].calculatePoints
    const number = i + 1
    test(`Testar att funktionen ${functionNameToTest} fungerar`, () => {
        expect(functionToTest([number, number, number, randomNumberExcept(1, 6, number), randomNumberExcept(1, 6, number)])).toBe(number * 3)
    })
}