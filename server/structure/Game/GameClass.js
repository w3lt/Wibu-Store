const gameModel = require("./dbModel").model;

class Game {
    // private fields
    #gameID;
    #title;
    #genre;
    #developer;
    #publisher;
    #description;
    #release_date;

    constructor(gameID, title, genre, developer, publisher, description, release_date) {
        this.#gameID = gameID;
        this.#title = title;
        this.#genre = genre;
        this.#developer = developer;
        this.#publisher = publisher;
        this.#description = description;
        this.#release_date = release_date;
    }
}