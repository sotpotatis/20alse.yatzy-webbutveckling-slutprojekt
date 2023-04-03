import MultiplayerServerClient from "./multiplayerServerClient"

/* gameStateHandler.js
GameStateHandler är en hjälparklass för spelstatus. Den används för att ge webbläsaren aktuell information om det nuvarande
spelet. Beroende på spelläge (singleplater eller multiplayer) så kan denna information inhämtas lokalt eller från en webbserver. */
class MultiplayerGameInformation {
    /**
     * Innehåller information om ett multiplayerspel.
     * @param {string} gameCode Spelets kod
     * @param {MultiplayerServerClient} multiplayerConnectionHandler En hanterare som kan hantera uppkoppling till servern.
     */
    constructor(gameCode, multiplayerConnectionHandler){
        this.gameCode = gameCode
        this.multiplayerConnectionHandler = multiplayerConnectionHandler
    }
}
export default class GameStateHandler {
    /**
     * Hanterare för att själva spelet. 
     * @param {MultiplayerGameInformation} multiplayerInformation Information om spelet ifall det är ett flerspelarspel.
     */
    constructor(multiplayerInformation=null){
        this.multiplayerInformation = multiplayerInformation
        this.isMultiplayer = multiplayerInformation !== null
    }
}