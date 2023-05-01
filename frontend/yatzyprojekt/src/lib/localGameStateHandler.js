/* localGameStateHandler.js
Det finns ett lokalt spelarläge. Här definierar vi de olika funktionerna för det. */
import { calculateAllPoints, possibleDiceStates } from "20alse-yatzy-shared-code";
/**
 * Genererar ett slumpmässigt nummer mellan två tal.
 * @param start Lägsta möjliga numret som ska genereras.
 * @param end Högsta möjliga numret som ska genereras.
 */
function randomNumber(start,end){
    return ~~(Math.random() * (end-start+1)) + start// (~~ är snabbare än Math.floor, se https://stackoverflow.com/a/50189413)
}
export default class LocalGameStateHandler {
    constructor(setGameState, setCurrentPlayer, setTentativePoints){
        this.setGameState = setGameState
        this.setCurrentPlayer = setCurrentPlayer
        this.setTentativePoints = setTentativePoints
        // JavaScript har ju den roliga saken att för att komma åt this i varje funktion
        // måste man ha kört .bind(this) i funktionen...
        // Här gör jag det lite enklare för mig att hålla koll på saker och ting
        // genom att binda alla funktioner med en for-loop.
        const functions = [
            "announceNewGameState",
            "announceNewCurrentPlayer",
            "generateDice",
            "generateDices",
            "prepareGameForNextPlayer",
            "createInitialGameState",
            "onDoneButtonClick",
            "onReRollButtonClick",
            "checkWin",
            "onScoreClaim"
        ]
        for (const functionToBind of functions){
            this[functionToBind] = this[functionToBind].bind(this)
        }
    }
    announceNewGameState(gameState){
        this.setGameState(gameState)
    }
    announceNewCurrentPlayer(currentPlayer){
        this.setCurrentPlayer(currentPlayer)
    }
    generateDice(){
         return {
                    number: randomNumber(1, 6),
                    saved: false
        }
    }
    generateDices(){
        let newDices = []
        for (let i=0;i<5;i++){
            newDices.push(
               this.generateDice()
            )
        }
        return newDices
    }
    prepareGameForNextPlayer(gameState, player){
        // Kolla om den aktuella spelaren är den sista spelaren
        let currentPlayerIndex;
        for (currentPlayerIndex=0;currentPlayerIndex<gameState.players.length;currentPlayerIndex++){
            if (gameState.currentPlayerName === gameState.players[currentPlayerIndex].name){ // Om den aktuella spelaren hittades
                break
            }
        }
        // Avgör nästa spelare. Om vi är sist i listan vill vi börja om från början
        const nextPlayer = currentPlayerIndex < gameState.players.length - 1 ?  gameState.players[currentPlayerIndex+1] : gameState.players[0]
        gameState.currentPlayerName = nextPlayer.name
        gameState.currentTurnNumber = 1
        gameState.isPickingScore = false
        gameState.dices = this.generateDices() // Återställ tärningar
        this.announceNewGameState(gameState)
        this.announceNewCurrentPlayer(nextPlayer)
        console.log("Spel förberett för nästa spelare.")
    }
    createInitialGameState(numberOfPlayers){
        // Skapa spelare
        let players = []
        for (let playerNumber=1;playerNumber<=numberOfPlayers;playerNumber++){
            players.push({
                name: `Spelare ${playerNumber}`,
                isOnline: true,
                scores: []
            })
        }
        let gameState = {
            gameCode: null,
            completed: false,
            currentPlayerName: players[0].name,
            dices: [],
            players: players,
            started: true,
            currentTurnNumber: 1,
            isPickingScore: false
        }
        // Lägg till tärningar
        gameState.dices = this.generateDices()
        console.log("Skapat ursprunglig spelstatus: ", gameState)
        this.announceNewGameState(gameState)
        this.announceNewCurrentPlayer(players[0])
    }
    onDoneButtonClick(gameState) {
        console.log("Beräknar poäng...")
        gameState.isPickingScore = true
        // Beräkna poäng
        let diceNumbers = []
        for (const dice of gameState.dices){
            diceNumbers.push(dice.number)
        }
        const points = calculateAllPoints(diceNumbers)
        console.log("Beräknade poäng", points)
        this.setTentativePoints(points)
        this.announceNewGameState(gameState)
    }
    onReRollButtonClick(gameState) {
        if (gameState.currentTurnNumber <= 3){ // Kolla så att användaren får kasta tärningar
            console.log("Kastar om tärningar...")
            let newDices = []
            for (const dice of gameState.dices){
                let newDice = !dice.saved ? this.generateDice() : dice // Skapa en ny tärning om den aktuella tärningen inte är låst.
                newDices.push(newDice)
            }
            gameState.dices = newDices
            gameState.currentTurnNumber += 1
            console.log("Tärningar har kastats om.")
            this.announceNewGameState(gameState)
        }
    }
    checkWin(gameState){
        for (const player of gameState.players){
            // Användaren plockar poäng som allteftersom läggs till på deras player.scores lista.
            // Om denna lista är full för alla användare har spelaren vunnit spelet.
            if (!(Object.keys(player.scores.length) === Object.keys(possibleDiceStates).length)){
                return false
            }
        }
        // Om vi kommer hit är listan full för alla användare
        return true
    }
    onScoreClaim(gameState) {
        console.log("Användaren har valt en poäng.")
    }
}
