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
            },
            currentPlayerName: { // Namnet på spelaren som just nu kastar tärningen.
                type: DataTypes.STRING,
                allowNull: false
            }
        }
    )
    // Dice refererar till statusen på en enskild tärning. Det kommer därför finnas fem stycken sådana här
    const Dice = sequelize.define("Dice", {
        saved: { // Om tärningen är låst/sparad eller inte
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
        points: { // Hur många poäng som den aktuella saken har
            type: DataTypes.INTEGER,
            allowNull: false // Om en användare inte har "claimat" en poäng så kommer den istället inte att returneras från servern.
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
            allowNull: false,
            unique: true
        },
        isOnline: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        secret: { // Hemlig kod/token som används för att autentisera användaren.
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
        // Göm användarens hemliga kod/token från början.
        {
        defaultScope: {
                attributes: {
                    exclude: "secret"
            }
        },
        scopes: {
            withSecret: {}
        }
    })
    // Definiera relationer mellan modellerna.
    // Definiera relationer angående spelare
    Game.hasMany(Player, {as: "players"})
    Player.belongsToMany(Game, { through: "GamePlayers", as: "games"}) // En spelare kan vara med i flera spel
    // Definiera relationer angående tärningar
    Game.hasMany(Dice, {as: "dices"}) // Varje kast har flera tärningar
    Dice.belongsTo(Game)
    // Definiera relationer angående poäng
    Player.hasMany(Score, {as: "scores"}) // Varje spelare har poäng
    Score.belongsTo(Player)
}