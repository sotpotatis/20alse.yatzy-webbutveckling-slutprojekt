const { possibleDiceStates } = require("../gameStateCalculations")
test("Testar att funktionen för liten stege fungerar", () => {
    expect(possibleDiceStates.liten_stege.calculatePoints(
        [6,3,2,5,4]
    )).toBe(15)
})