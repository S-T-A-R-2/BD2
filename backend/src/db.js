import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createClient } from 'redis';


dotenv.config();

//redis
export const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
export const redisClient = await client.connect();


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

