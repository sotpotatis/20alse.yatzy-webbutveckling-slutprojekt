/* socket.js
Hanterar kommunikationen mellan webbklienten och servern
för multiplayer och för att spara poäng. */


function generateWebsocketResponse(status, data) {
    if (data === null) {
        data = {}
    }
    data.status = status
    return data
}
function generateSuccessResponse(data) {
    return generateWebsocketResponse(
        "success",
        data
    )
    
}
function generateErrorResponse(errorMessage, data = null) {
    if (data === null) {
        data = {}
    }
    data.errorMessage = errorMessage
    return generateWebsocketResponse(
        "error",
        data
    )
}

export default function socketHandler(socket, models) {
    socket.on("createGame", (message) => { // createGame --> efterfrågan om att starta ett spel
        console.log("Tog emot en förfrågan av att skapa ett spel.")
        const game = models.Game.create()
        console.log("Ett spel skapades!", JSON.stringify(game))
        // Skicka information till den som skapade spelet om dess ID
        message.to(socket.id, generateSuccessResponse({
            gameId: game.id
        }))
        console.log("...och information om det är ute i världsrymden!")
    })
    socket.on("joinGame", (message) => { // joinGame --> efterfrågan om att gå med i ett spel
        console.log("Tog emot en förfrågan att gå med i ett spel.")
        // Hämta detaljer från meddelandet
        const requestedGameId = message.gameId
        // Kolla om spelets ID finns
        const requestedGame = models.Game.find({
            where: { gameId: requestedGameId },
            include: [{
                model: models.Player,
                as: "players"
            }]
        })
        if (!requestedGame.hasAttr("length") || requestedGame.length < 1) {
            console.log("Kunde inte hitta ett spel.")
            message.to(socket.id, generateErrorResponse("Kunde inte hitta ett spel med det efterfrågade ID:t"))
            return
        }
        // Om vi kommer hit finns spelet. Kolla att det inte är startat
        requestedGame = requestedGame[0]
        if (requestedGame.started) {
            console.log("Spelet är redan startat.")
            message.to(socket.id, generateErrorResponse("Spelet är redan startat. Vänta tills det är klart eller starta ett nytt spel."))
            return
        }
        // Om vi har hamnat här kan spelaren gå med i spelet.
        console.log("Låter spelaren gå med i spelet...")
        const previousPlayers = requestedGame.players
        const playerNumber = previousPlayers.length + 1
        const player = models.Player.create({
            name: `Spelare ${playerNumber}`,
            playerId: socket.id,
            number: playerNumber + 1,
            isHost: playerNumber === 1, // Gör den första spelaren till "host" (dvs. att de har möjlighet att kunna starta spelet)
            gameId: requestedGame.gameId
        })
        console.log("En spelare har skapats.")
        // Bekräfta att spelaren har gått med
        message.to(socket.id, generateSuccessResponse({}))
    })
    
}