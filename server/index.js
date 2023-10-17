const express = require('express');
const config = require('./configs');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const MySQLStore = require('express-mysql-session')(session);
const Cache = require('./cache').Cache;

const passport = require('passport');
const { sqlPool, convertPath2IMG, execQuery } = require('./support');
const { Response } = require('./response');
const { Game } = require('./structure/Game/Game');
const { SearchClient } = require('./search');
const LocalStrategy = require('passport-local').Strategy;

const stripe = require("stripe")('sk_test_51NsNMwJqOqW5UsDeG7q0qN1nEyj6BhcTYcyaNzXXQhtBM86S0CJ2zCs9lzuY6gEHKfmlLAmkx3VSn4fJk3Tsz29L00nOQTJunp');

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

app.use('/webhook', express.raw({ type: 'application/json' }));

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

app.route('/games/:gameID')
    .post(async (req, res) => {
        const gameID = req.params.gameID;
        const getField = req.body.getField;

        try {
            const game = new Game(gameID);
            var gameData;
            if (!getField) {    
                gameData = await game.getFullData();
            } else {
                gameData = await game.get(...getField);
            }

            res.send(new Response(0, 0, gameData).toJSON());
        } catch (error) {
            console.error(error);
            res.send(new Response(1).toJSON());
        }
    });

app.route('/users/:userID/:field')
    .get(async (req, res) => {
        try {
            const result = await User.checkSession(req.session.id);
            if (result) {
                const getField = req.params.field;
                const data = await new User(req.params.userID).get(getField);
                res.send(new Response(0, 0, data));
            } else {
                res.send(new Response(0, 5).toJSON());
            }
        } catch (error) {
            console.log(error);
            res.send(new Response(1).toJSON());
        }
        
    });

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_3c38a2c4ecb7c42416e8ea9dc5a2a7307f6f95ddcac0e1034e91a5f72923dbc9";
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntentSucceeded = event.data.object;

                // Save purchase history
                var query = `
                    INSERT INTO purchaseHistories (data, time)
                    VALUES ('${JSON.stringify(paymentIntentSucceeded)}', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}');
                `;
    
                await execQuery(query);

                const giftInfo = paymentIntentSucceeded.metadata.gift.split(', ');
                const receiver = giftInfo[0].slice(10,);
                var message = giftInfo[1].slice(9, );
                const gameIDs = paymentIntentSucceeded.metadata.gameIDs.split(',').map(e => +e);
                const sender = paymentIntentSucceeded.metadata.uid;

                if (message.length !== 0) {
                    query = `
                        INSERT INTO gifts (sender, receiver, gift, message, time)
                        VALUES (${sender}, ${receiver}, '${JSON.stringify(gameIDs)}', '${message}', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}');
                    `;
                } else {
                    query = `
                        INSERT INTO gifts (sender, receiver, gift, message, time)
                        VALUES (${sender}, ${receiver}, '${JSON.stringify(gameIDs)}', NULL, '${new Date().toISOString().slice(0, 19).replace('T', ' ')}');
                    `;
                }

                await execQuery(query);
                break;
    

    
            default:
                // console.log(`Unhandled event type`);
                break;
        }

        // Return a 200 response to acknowledge receipt of the event
        res.send();
    } catch (err) {
        console.log(err);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
})

app.route("/create-payment-intent")
    .post(async (req, res) => {

        const { itemIDs, gift } = req.body;

        try {

            const totalAmount = Math.round(await Game.calculateOrderAmount(itemIDs) * 100);

            // console.log(totalAmount);
        
            // Create a PaymentIntent with the order amount and currency
            const paymentIntent = await stripe.paymentIntents.create({
                metadata: {
                    uid: req.session.uid,
                    gift: gift === undefined ? undefined : `receiver: ${gift.receiver}, message: ${gift.message}`,
                    gameIDs: `${itemIDs}`
                },  
                amount: totalAmount,
                currency: "usd",
                // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
                automatic_payment_methods: {
                    enabled: false,
                },
                payment_method_types: [
                    "card"
                ],
                payment_method_options: {
                    card: {
                        request_three_d_secure: "automatic"
                    }
                }
            });

            res.send(new Response(0, 0, {clientSecret: paymentIntent.client_secret}));
        } catch (error) {
            console.log(error);
            res.send(new Response(1).toJSON());
        }

    });



