const express = require('express');
const passport = require('../config/passportConfig');
const User = require('../database/User')

//

//setup api functions
const checkForUser = (user) => {
    return {}
}

// setup api routes
var router = express.Router();

router.get('/test-api', (req, res) => {
    res.status(200).send('api connection successful');
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.send('Logged in successfully')
    console.log(req.body.username + " logged in successfully")
})

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        await newUser.save();
        res.send('User registered successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    res.send('Logged out successfully');
});

router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send('You are not logged in.');
    res.send('Hello ${req.user.username}');
});

module.exports = router;