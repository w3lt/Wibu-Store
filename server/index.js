const express = require('express');
const config = require('./configs');
const session = require('express-session');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const MySQLStore = require('express-mysql-session')(session);

const passport = require('passport');
const { sqlPool, setUp } = require('./support');
const { Response } = require('./response');
const { Game } = require('./structure/Game/Game');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./structure/User/User').User;

// sesstion store
const sessionStore = new MySQLStore({}, sqlPool);

const app = express();
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'Giang Lake ngok ngech',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }
}))

// Use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.uid);
});

passport.deserializeUser(function(id, done) {
    sqlPool.query(`SELECT * FROM users WHERE uid=${id}`, (err, rows) => {
        done(err, rows[0]);
    })
});

passport.use(new LocalStrategy(
    {
        usernameField: 'accountID',
        passwordField: 'password'
    },
    (accountID, password, done) => {
        const requestedUser = {accountID: accountID, password: password};
        return done(null, requestedUser);
    }
));
  

// Cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with the allowed origin(s)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.route('/check-session')
    .get(async (req, res) => {
        try {
            const result = await User.checkSession(req.session.id);
            if (result) {
                res.send(new Response(0, 0, {uid: req.session.uid}).toJSON());
            } else {
                res.send(new Response(0, 5).toJSON());
            }
        } catch (error) {
            res.send(new Response(1).toJSON());
        }
        
    })

// Auth
app.route('/auth')
    .post((req, res, next) => {
        passport.authenticate('local', async (err, user, info) => {
            if (err) {
                // Handle any error that occurred during authentication
                console.log(err);
                return res.status(500).json({ error: 'An error occurred during authentication.' });
            }

            const accountID = user.accountID;
            const password = user.password;

            try {
                const result = await User.authenticate(accountID, password);
                if (result !== false) {
                    req.session.uid = result.uid;
                    res.send(new Response(0, 0).toJSON());
                } else {
                    res.send(new Response(0, 4).toJSON());
                }
            } catch (error) {
                console.log(error);
                res.send(new Response(1).toJSON());
            }
        }) (req, res, next);
    });

// Register
app.route('/register')
    .post(async (req, res) => {
        // Check if user can register
        // If yes => create new user and send back the result
        // If no => send back the error
        const password = req.body.password;
        const email = req.body.email;
        const username = req.body.username;

        try {
            const result = await User.registerNewUser(email, username, password);
            res.send(new Response(0, result).toJSON());
        } catch (error) {
            console.log(error);
            res.send(new Response(1).toJSON());
        }
    })

// Logout
app.route('/logout')
    .post((req, res) => {
        // Clear the user's session and log them out
        req.logout(err => {
            if (err) {
                console.log(err);
                res.status(500).json(new Response(1).toJSON());
            } else {
                // This function is provided by Passport.js to clear the session
                req.session.destroy(err => {
                    if (err) {
                        console.log(err);
                        res.status(500).json(new Response(1).toJSON());
                    } else {
                        res.send(new Response(0, 0).toJSON());
                    }
                });
            }
        });
    });

app.route('/games/free-to-play')
    .get(async (req, res) => {
        const url = `http://${config.DATA_ANALYSIS_SERVER}:${config.DATA_ANALYSIS_SERVER_PORT}/games/free-to-play`;
        try {
            console.log(url);
            const response = await axios.get(url);
            console.log(response.data);
        } catch (error) {
            console.log(error);
            res.send(new Response(1).toJSON());
        }
    })

app.route('/games/:gameID')
    .get(async (req, res) => {
        const gameID = req.params.gameID;
        
        try {
            const game = new Game(gameID);
            const gameData = await game.getFullData();
            res.send(new Response(0, 0, gameData).toJSON());
        } catch (error) {
            res.send(new Response(1).toJSON());
        }
    });

app.route('/users/:userID/:field')
    .get(async (req, res) => {
        console.log(req.params.userID);
        try {
            const result = await User.checkSession(req.params.userID);
            if (result) {
                const getField = req.params.field;
                const data = await new User(req.params.userID).get(getField);
                res.send(new Response(0, 0, data));
            } else {
                res.send(new Response(0, 5).toJSON());
            }
        } catch (error) {
            res.send(new Response(1).toJSON());
        }
        
    })

const PORT = config.PORT;
app.listen(PORT, async () => {
    console.log(`Server is running on PORT ${PORT}`);
});