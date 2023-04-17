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

/**
 * Hjälpfunktion för att hitta ett spel med hjälp av dess ID.
 * @param {object} models Sequelize-modeller, se argumenten till funktionen socketHandler.
 * @param {string} requestedgameCode Den spelkoden för spelet som efterfrågas.
 * @param {Array} include Extra information att inkludera från modellen. Till exempel följande för att inkludera spelarna
 * som är anslutna till spelet: [{
    model: models.Player,
    as: "players"
}]
 */
function findGameById(models, requestedgameCode, include) {
    models.Game.find({
        where: { gameCode: requestedgameCode },
        include: include
    })
}
/**
 * Funktion som lägger till hanterare för alla meddelanden som skickas till socket-servern.
 * Denna funktion hanterar alltså saker såsom skapandet av nya spel, uppdaterande av spelstatus etc.
 * @param {object} socket Ett socket-objekt som fås när en Socket.IO-uppkoppling-skapas
 * @param {object} models Åtkosmt till att hantera samt komma åt Sequelize-modeller (sequelize.models) som innehåller samt definierar speldata.
 */
const socketHandlers = {
    "createGame": (message, socket, models) => { // createGame --> efterfrågan om att starta ett spel
        console.log("Tog emot en förfrågan av att skapa ett spel.")
        const game = models.Game.create()
        console.log("Ett spel skapades!", JSON.stringify(game))
        // Skicka information till den som skapade spelet om dess ID
        socket.emit("createGame", generateSuccessResponse({
            gameCode: game.id
        }))
        console.log("...och information om det är ute i världsrymden!")
    },
    "joinGame": (message, socket, models) => { // joinGame --> efterfrågan om att gå med i ett spel
        console.log("Tog emot en förfrågan att gå med i ett spel.")
        // Hämta detaljer från meddelandet
        const requestedgameCode = message.gameCode
        // Kolla om spelets ID finns
        const requestedGame = findGameById(models, requestedgameCode, [{
            model: models.Player,
            as: "players"
        }])
        if (!requestedGame.hasAttr("length") || requestedGame.length < 1) {
            console.log("Kunde inte hitta ett spel.")
            socket.emit("joinGame", generateErrorResponse("Kunde inte hitta ett spel med det efterfrågade ID:t"))
            return
        }
        // Om vi kommer hit finns spelet. Kolla att det inte är startat
        requestedGame = requestedGame[0]
        if (requestedGame.started) {
            console.log("Spelet är redan startat.")
            socket.emit("joinGame", generateErrorResponse("Spelet är redan startat. Vänta tills det är klart eller starta ett nytt spel."))
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
            gameCode: requestedGame.gameCode
        })
        console.log("En spelare har skapats.")
        // Bekräfta att spelaren har gått med
        socket.emit("joinGame", generateSuccessResponse({}))
    },
    "gameInfo": (message, socket, models) => { // gameInfo --> hämta information om ett spel
        console.log("Skickar information om ett spel från servern...")
        const requestedgameCode = message.gameCode
        const requestedGame = findGameById(models, requestedgameCode, [])
        console.log(`Spelinformation: ${requestedGame}.`)
    }
}
/**
 * För att socket-servern inte ska krascha om ett enda kommando kraschar en gång så vill vi ha en funktion
 * som implementerar felhantering. 
 * @param {*} handler Funktionen som efterfrågas.
 * @param {*} socket Ett socket-objekt för den aktuella uppkopplingen.
 * @param {*} message Meddelandet som togs emot.
 * @param {object} models Åtkomst till sequelize-modeller för det aktuella spelet.
 */
function runSocketHandlerWithErrorHandling(handler, message, socket, models) {
   // Dubbelkolla att efterfrågad handler existerar
    if (!Object.keys(socketHandlers).includes(handler)) {
        console.warn(`Okänd/oregistrerad hanterare ${socketHandler} efterfrågades.`)
        socket.emit(handler, generateErrorResponse(
            "Odefinierad hanterare efterfrågad."
        ))
    }
    try {
        // Kör hanterare för att skicka ett svar för meddelande
        socketHandlers[handler](message, socket, models)
    }
    catch (e) {
        console.warn(`Fångade upp ett ohanterat fel i ${handler}: ${e}`)
        // Skicka ut ett felmeddelande
        socket.emit(handler, generateErrorResponse(
            `Ett internt serverfel inträffade. (förfrågan: ${handler})`
        ))
    }
}
export default function socketHandler(socket, models) {
    // Registrera alla hanterare, se dokumentation ovan för felhantering etc.
    for (const handlerName of Object.keys(socketHandlers)) {
        socket.on(handlerName, (message) => {
            runSocketHandlerWithErrorHandling(
                handlerName, message, socket, models
            )
        })
    }
}