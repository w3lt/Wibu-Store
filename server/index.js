const express = require('express');
const config = require('./configs');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const MySQLStore = require('express-mysql-session')(session);

const passport = require('passport');
const { sqlPool, setUp } = require('./support');
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
    .get((req, res) => {
        if (req.session.token === undefined) {
            res.send({status: 0, result: false})
        } else {
            res.send({status: 0, result: true})
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
                if (result) {
                    req.session.token = req.session.id;
                } else {

                }
            } catch (error) {
                throw error;
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

        console.log(await User.registerNewUser(email, username, password));

        res.send({status: 0});
        
        // User.Model.findOne({username: username})
        //     .then(result => {
        //         if (result === null) {
        //             // Can register
        //             bcrypt.hash(password, 10)
        //                 .then(hashedPass => {
        //                     const newUser = {
        //                         email: email,
        //                         username: username,
        //                         password: hashedPass,
        //                     }
        //                     User.Model.insertMany([newUser])
        //                         .then(docs => {
        //                             req.session.username = username;
        //                             res.send(getResultByStatus(0));
        //                         })
        //                         .catch(err => res.send(getResultByStatus(2)))
        //                 })
        //                 .catch(err => res.send(getResultByStatus(2)))
        //         } else {
        //             res.send(getResultByStatus(3));
        //         }
        //     })
    })

// Logout
app.route('/logout')
    .post((req, res) => {
        // Clear the user's session and log them out
        req.logout(err => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'An error occurred during logout.' });
            } else {
                // This function is provided by Passport.js to clear the session
                req.session.destroy((err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ error: 'An error occurred during logout.' });
                    } else {
                        res.send({status: 0});
                    }
                });
            }
        }); 
        
    });



const PORT = config.PORT;
app.listen(PORT, async () => {
    console.log(`Server is running on PORT ${PORT}`);
});