import User from '../models/user.model.js'
import {redisClient} from '../db.js'
export const register = async (req, res) => {
    const {email, password, username} = req.body;
    //User.create()
    try {
        const user = {
            email: email,
            password: password
        };
        const userJson = JSON.stringify(user);
        await redisClient.set(username, userJson);
        /*await redisClient.hSet(username, {
        email: email,
        password: password
        });
        const usersaved = redisClient.hGet(username);*/
        res.status(201).json({ message: 'User registered', username });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
}
