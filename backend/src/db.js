import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import nano from 'nano';




dotenv.config();

//redis
export const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
export const redisClient = await client.connect();


// CouchDB
//admin es el nombre de usuario y con123 la contraseña que hayan puesto
const couch = nano('http://admin:con123@127.0.0.1:5984');
//test es el nombre de la base de datos
export const couchClient = await couch.db.use('test');

//MongoDB
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,{

            serverSelectionTimeoutMS: 30000, // Tiempo de espera para la selección del servidor
            socketTimeoutMS: 45000
        });
        console.log("Conectado")
    } catch (error) {
        console.log(error);
    }
};

