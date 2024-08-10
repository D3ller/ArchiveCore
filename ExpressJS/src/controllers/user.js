import argon2 from "argon2";
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const registerAccount = async (req, res) => {

    if (req.session.loggedin) {
        return res.status(409).json({message: 'User is already logged in'});
    }

    const {username, password, confirm_password, email} = req.body;

    if (!username || !password || !confirm_password || !email) {
        return res.status(400).json({message: 'Please fill in all fields'});
    }

    if (password !== confirm_password) {
        return res.status(400).json({message: 'Passwords do not match'});
    }

    if (password.length < 6) {
        return res.status(400).json({message: 'Password must be at least 6 characters long'});
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        });
    }

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({message: 'Please enter a valid email address'});
    }

    try {
        const hashedPassword = await argon2.hash(password);
        const newUser = await prisma.account.create({
            data: {
                username,
                password: hashedPassword,
                email,
            }
        });
        return res.status(201).json({message: 'User registered successfully', userId: newUser.id});
    } catch (err) {
        console.error(err);
        if (err.code === 'P2002' && err.meta) {
            const field = err.meta.target.find(target => ['username', 'email'].includes(target));
            if (field) {
                return res.status(409).json({message: `${field[0].toUpperCase() + field.slice(1)} is already taken`});
            }
        }
        return res.status(500).json({message: 'An error occurred while registering the user'});
    }

};

export const loginAccount = async (req, res) => {

    if (req.session.loggedin) {
        return res.status(409).json({message: 'User is already logged in'});
    }

    let {username, password} = req.body;
    if (!username || !password) {
        return res.status(401).json({message: 'Missing username or password'});
    }

    let user = await prisma.account.findFirst({
        where: {
            OR: [
                {
                    username: username
                },
                {
                    email: username
                }
            ]
        }
    });

    if (!user) {
        return res.status(401).json({message: 'Invalid username or password'});
    }

    let validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
        return res.status(401).json({message: 'Invalid username or password'});
    }

    console.log(user)
    req.session.loggedin = true;
    req.session.userId = user.id;

    return res.status(200).json({message: 'User logged in successfully', userId: user.id});
}

export const updateAccount = async (req, res) => {

    let {cover_url, username, email} = req.body;
    let userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({message: 'User is not logged in'});
    }

    if (!username || !email || !cover_url) {
        console.log(username, email, cover_url)
        return res.status(400).json({message: 'Please fill in all fields'});
    }

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({message: 'Please enter a valid email address'});
    }

    if (username.length > 30) {
        return res.status(400).json({message: 'Username must be less than 30 characters long'});
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({message: 'Username must contain only letters, numbers and underscores'});
    }

    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(cover_url)) {
        return res.status(400).json({message: 'Please enter a valid URL for the cover image'});
    }

    try {
        let updatedUser = await prisma.account.update({
            where: {
                id: userId
            },
            data: {
                avatarURL: cover_url,
                username,
                email
            }
        });
        return res.status(200).json({message: 'User updated successfully', userId: updatedUser.id});
    } catch (err) {
        const field = err.meta.target.find(target => ['username', 'email'].includes(target));
        if (field) {
            return res.status(409).json({message: `${field[0].toUpperCase() + field.slice(1)} is already taken`});
        }
        return res.status(500).json({message: 'An error occurred while updating the user, please contact support'});
    }
}

export const logoutAccount = async (req, res) => {
    req.session.destroy();
    return res.status(200).json({message: 'User logged out successfully'});
}

export const verifyAccount = async (req, res) => {
    let userId = req.session.userId;
    if (!userId) {
        req.session.destroy();
        return res.status(401).json({message: 'User is not logged in'});
    }
    return res.status(200).json({message: 'User is logged in', userId});
}

