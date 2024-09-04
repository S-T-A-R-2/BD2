import User from '../models/user.model.js'
import {client} from '../db.js'
export const register = async (req, res) => {
    const {email, password, username} = req.body;
    //User.create()
    await client.hSet(username, {
        email: email,
        password: password
    });
}
