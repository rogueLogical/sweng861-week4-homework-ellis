const express = require('express');
const passport = require('../config/passportConfig');
const User = require('../database/User')

//setup api functions
const getUserList = async () => {
    const users = await User.find().select(['_id', 'username']);
    return users
}

const lookupUser = async (user, selection) => {
    const userData = await User.findOne({username: user}).select(selection);
    return userData
}

const lookupEmail = async (email, selection) => {
    const userData = await User.findOne({email: email}).select(selection);
    return userData
}

// setup api routes
var router = express.Router();

// test api endpoint to confirm connection to server
router.get('/test-api', (req, res) => {
    res.status(200).json({message: 'api connection successful'});
});

// endpoint to get all users and their user IDs
router.get('/user', async (req, res) => {
    try {
        const users = await getUserList();
        res.status(200).json({users});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

// endpoint to get a single user by username
router.post('/user', async (req,res) => {
    try {
        var username = req.body.username;
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    try {
        const user = await lookupUser(username, ['_id', 'username']);
        if (!user) return res.status(404).json({ error: "User Not Found"});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// endpoint to get a single user by email lookup
router.post('/email', async (req,res) => {
    try {
        var email = req.body.email;
    } catch (error) {
        return res.status(400).json({ error: "Bad Request" });
    }
    try {
        const user = await lookupEmail(email, ['_id', 'username']);
        if (!user) return res.status(404).json({ error: "User Not Found"});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// new user registration endpoint
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, dob, organization, occupation, zodiac } = req.body;
        // Check if username is already taken
        const user = await lookupUser(username, ['_id', 'username']);
        if (user) return res.status(400).json({error: 'A user with that username already exists.'});
        // Check if email is already taken
        const matchEmail = await lookupEmail(email, ['_id', 'username']);
        if (matchEmail) return res.status(400).json({error: 'A user with that email address already exists.'});
        // create new user
        const newUser = new User({ 
            username: username, 
            password: password, 
            email: email, 
            dob: dob, 
            organization: organization, 
            occupation: occupation, 
            zodiac: zodiac 
        });
        await newUser.save();
        console.log("New User Regisered: " + username);
        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// login api endpoint using passport
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({message: 'Logged in successfully'})
    console.log(req.body.username + " logged in successfully")
})

// logout endpoint
router.get('/logout', (req, res) => {
    try {
        if (!req.isAuthenticated()) return res.status(401).json({error: 'You are not logged in. Log in or create an account to continue.'});
        const username = req.user.username 
        req.logout((err) => {
            if (err) { return next(err); }
            res.redirect('/login');
        });
        console.log(username + " logged out successfully")
    } catch (error) {
        console.log(error)
    }
});

// user profile endpoint for populating homepage (only works if in an active session)
router.get('/profile', async (req, res) => {
    try {
        if (!req.isAuthenticated()) return res.status(401).json({error: 'You are not logged in. Log in or create an account to continue.'});
        username = req.user.username
        userData = await lookupUser(username, ['username', 'organization', 'occupation', 'zodiac'])
        res.json({
            username: username,
            organization: userData.organization,
            occupation: userData.occupation,
            zodiac: userData.zodiac
        });
    } catch (error) {
        res.status(500).json({error: error.message})
    }

});

// user profile update endpoint (only works if in an active session)
router.put('/user', async (req, res) => {
    try {
        if (!req.isAuthenticated()) return res.status(401).json({error: 'You are not logged in.'});
        username = req.user.username
        id = await lookupUser(username, ['_id'])
        if (!id) return res.status(404).json({error: "User not found" });
        const user = await User.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// delete user endpoint (only works if in an active session)
router.delete('/user', async (req, res) => {
    try {
        if (!req.isAuthenticated()) return res.status(401).json({error: 'You are not logged in.'});
        username = req.user.username
        id = await lookupUser(username, ['_id'])
        if (!id) return res.status(404).json({error: "User not found" });
        const user = await User.findByIdAndDelete(id);
        res.status(204)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports = router;