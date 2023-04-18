/*models.js
För att hantera multiplayer så sparas data för att hålla koll på spelet.
Jag använder biblioteket Sequelize för att få en flexibel lösning för att kunna hämta in data
*/
import { Sequelize, DataTypes, Model } from "sequelize";
export default function defineModels(sequelize) {
    /* Initierar alla modeller. */
    // Ett Game refererar till ett helt spel som involverar flera spelomgångar.
    const Game = sequelize.define(
        "Game", {
            gameCode: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            completed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            started: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        }
    )
    // En runda refererar till en "spelrunda" där varje spelare fått kasta tärningen och fått ett resultat. 
    const Round = sequelize.define(
        "Round", {
            number: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }
    )
    // En tur refererar till en uppsättning tärningskast av en spelare (varje spelare har max tre tärningskast per tur).
    const Turn = sequelize.define(
        "Turn", {
            ownedBy: { // Spelarens ID som kör den aktuella turen
                type: DataTypes.STRING,
                allowNull: false
            },
            startedAt: { // Vilken tid en tur startades
                type: DataTypes.DATE,
                default: DataTypes.NOW
            }
        }
    )
    // Throw refererar till ett tärningskast under en runda (man har max tre kast på en runda)
    const Throw = sequelize.define(
        "Throw", {
            number: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }
    )
    // Dice refererar till statusen på en enskild tärning. Det kommer därför finnas sex stycken sådana här per Throw.
    const Dice = sequelize.define("Dice", {
        saved: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    // Score refererar till en poäng man kan få, till exempel stege, tvåtal, tretal
    const Score = sequelize.define("Score", {
        scoreType: {
            type: DataTypes.STRING,
            validate: {
                is: /ettor|tvåor|treor|fyror|femmor|sexor|bonus|par|två_par|triss|fyrtal|kåk|liten_stege|stor_stege|chans|yatzy/
            }
        },
        point: { // Hur många poäng som den aktuella koden har
            type: DataTypes.INTEGER,
            allowNull: false
        },
        number: { // Man kan ha få varje sak i sin tabell flera gånger
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    // Player refererar till en enskild spelare som är uppkopplad till plattformen.
    const Player = sequelize.define("Player", {
        playerId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isHost: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    })
    // Definiera relationer mellan modellerna.
    Game.hasMany(Round, {as: "rounds"}) // Ett spel har flera rundor
    Round.belongsTo(Game, {"foreignKey": "isIngameCode", as: "round"})
    Game.hasMany(Player, {as: "players"}) // ...och flera spelare!
    Player.belongsTo(Game, { foreignKey: "playerRound", as: "player" })
    Round.hasMany(Turn, {as: "turns"}) // Varje runda har flera turer
    Turn.belongsTo(Round, {"foreignKey": "isInRoundId", as: "turn"})
    Turn.hasMany(Throw, {as: "throws"}) // Varje tur har flera kast
    Throw.belongsTo(Turn, {"foreignKey": "isInTurnId", as: "throw"})
    Throw.hasMany(Dice, {as: "dices"}) // Varje kast har flera tärningar
    Dice.belongsTo(Throw, { "foreignKey": "isInThrowId", as: "dice" })
    Player.hasMany(Score, {as: "scores"}) // Varje spelare har poäng
    Score.belongsTo(Player,  {"foreignKey": "isForPlayerId", as: "score" }) 
}