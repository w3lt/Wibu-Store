// This is mongodb model of Game
const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    // each game have a game id
    gameID: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    genre: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Genre'
        }],
    },
    // only one user have a specific username
    developer: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        }],
    },
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    description: String,
    release_date: Date
})

const GameModel = mongoose.model('Game', GameSchema);
exports.model = GameModel;