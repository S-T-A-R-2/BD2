import jwt from 'jsonwebtoken'
import {TOKEN_SECRET} from '../config.js'



export const authRequired = (req, res, next) => {
    const {token} = req.cookies;
    if (!token) 
        return res.status(401).json({ message: 'No token, authorization denied' });

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) return(403).json({message: "Invalid Token"});

        req.user = user;

        next();
    })
}

//Validar el usuario
export const authOptional = (req, res, next) => {
    const {token} = req.cookies;
    if (!token) return false;

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) return false;

        req.user = user;
        next();
        return true;
    })
}