const { possibleDiceStates } = require("../gameStateCalculations")
const { randomNumber, randomNumberExcept } = require("./utils")

test("Testar att funktionen för chans fungerar", () => {
    // Generera fem olika nummer för chans
        let numbers = []
        let numberSum = 0
        for (let i = 0; i < 6; i++){
            const number = randomNumber(1,6)
            numbers.push(number)
            numberSum += number
        }
        
    expect(possibleDiceStates.chans.calculatePoints(numbers)).toBe(
        numberSum
    )
})