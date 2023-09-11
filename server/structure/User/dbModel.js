// This is mongodb model of User
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uid: {
        type: String,
        unique: true,
        required: true
    },
    // each user is identified by UID
    email: {
        type: String,
        unique: true,
        required: true
    },
    // only one user have a specific email
    username: {
        type: String,
        unique: true,
        required: true
    },
    // only one user have a specific username
    password: {
        type: String,
        required: true
    },
    gender: Number,
    // gender:
    //      -1: woman
    //      0 : other
    //      1 : man
    //      None: rather not to say
    dob: Date,
    created_at: {
        type: Date,
        default: new Date(),
        required: true
    }
})

const UserModel = mongoose.model('User', UserSchema);
exports.model = UserModel;