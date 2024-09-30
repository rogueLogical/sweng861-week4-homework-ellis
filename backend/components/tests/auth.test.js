const auth = require('../auth');
const cors = require('cors');
const session = require('express-session');
const passport = require('../../config/passportConfig');
const express = require('express');
const mockingoose = require('mockingoose');
const supertest = require('supertest');
const User = require('../../database/User');

import { log } from 'console';

describe('Verify User API', () => {
    beforeEach(() => {
        // Create server app
        app = express();

        // Enable json parsing
        app.use(express.json());

        // Mock Session and Middleware
        const mockSession = {username: 'TestUser2'}
        const mockSessionMiddleware = (req, res, next) => {
            req.session = mockSession;
            next();
        };
        app.use(mockSessionMiddleware)

        app.use('/', auth)

        api = supertest(app)
    });

    it('Test Endpoint', async () => {
        const response = await api.get('/test-api');
        expect(response.status).toBe(200);
    });

    it('User Lookup', async () => {
        const response = await api.post('/user')
            .send({ username: 'TestUser1' });
        expect(response.status).toBe(200)
    });

    it('Test User List', async () => {
        const userList = await User.find().select(['_id', 'username']);
        const response = await api.get('/user');
        expect(response.status).toBe(200);
        expect(response.body.users.length).toEqual(userList.length);
    });

    // TODO: need to implement mocked authentication and session logic to test the following cases:
/*     it('Register New User', async () => {
        const response = await api.post('/register').send({
            username: 'TestUser2',
            password: 'Password',
            email: 'testU2@myapp.com',
            dob: '1999/01/01',
            organization: 'testWorks',
            occupation: 'software',
            zodiac: 'Aries'
        });
        expect(response.status).toBe(201)
    });

    it('Test login logout', async () =>{
        let cookie;
        // login
        const response1 = await api.post('/login').send({
            username: 'TestUser2',
            password: 'Password'
        });
        cookie = response1.headers['set-cookie']; //set cookie to retain user session during following tests
        expect(response1.status).toBe(200);
        // logout
        const response2 = await api.get('/logout')
        .set('Cookie', cookie); // use saved cookie to pass session for logout command
        log(response2)
        expect(response2.status).toBe(200);
        expect(response2.body).toBe({message: 'Logged out successfully'})
    }); */
});
