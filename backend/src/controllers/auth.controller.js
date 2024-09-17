import User from '../models/user.model.js'
import {redisClient} from '../db.js'
import Encrypter from '../libs/encrypter.js'
import {createAccessToken} from '../libs/jwt.js'
import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js'
import { createAccount } from './relationships.controller.js'


export const register = async (req, res) => {
    const {email, password, name, username} = req.body;
    //User.create()

    //Encryption
    const encrypter = new Encrypter(process.env.ENCRYPT_KEY)
    const email_e = encrypter.encrypt(email);
    const password_e = encrypter.encrypt(password);
    const name_e = encrypter.encrypt(name);

    try {

        const userFound = await redisClient.get(username);
        if (userFound) {
            return res.status(409).json({ messages: ['the username already in use']});
        }

        await createAccount(username);

        const user = {
            email: email_e,
            password: password_e,
            name: name_e
        };

        const userJson = JSON.stringify(user);

        await redisClient.set(username, userJson);
        /*await redisClient.hSet(username, {
        email: email,
        password: password
        });
        const usersaved = redisClient.hGet(username);*/

        const token = await createAccessToken({ id: username, username });
        res.cookie('token', token, {
            sameSite: 'none',
            secure: true,
            httpOnly: false
        });

        res.status(201).json({ message: "User registered", username, email, name });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userJson = await redisClient.get(username);
        if (!userJson) {
            return res.status(404).json({ messages: ['User not found'] });
        }

        const user = JSON.parse(userJson);
        const encrypter = new Encrypter(process.env.ENCRYPT_KEY);
        const decryptedPassword = encrypter.decrypt(user.password);

        if (decryptedPassword !== password) {
            return res.status(401).json({ messages: ['Incorrect Password'] });
        }

        const token = await createAccessToken({ id: username, username });

        res.cookie('token', token, {
            sameSite: 'none',
            secure: true,
            httpOnly: false
        });
        res.status(200).json({ message: 'Login successful', username });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ messages: ['Error logging in user', error.message] });
    }
};

export const logout = async (req, res) => {
    res.cookie('token', "", {
        expires: new Date(0)
    });
    return res.sendStatus(200);
}


export const profile = async (req, res) => {
    const userJson = await redisClient.get(req.user.username);
    const user = JSON.parse(userJson);
    // console.log(user.email);
    const encrypter = new Encrypter(process.env.ENCRYPT_KEY);

    return res.json({user: req.user.username, email: encrypter.decrypt(user.email), name: encrypter.decrypt(user.name), password: encrypter.decrypt(user.password)});

}

export const verifyToken = async (req, res) => {
    const {token} = req.cookies
    if (!token) {
        return res.status(401).json({message: 'No token, authorization denied'});
    }

    jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({message: "authorization denied"});

        const {username} = decoded;
        const userJson = await redisClient.get(username);
        if (!userJson) {
            return res.status(404).json({ messages: ['authorization deniedd'] });
        }

        const user = JSON.parse(userJson);
        const encrypter = new Encrypter(process.env.ENCRYPT_KEY);

        return res.json({
            username,
            email: encrypter.decrypt(user.email),
            name: encrypter.decrypt(user.name),
            password: encrypter.decrypt(user.password)
        });
    });
};