app.route('/datas/:field/:subfield?')
    .post(async (req, res) => {
        const basePoint = `http://${config.DATA_ANALYSIS_SERVER}:${config.DATA_ANALYSIS_SERVER_PORT}`;
        const field = req.params.field;
        const number = req.body.number;

        const cache = new Cache(`redis://${config.cacheURL}`);

        try {
            const cacheData = await cache.getData(field);
            if (cacheData) {
                res.send(new Response(0, 0, cacheData).toJSON());
                return;
            }
        } catch (error) {
            console.log(error);
        }
        

        var targetData;

        switch (field) {
            case "best-deal-for-you":
                try {
                    const uid = req.session.uid;
                    const response = await fetch(`${basePoint}/games/${field}`, {
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(uid === undefined ? {number: number} : {uid: uid, number: number})
                    });

                    const bestDealForYouIDs = await response.json();
                    if (bestDealForYouIDs["error"]) {
                        console.log(bestDealForYouIDs["error"]);
                        res.send(new Response(1).toJSON());
                    } else {
                        targetData = await Promise.all(bestDealForYouIDs.map(async gameID => {
                            const data = await (new Game(gameID)).get("id", "cover_img", "title", "original_price", "price");
                            return data;
                        }));
                        res.send(new Response(0, 0, targetData).toJSON());
                    }
                } catch (error) {
                    console.log(error);
                    res.send(new Response(1).toJSON());
                } finally {
                    break;
                }   
                
            case "top-seller":
                var subfield = req.params.subfield;
                if (subfield === undefined) subfield = "year";
                const start_index = req.body.start_index;
                try {
                    const response = await fetch(`${basePoint}/games/${field}/${subfield}`, {
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({start_index: start_index, number: number})
                    });

                    const topSellerIDs = await response.json();
                    if (topSellerIDs["error"]) {
                        console.log(topSellerIDs);
                        res.send(new Response(1).toJSON());
                    } else {
                        targetData = await Promise.all(topSellerIDs.map(async topSellerID => {
                            const data = await (new Game(topSellerID)).get("id", "thumbnail", "supported_platforms", "title", "types", "price");
                            return data;
                        }));
                        res.send(new Response(0, 0, targetData).toJSON());
                    }
                } catch (error) {
                    console.log(error);
                    res.send(new Response(1).toJSON());
                } finally {
                    break;
                }
            case 'free-to-play':
                try {
                    const response = await fetch(`${basePoint}/games/${field}`, {
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({number: number})
                    });
    
                    const freeToPlayIDs = await response.json();
                    if (freeToPlayIDs["error"]) {
                        console.log(freeToPlayIDs["error"]);
                        res.send(new Response(1).toJSON());
                    } else {
                        targetData = await Promise.all(freeToPlayIDs.map(async freeToPlayID => {
                            const data = await (new Game(freeToPlayID)).get("id", "cover_img", "title");
                            return data;
                        }));

                        res.send(new Response(0, 0, targetData).toJSON());
                    }
                } catch (error) {
                    console.log(error);
                    res.send(new Response(1).toJSON()); 
                } finally {
                    break;
                }

            default:
                try {
                    const response = await fetch(`${basePoint}/games/${field}`, {
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({number: number})
                    });

                    const targetGameIDs = await response.json();
                    
                    if (targetGameIDs["error"]) {
                        console.log(targetGameIDs["error"]);
                    } else {
                        targetData = await Promise.all(targetGameIDs.map(async gameID => {
                            const data = await (new Game(gameID)).get("id", "thumbnail", "supported_platforms", "title", "types", "price");
                            return data;
                        }))

                        res.send(new Response(0, 0, targetData).toJSON());
                    }
                } catch (error) {
                    console.log(error);
                    res.send(new Response(1).toJSON()); 
                } finally {
                    break;
                }
        }

        try {
            await cache.setData(field, targetData);
        } catch (error) {
            console.log("Error setting data redis: ", error);
        }
        
    })

