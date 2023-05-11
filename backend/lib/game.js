/* game.js
Definierar olika klasser relaterade till spelet. */
class Player {
  /**
   * Player refererar till en enskild spelare som är med i spelet
   * @param {string} id Ett unikt ID för spelaren.
   * @param {string} name Spelarens visningsnamn.
   * @param {string} token En token (hemlig nyckel) som används för att uppdatera spelarens data.
   */
  constructor(id, name, token) {
    this.data = {
      name: name,
      id: id,
    };
    this.token = token;
  }
}
class Dice {
  /**
   * Dice refererar till statusen på en enskild tärning.
   */
  constructor() {
    this.data = {
      /**
       * Om tärningen är sparad (kvarhållen) av användaren eller inte.
       */
      saved: false,
      /**
       * Tärningens aktuella nummer (mellan 1-6)
       */
      number: null,
    };
  }
}
class Throw {
  /**
   * Throw refererar till ett tärningskast under en runda (man har max tre kast på en runda)
   * @param {Player} player Ett objekt som hör till den spelare som just nu kastar.
   * @param {int} number Vilket nummer av tre det aktuella tärningskastet är.
   * @param {Dice[]} dices Lista av de tärningar som involveras i det aktuella lastet.
   */
  constructor(player, number, dices) {
    this.data = {
      player: player,
      number: number,
      dices: dices,
    };
  }
}
class Turn {
  /**
   * Play refererar till en uppsättning tärningskast av en spelare (varje spelare har max tre tärningskast per tur).
   * @param {Player} player Den spelare som turen associeras med.
   */
  constructor(player) {
    this.data = {
      /**
       * Den aktuella spelare som turen associeras med
       */
      player: player,
      /**
       * En lista av Throw-objekt för de kasten som utförts under en runda.
       */
      throws: [],
    };
  }
}
class Round {
  /**
   * En runda refererar till en "spelrunda" där varje spelare fått kasta tärningen och fått ett resultat.
   * @param {int} number Nummret som den aktuella spelrundan är.
   */
  constructor(number) {
    this.data = {
      number: number,
      turns: [],
    };
  }
}
class Game {
  /**
   * Ett Game refererar till ett helt spel som involverar flera spelomgångar.
   * @param {string} id Ett unikt ID som tilldelats spelet som gör att man också kan gå med i spelet.
   */
  constructor(id) {
    this.data = {
      id: id,
      players: [],
      rounds: [],
      scores: [],
    };
  }
}
