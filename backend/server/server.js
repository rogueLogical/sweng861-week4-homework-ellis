const express = require('express');
const session = require('express-session');
const passport = require('../config/passportConfig');
const User = require('../database/User')
const cors = require('cors');

const authRouter = require('../components/auth');

const app = express();

app.use(express.json());

app.use(session({
    secret: 'mySecret_key_222',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
    origin: 'http://localhost:8081',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preFlightContinue: false,
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use('/auth/', authRouter)

app.listen(9000, function () {
    console.log('Server started on port 9000')
});
