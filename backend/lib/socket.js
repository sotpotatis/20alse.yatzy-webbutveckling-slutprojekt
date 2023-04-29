/* socket.js
Hanterar kommunikationen mellan webbklienten och servern
för multiplayer och för att spara poäng. */


import {nanoid} from "nanoid";
import { calculateAllPoints, possibleDiceStates } from "yatzy-shared-code";
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
@param {function} callback En callback-funktion som exekveras när spelare har hittats.
 */
function findGameById(models, requestedgameCode, include, callback) {
    models.Game.findAll({
        where: { gameCode: requestedgameCode },
        include: include
    }).then((data)=>{
        console.log(`Tog emot data om spel:`, data)
        if (data.hasOwnProperty("length") && data.length > 0){
            console.log("Skickar vidare första möjliga spel till callback.")
            callback(data[0])
        }
        else {
            console.log("Inget spel hittades. Talar om detta för callbacken.")
            callback(null)
        }
    }).catch((error)=>{
        console.log(`Ett fel uppstod när vi letade efter spel: ${error}. Talar om detta för callbacken.`)
        callback(null)
    })
}
/**
 * Hjälpfunktion för att hitta en spelare med hjälp av dess namn.
 * @param {object} models Sequelize-modeller, se argumenten till funktionen socketHandler.
 * @param {string} playerName Den spelkoden för spelet som efterfrågas.
 * @param {Array} include Extra information att inkludera från modellen. Till exempel följande för att inkludera poängen
för spelaren [{
    model: models.Scpre,
    as: "scores"
}]
@param {function} callback En callback-funktion som exekveras när spelare har hittats.
 */
function findPlayerByName(models, playerName, include, callback) {
    models.Player.findAll({
        where: { name: playerName },
        include: include
    }).then((data)=>{
        console.log(`Tog emot data om spelare:`, data)
        if (data.hasOwnProperty("length") && data.length > 0){
            console.log("Skickar vidare första möjliga spelare till callback.")
            callback(data[0])
        }
        else {
            console.log("Ingen spelare hittades. Talar om detta för callbacken.")
            callback(null)
        }
    }).catch((error)=>{
        console.log(`Ett fel uppstod när vi letade efter en spelare: ${error}. Talar om detta för callbacken.`)
        callback(null)
    })
}

/**
 * För att möjliggöra multiplayer där man kan gå med och sedan spela som önskad spelare så måste vi implementera någon
 * form av autentisering. Vi gör detta genom att ge användaren en unik "secretKey" som är en textsträng som genereras av servern.
 * Denna används för att kunna återansluta om sidan laddas om och sparas i användarens lokala webbläsarlagring ("local storage")
 * @param {object} models Sequelize-modeller, se argumenten till funktionen socketHandler.
 * @param secretKey Användarens hemliga nyckel som används för autentisering
 * @param callback Funktion som tar emot en lista i formatet [autentisering ok, spelardata on autentisering är ok (annars null)].
 */
function validatePlayerAuthorization(models, secretKey, callback){
    console.log("Validerar autentisering för en spelare...")
    const playerNotAuthenticated = [false, null] // Svar att returnera ifall spelaren inte är autentiserad
    // Försök att hitta spelaren
    models.Player.scope("withSecret").findAll({where: {secret: secretKey}}).then((data)=>{
        if (data !== null && data.length > 0){
            console.log("Hittade en spelare som matchar efterfrågad autentisering.")
            const foundPlayer = data[0]
            callback([true, foundPlayer])
        }
        else {
            console.warn(`Ingen spelare hittades för en försökt autentisering med ${secretKey}!`)
            callback(playerNotAuthenticated)
        }
    }).catch((error)=>{
        console.warn(`Misslyckades att hitta en spelare: ${error}.`)
        callback(playerNotAuthenticated)
    })
}

/**
 * Genererar ett slumpmässigt nummer mellan två tal.
 * @param start Lägsta möjliga numret som ska genereras.
 * @param end Högsta möjliga numret som ska genereras.
 */
