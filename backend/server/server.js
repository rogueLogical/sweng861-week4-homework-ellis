const express = require('express');
const session = require('express-session');
const passport = require('../config/passportConfig');
const User = require('../database/User')
const cors = require('cors');
const authRouter = require('../components/auth');

// Create server app
const app = express();

// Enable json parsing
app.use(express.json());

// Retain session, and load current session if it exists.
app.use(session({
    secret: 'mySecret_key_222',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Use cors to allow the frontend to connect directly to the 
// backend during testing even though they are running on the 
// same server.
const corsOptions = {
    origin: 'http://localhost:8081',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preFlightContinue: true,
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// host authorization API at /auth/
app.use('/auth/', authRouter)

// Start server at port 9000
app.listen(9000, () => {
    console.log('Server started on port 9000')
});
