const { possibleDiceStates } = require("../gameStateCalculations.cjs")
test("Testar att funktionen för liten stege fungerar", () => {
    expect(possibleDiceStates.liten_stege.calculatePoints(
        [5,3,2,1,4]
    )).toBe(15)
})