function randomNumber(start,end){
    return ~~(Math.random() * (end-start+1)) + start// (~~ är snabbare än Math.floor, se https://stackoverflow.com/a/50189413)
}
/**
 * Genererar ett roligt spelarnamn.
 * @param models {object} models Sequelize-modeller, se argumenten till funktionen socketHandler.
 * @param callback En callback-funktion som ska ta emot spelarnamnet.
 */
function generatePlayerName(models, callback){
    // Ett spelarnamn baseras på adjektiv och adjektiv/substantiv.
    const nameBeginnings = [
        "Knasig",
        "Cool",
        "Toppen",
        "Perfekt",
        "Fåfäng",
        "Dansande",
        "Noggrann",
        "Snygg"
    ]
    const nameEndings = [
        "Knasboll",
        "Fåntratt",
        "Gymnast",
        "Kompis",
        "Spelare",
        "Kock",
        "Gamer",
        "Vinnare",
        "Förlorare"
    ]
    const randomItemFromArray = (array)=>{ // Definiera en genväg till att ta en slumpmässig sak från en array
        return array[~~(randomNumber(0, array.length))] // (~~ är snabbare än Math.floor, se https://stackoverflow.com/a/50189413)
    }
    const playerName = randomItemFromArray(nameBeginnings) + randomItemFromArray(nameEndings) + ~~(Math.random() * (99-10)) + 10
    // Dubbelkolla att spelarnamnet är unikt
    models.Player.findAll({
    where: {name: playerName}
    }).then(
        (data)=>{
            if (data !== null && data.length>0){
                console.log(`Gör om namngenerering: spelarnamnet ${playerName} har redan skapats...`)
                generatePlayerName(models, callback) // Kör funktionen igen.
            }
            else {
                callback(playerName)
            }
        }
    )
}
/**
 * Funktion för att skicka en statusuppdatering om spelets aktuella status till alla som är uppkopplade på spelservern.
 * En statusuppdatering kan skickas till exempel när en ny spelare går med.
 * @param {object} models Sequelize-modeller, se argumenten till funktionen socketHandler.
 * @param {string} requestedGameCode Den spelkoden för spelet som efterfrågas.
 * @param socket
 */
function sendGameStateUpdate(models, requestedGameCode, socket){
    findGameById(models, requestedGameCode, [{
        model: models.Player,
        as: "players",
    }, {
        model: models.Round,
        as: "rounds",
    }],
        (game)=>{
        if (game !== null){
            console.log(`Skickar speluppdatering för spel ${game.gameCode}...`)
            socket.to(requestedGameCode.toString()).emit("gameUpdate", generateSuccessResponse({
                gameData: game
            }))
            console.log("Meddelande skickat.")
        }
        else {
            console.warn("Oväntat: spelet som efterfrågade en uppdatering verkar inte existera.")
            socket.to(requestedGameCode.toString()).emit("gameUpdate", generateErrorResponse("Spelet verkar inte längre existera."))
        }
        })
}
/**
 * Funktion som lägger till hanterare för alla meddelanden som skickas till socket-servern.
 * Denna funktion hanterar alltså saker såsom skapandet av nya spel, uppdaterande av spelstatus etc.
 * @param {object} socket Ett socket-objekt som fås när en Socket.IO-uppkoppling-skapas
 * @param {object} models Åtkosmt till att hantera samt komma åt Sequelize-modeller (sequelize.models) som innehåller samt definierar speldata.
 */
