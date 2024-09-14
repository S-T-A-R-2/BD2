import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import {TOKEN_SECRET} from '../config.js'

dotenv.config();
const secretKey = process.env.SECRET_KEY;

export function createAccessToken(payload) {
     return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            TOKEN_SECRET,
            {
                expiresIn: "8h",
            },
            (err, token) => {
                if (err) reject(err)
                resolve(token)
            }
        )
    });
}