app.route('/top-banners')
    .get(async (req, res) => {
        const topBannersDirPath = `${__dirname}/assets/top_banners`;

        try {
            const fileNames = await fs.readdir(topBannersDirPath);
            const topBanners = await Promise.all(fileNames.map(fileName => {
                return convertPath2IMG(`top_banners/${fileName}`);
            }));

            res.send(new Response(0, 0, topBanners));
        } catch (error) {
            console.log(error);
            res.send(new Response(1).toJSON());
        }
    });

app.route('/search')
    .post(async (req, res) => {
        const keyword = req.body.keyword;
        if (!keyword) {
            res.send(new Response(0, 0, null));
        } else {
            const searchClient = new SearchClient();
            try {
                const results = await searchClient.search(keyword);
                const datas = await Promise.all(results.map(async result => {
                    const gameID = result.id;
                    return await (new Game(gameID)).get("id", "cover_img", "title", "supported_platforms", "price");
                }));

                res.send(new Response(0, 0, datas).toJSON());
            } catch (error) {
                console.log(error);
                res.send(new Response(1).toJSON());
            }
        }
    })

app.route('/search/:type')
    .post(async (req, res) => {
        const keyword = req.body.keyword;
        const type = req.params.type;

        var data;
        const searchClient = new SearchClient();

        try {
            switch (type) {
                case "user":
                    const result = await searchClient.search(keyword, type);
                    data = await Promise.all(result.map(async uid => {
                        const e = await new User(uid).get("avatar", "username");
                        e.uid = uid;
                        return e;
                    }));

                    res.send(new Response(0, 0, data).toJSON());
                    return;
            }
        } catch (error) {
            console.log(error);
            res.send(new Response(1).toJSON());
        }
        
    })

app.route('/love')
    .post(async (req, res) => {
        try {
            const result = await User.checkSession(req.session.id);
            if (result) {
                const gameID = req.body.gameID;
                const type = req.body.query;
                var query;
                if (type === "add") {
                    query = `
                        INSERT INTO loves
                        VALUES (${req.session.uid}, ${gameID});
                    `;
                } else if (type === "remove") {
                    query = `
                        DELETE FROM loves
                        WHERE uid=${req.session.uid} AND gameID=${gameID};
                    `;
                }

                await execQuery(query);
                res.send(new Response(0, 0).toJSON());
            } else {
                res.send(new Response(0, 5).toJSON());
            }
        } catch (error) {
            console.log(error);
            res.send(new Response(1).toJSON());
        }
    })

app.route('/love/:gameID')
    .get(async (req, res) => {
        try {
            const checkSessionresult = await User.checkSession(req.session.id);
            if (checkSessionresult) {
                const query = `
                    SELECT * FROM loves
                    WHERE uid=${req.session.uid} AND gameID=${req.params.gameID};
                `;

                const result = await execQuery(query);
                const data = result.length > 0;
                
                res.send(new Response(0, 0, data).toJSON());
            } else {
                res.send(new Response(0, 5).toJSON());
            }
        } catch (error) {
            console.log(error);
            res.send(new Response(1).toJSON());
        }
    });

app.route("/gift")
    .post(async (req, res) => {
        try {
            const checkSessionResult = await User.checkSession(req.session.id);
            if (checkSessionResult) {
                const uid = req.session.uid;
                const receiver = req.body.receiver;
                if (uid === receiver) {
                    res.send(new Response(0, 6).toJSON());
                    return
                }
                const gift = req.body.gift;
                const message = req.body.message;

                const result = await (new User(uid)).sendGift(receiver, gift, message);
                res.send(new Response(0, 0, result));
            } else {
                res.send(new Response(0, 5).toJSON());
            }
        } catch (error) {
            console.log(error);
            res.send(new Response(1).toJSON());
        }
        
    })

const PORT = config.PORT;
app.listen(PORT, async () => {
    console.log(`Server is running on PORT ${PORT}`);
});