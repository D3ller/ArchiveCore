import express from 'express';
import client from '../config/database.js';
import argon2 from 'argon2';

const router = express.Router();

router.post('/api/login', (req, res) => {
    let {username, password} = req.body;
    if (!username || !password) {
        return res.status(401).json({errorCode: 401, message: 'Missing username or password'});
    }
})

router.post('/api/register', (req, res) => {
    let {username, password, confirm_password, email} = req.body;

    if (!username || !password || !confirm_password || !email) {
        return res.status(401).json({errorCode: 401, message: 'Please fill in all fields'});
    }

    if (password !== confirm_password) {
        return res.status(401).json({errorCode: 401, message: 'Passwords do not match'});
    }

    if(password.length < 6) {
        return res.status(401).json({errorCode: 401, message: 'Password must be at least 6 characters long'});
    }

    if(password.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$")) {
        return res.status(401).json({errorCode: 401, message: 'Password must contain at least one uppercase letter, one lowercase letter and one number'});
    }

    if(email.match("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/g")) {
        return res.status(401).json({errorCode: 401, message: 'Please enter a valid email address'});
    }

    let hashedPassword = argon2.hash(password).then(hashedPassword => {
        client.query('INSERT INTO account (username, password, email) VALUES ($1, $2, $3)', [username, hashedPassword, email], (error, results) => {
            if (error) {
                if(error.code === '23505') {
                    return res.status(401).json({errorCode: 401, message: 'Username or email already exists'});
                }
            } else {
                req.session.loggedin = true;
                req.session.username = username;
                return res.status(200).json({errorCode: 200, message: 'User registered successfully'});
            }
        })
    })

})

router.get('/api/check-session', (req, res) => {
    if (req.session.loggedin) {
        return res.status(200).json({ loggedin: true, username: req.session.username });
    } else {
        return res.status(401).json({ loggedin: false, message: 'User is not logged in' });
    }
});


export default router;