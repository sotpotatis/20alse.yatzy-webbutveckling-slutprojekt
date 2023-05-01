const { possibleDiceStates } = require("../gameStateCalculations.cjs")
test("Testar att funktionen för liten stege fungerar", () => {
    expect(possibleDiceStates.stor_stege.calculatePoints(
        [6,3,2,5,4]
    )).toBe(20)
})