const socketHandlers = {
    "createGame": (message, socket, models) => { // createGame --> efterfrågan om att skapa ett spel
        console.log("Tog emot en förfrågan av att skapa ett spel.")
        const game = models.Game.build()
        game.save().then(()=>{
            console.log("Ett spel skapades!", game)
        // Skicka information till den som skapade spelet om dess ID
        socket.emit("createGame", generateSuccessResponse({
            gameCode: game.gameCode
        }))
        console.log("...och information om det är ute i världsrymden!")
        }).catch((exception)=>{
            console.warn(`Ett fel inträffade när ett spel skapades: ${exception}`)
            socket.emit("createGame", generateErrorResponse("Internt serverfel."))
        })

    },
    "joinGame": (message, socket, models) => { // joinGame --> efterfrågan om att gå med i ett spel
        if (message.action === "newPlayer"){
            console.log("Tog emot en förfrågan att gå med i ett spel.")
            // Hämta detaljer från meddelandet
            const requestedgameCode = message.gameCode
            // Kolla om spelets ID finns
            findGameById(models, requestedgameCode, [{
                model: models.Player,
                as: "players",
            }],(game)=> {
            console.log("Hittat spel: " + JSON.stringify(game))
            if (game === null) {
                console.log("Kunde inte hitta ett spel.")
                socket.emit("joinGame", generateErrorResponse("Kunde inte hitta ett spel med det efterfrågade ID:t"))
                return
            }
            // Om vi kommer hit finns spelet. Kolla att det inte är startat
            if (game.started) {
                console.log("Spelet är redan startat.")
                socket.emit("joinGame", generateErrorResponse("Spelet är redan startat. Vänta tills det är klart eller starta ett nytt spel."))
                return
            }
            // Skapa en funktion för att lägga en till ny spelare till spelet.
            const addPlayer = (player) => {
                console.log("Lägger till spelare...")
                const afterPlayerWasAdded = ()=>{ // Funktion att köra när en spelare lagts till.
                    console.log("En spelare har lagts till i spelet.")
                    // Låt spelaren gå med i ett rum/kommunikationskanal kopplat till spelet.
                    socket.join(game.gameCode.toString())
                    console.log(`Användaren gick med i spelet och i rummet ${game.gameCode.toString()}.`)
                    // Bekräfta att spelaren har gått med spelaren själv.
                    socket.emit("joinGame", generateSuccessResponse({player: player}))
                    // Bekräfta att spelaren har gått med för hela rummet.
                    sendGameStateUpdate(models, game.gameCode, socket)
                }
                // Om användaren inte redan är med i spelet, anslut hen
                let previousPlayerNames = []
                for (const previousPlayer of previousPlayerNames){
                    previousPlayerNames.push(previousPlayer.name)
                }
                if (!previousPlayerNames.includes(player.name)){
                    console.log("Spelaren ska läggas till som en ny spelare i spelet.")
                    game.addPlayer(player).then(afterPlayerWasAdded).catch((error)=>{
                    console.warn(`Ett fel inträffade när en spelare skulle läggas till: ${error}`)
                    socket.emit("joinGame", generateErrorResponse("Ett internt serverfel inträffade. Var vänlig och försök igen senare."))
                    })
                }
                else {
                    console.log("Spelaren ska återansluta till spelet.")
                    afterPlayerWasAdded()
                }
            }
            // Kolla autentisering. Det är möjligt att användaren har loggat in som en tidigare användare.
            // Om vi har hamnat här kan spelaren gå med i spelet.
            console.log("Låter spelaren gå med i spelet...")
            if (socket.handshake.auth.token !== undefined){
                console.log("Autentisering specificerades i uppkopplingen.")
                // Validera autentisiering
                validatePlayerAuthorization(models, socket.handshake.auth.token, ([validAuthentication, player])=>{
                    if (!validAuthentication){
                        console.warn(`Uppkoppling till servern med en tidigare token tilläts inte. Skickar fel...`)
                        socket.emit("joinGame", generateErrorResponse("Ett fel inträffade vid autentisering till servern. Testa att rensa dina cookies!"))
                    }
                    else {
                        console.log("En förautentiserad användare hittades.")
                        addPlayer(player) // Lägg till spelaren i spelet.
                    }
                })
            }
            else {
                console.log("Ingen autentisering specificerades i uppkopplingen. Skapar en ny spelare...")
                const previousPlayers = game.players || 0
                const playerNumber = previousPlayers.length + 1
                const gameCode = game.gameCode
                generatePlayerName(models,(name)=>{
                    console.log(`Skapar en spelare med namn: ${name}`)
                    models.Player.create({
                    name: name,
                    playerId: socket.id,
                    secret: nanoid(),
                    gameGameCode: gameCode
                    }).then(addPlayer)
                })
            }
            })
        }

    },
    "gameInfo": (message, socket, models) => { // gameInfo --> hämta information om ett spel
        console.log("Skickar information om ett spel från servern...")
        const requestedgameCode = message.gameCode
        findGameById(models, requestedgameCode, [{
                model: models.Player,
                as: "players",
            }], (requestedGame)=>{
            console.log(`Spelinformation: ${requestedGame}.`)
            // Vi får null tillbaka om inget spel kunde hittas.
            if (requestedGame !== null){ // Om ett spel kunde hittas
                socket.emit("gameInfo", generateSuccessResponse({
                    gameInfo: requestedGame
                }))
            }
            else { // Om inget spel med efterfrågat ID kunde hittas.
                socket.emit("gameInfo", generateErrorResponse("Det spel du försöker gå med i kunde inte hittas.", {
                    errorType: "gameNotFound"
                }))
            }
        })
    },
    "disconnect": (message, socket, models)=>{
        console.log("En klient kopplade bort från servern. Kollar om användaren är med i något aktivt spel.")
        // Sök efter spelare kopplat till klienten. Ta bort spelaren från ett aktivt spel ifall den är med där.
        models.Player.findAll(
            {
                where: {playerId: socket.id},
                include: [{
                  model: models.Game,
                  as: "games"
                }]
            }
        ).then((playerResult)=>{
            if (playerResult !== null && playerResult.length > 0){
                const player = playerResult[0] // Hämta den hittade spelaren
                console.log(`Spelaren är med i ${player.games.length} spel.`)
                for (const game of player.games){
                    game.removePlayer(player).then(()=>{
                        console.log("Tog bort en spelare från ett spel.")
                        sendGameStateUpdate(models, game.gameCode.toString(), socket) // Uppdatera spelet om detta
                    })
                }
            }
            else {
                console.warn(`Hittade ingen spelare med ID: ${socket.id}.`)
            }

        }).catch((error)=>{
            console.warn(`Misslyckades med att ta bort en nedkopplad spelare från ett spel ${error}.`)
        })
    },
    "startGame": (message, socket, models)=>{ // Starta ett spel
        console.log("Tog emot en förfrågan om att starta ett spel!")
        findGameById(models, message.gameCode, [{
            model: models.Player,
            as: "players",
        },
        {
            model: models.Dice,
            as: "dices"
        }], (game)=>{
            if (game === null) {
                console.log("Kunde inte hitta ett spel.")
                socket.emit("startGame", generateErrorResponse("Kunde inte hitta ett spel med det efterfrågade ID:t"))
                return
            }
            // Om vi kommer hit finns spelet. Kolla att det inte är startat
            if (game.started) {
                socket.emit("startGame", generateErrorResponse("Spelet är redan startat."))
            }
            // Om vi kommer hit är allting redo så att säga!
            game.started = true
            game.save().then(()=>{
                console.log("Spelet har startats. Meddelar alla anslutna...")
                socket.to(game.gameCode.toString()).emit("startGame", generateSuccessResponse({
                    gameStarted: true
                }))
                // NU är det dags att börja köra själva spelet. Vi börjar alltså här.
                // Skapa lite hjälpfunktioner
                /**
                 * Hämtar vilken spelare som står på tur härnäst
                 * @return {*} Nästa spelare som ska spela
                 */
                function getNextPlayer(){
                    console.log("Hittar nästa användare som ska spela...")
                    let currentPlayerIndex = 0
                    for(currentPlayerIndex = 0;currentPlayerIndex<game.players.length;currentPlayerIndex++){
                        if (player.name === game.currentPlayerName){
                            break
                        }
                    }
                    // Hitta nästa spelare
                    if (currentPlayerIndex<game.players.length-1){
                        return game.players[currentPlayerIndex+1]
                    }
                    else { // (om vi har kommit till slutet av listan vill vi börja om från början
                        return game.players[0]
                    }
                }
                // Väntar tills alla tärningar har uppdaterats och kallar sedan en funktion
                /**
                 * Möjliggör att uppdatera tärningar och vänta tills alla tärningars status har uppdaterats i databasen.
                 * Inkluderar en timeout på 20 sekunder för alla uppdateringar.
                 * @param dices En lista på alla tärningar som ska uppdateras
                 * @param updateFunction En funktion som ska köras på varje tärning. Ska returnera tärningens uppdaterade status
                 * @param callback En callback som ska köras när alla tärningar har uppdaterats.
                 */
                function waitForDiceUpdate(dices, updateFunction, callback){
                    let numberOfDiceUpdated = 0 // Vi behöver en counter då funktionen kör async. Hade varit lite snyggare om jag gjort alla funktioner här async.
                    // men det finns ju alltid något som kan förbättras.
                    for (const dice of dices){
                        const updatedDice = updateFunction(dice) // updateFunction passas som argument och specificerar vad som ska uppdateras på tärningen
                        updatedDice.update().then(()=>{ // Efter varje tärning uppdaterats, uppdatera nästa tärning.
                        numberOfDiceUpdated += 1
                    })
                    }
                    // Vänta tills alla tärningar har uppdaterats och skicka sedan ett uppdaterat "gameState"
                    console.log("Väntar tills alla tärningar har uppdaterats...")
                    let secondsElapsed = 0
                    const interval = setInterval(()=>{
                        if (numberOfDiceUpdated < dices.length){
                            console.log(`Väntar fortfarande på tärningsuppdateringar...`)
                            if (secondsElapsed > 20){
                                console.log("Timeout nådd. Skickar felmeddelande.")
                                generateErrorResponse("Timeout nåddes vid databasuppkoppling. Vänligen försök igen lite senare")
                            }
                        }
                        else {
                            clearInterval(interval) // Ta bort kontrollen och gå vidare
                            callback()
                        }
                    }, 100) // Kolla var 0.1 sekund
                }
                /** Förbereder spelplanen för en ny spelare.
                 * @param newPlayerName Spelarens nya namn.
                 * @param callback En callback som ska köras när alla aktuella saker har uppdaterats i databasen.
                 */
                function prepareForPlayer(newPlayerName, callback){
                    console.log("Förbereder för en ny spelare...")
                    game.currentPlayerName = newPlayerName // Uppdatera den aktuella spelarens namn.
                    game.update().then(()=>{
                        // Återställ varje tärning
                        waitForDiceUpdate(game.dices, (dice)=>{dice.saved=false;return dice}, ()=>{
                            console.log("Alla tärningar har uppdaterats och spelet är nu redo för nästa spelare.")
                            callback()
                        })
                    })
                }
                /**Genererar slumpmässiga nummer på tärningarna i spelet
                 * @param callback En funktion som ska köras efter att numrena genererats klart.
                 */
                function generateDiceNumbers(callback){
                    console.log("Genererar nummer på tärningarna....")
                    waitForDiceUpdate(game.dices, (dice)=>{
                        dice.number = randomNumber(1, 6)
                    }, ()=>{
                        console.log("Numret på alla tärningar har uppdaterats.")
                        callback()
                    })
                }
                /**
                 * Uppdaterar poängen för den aktuella användaren som spelar spelet.
                 * @param typeOfPoint Typen av poäng som användaren vill uppdatera. Till exempel "ettor" för att
                 * uppdatera poängen för användarens ettor.
                 * @param callback En funktion som ska köra när användarens poäng uppdaterats.
                 */
                function updateUserScore(typeOfPoint, callback){
                    console.log("Uppdaterar poäng för den aktuella användaren...")
                    let diceNumbers = [] // Skapa en lista som endast innehåller tärningarnas nummer
                    for (const dice of game.dices){
                        diceNumbers.push(dice.number)
                    }
                    // Kör funktion för att hitta poäng för alla tärningar
                    const possiblePoints = calculateAllPoints(dices)
                    // Kolla att användaren inte har plockat denna poäng innan
                    findPlayerByName(models, game.currentPlayerName, [{model: models.Score, "as": "scores"}], (player)=>{
                        if (player !== null){
                            let previouslyClaimedScores = [] // Skapa en lista med alla tidigare scores som claimats.
                            for (const score of player.scores){
                                previouslyClaimedScores.push(score.scoreType)
                            }
                            if (previouslyClaimedScores.includes(typeOfPoint)){
                                console.warn(`Den aktuella spelaren verkar redan ha plockat poängen ${typeOfPoint}.`)
                                console.log("Spelplanen kommer inte att uppdateras.")
                                callback()
                            }
                            else {
                                console.log("Uppdaterar poäng...")
                                const newScore = models.Score.build({
                                    scoreType: typeOfPoint,
                                    score: possiblePoints[typeOfPoint].value
                                })
                                player.addScore(newScore).then(callback)
                            }
                        }
                    })
                }
                /**
                 * Uppdaterar spelrundan.
                 * @param {*} onScorePick Funktion som körs när användaren valt sin poäng. 
                 */
                function updateRound(onScorePick){
                    console.log("Väljer ut en användare som ska spela...")
                    const nextPlayer = getNextPlayer()
                    prepareForPlayer(nextPlayer, ()=>{
                        console.log("Spelplanen har förberetts.")
                        // Skicka uppdaterat gameState
                        console.log("Skickar ett uppdaterat gameState...")
                        sendGameStateUpdate(models, game.gameCode, socket)
                        console.log("gameState uppdaterad.")
                        // Lyssna efter förfrågan att kasta tärningar
                        socket.on("diceRoll", (message)=>{
                            console.log("Tog emot en förfrågan att kasta en tärning. Validerar att den kommer från den aktuella användaren...")
                            findPlayerByName(models, game.currentPlayerName, [],(player)=>{ // Hitta den aktuella spelaren i spelet
                                if (player.playerId === socket.id){
                                    // Kasta tärningarna
                                    generateDiceNumbers(()=>{
                                        console.log("Tärningarna har kastats och spelaren har underrättats.")
                                        sendGameStateUpdate(models, game.gameCode, socket)
                                    })
                                }
                                else {
                                    console.warn(`Tog emot förfrågan att kasta tärningen från en användare som just nu inte ska få kasta tärningen: ${player.playerId}!=${socket.id}.`)
                                    // Skicka felmeddelande
                                    socket.emit("diceRoll", generateErrorResponse("Det är inte din tur. Om du inte har försökt att hacka spelet är det något fel i min kod. Försök igen lite senare."))
                                }

                        })  
                        })
                        // Lyssna efter förfrågan att skriva in sin poäng
                        socket.on("pickScore", (message)=>{
                            console.log("Tog emot en förfrågan om att skriva in poäng.")
                            // Vilken poäng som man ska uppdatera finns i message.requestedScoreType.
                            if (message.requestedScoreType === undefined || !Object.keys(possibleDiceStates).includes(message.requestedScoreType)){
                                console.warn(`Tog emot felaktig förfrågan angående att välja att spara en poäng (efterfrågad poängtyp: ${message.requestedScoreType}).`)
                                socket.emit("pickScore", generateErrorResponse("Felaktigt meddelandeformat. Om du inte försökt att hacka eller manipulera spelet är det något fel i min kod. Försök igen lite senare."))
                                return
                            }
                            updateUserScore(message.requestedScoreType, ()=>{
                                socket.emit("pickScore", {message: "Poängen har uppdaterats"})
                            })
                        })
                    })
                }
                /**
                 * Kollar om spelet har tagit slut
                 */
                function detectGameEnd() {
                    for (const player of game.players) {
                        for (const score of player.scores) {
                            if (!score.length === Object.keys(possibleDiceStates).length) { // Om användaren inte plockat alla poäng än
                                return false // Returnera false.
                            }
                        }
                    }
                    return true // Om vi kommer hit så har spelet tagit slut!
                }
                
                // Dags att börja spela!
                const runGame = runGameRound(() => { // Skapa en rekursiv funktion som kör spelet.
                    if (detectGameEnd()) {
                        console.log("Spelet är slut!")
                        // Uppdatera att spelet tagit slut.
                        game.completed = true
                        game.update().then(() => { // Uppdatera i databasen
                            console.log("Spelet har uppdaterats som slut i databasen. Skickar status...")
                            sendGameStateUpdate(models, game.gameCode, socket) // Skicka uppdaterad gameState.
                        })
                    }
                    else {
                        console.log("Spelet är inte slut. Kör spelrunda igen...")
                        updateRound(() => {
                            runGame() // Kör denna funktion igen när användaren har valt sina poäng.
                        })
                    }
                })

            }).catch((error)=>{
                console.warn(`Ett fel inträffade när spelet skulle startas: ${e}`)
                socket.emit("startGame", generateErrorResponse("Ett internt serverfel inträffade. Testa att komma tillbaka lite senare."))
            })
        }
        
        )
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