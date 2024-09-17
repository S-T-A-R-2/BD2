import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import nano from 'nano';

import neo4j from 'neo4j-driver';


dotenv.config();

//redis
export const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
export const redisClient = await client.connect();

// CouchDB
//admin es el nombre de usuario y con123 la contraseña que hayan puesto
const couch = nano('http://admin:con123@127.0.0.1:5984');
//test es el nombre de la base de datos

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


//Neo4J
export const connectNeo4J = async (dbOperation) => { 
  const URI = process.env.NEO4J_URI;
  const USER = 'neo4j';
  const PASSWORD = process.env.NEO4J_PASSWORD;
  let driver;
  let session;
  
  console.log("conectando neo4j");

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    await driver.verifyConnectivity();
    
    console.log("conectado");

    session = driver.session({ database: 'neo4j' });
    console.log("sesion creada");
    // Destructure operation and parameters from dbOperation
    const { operation, parameters } = dbOperation;
    
    // Execute the operation with session.run
    const result = await session.run(operation, parameters);
      
    console.log("operacion terminada");

    return result;

  } catch (err) {
    console.error(`Request error\n${err}\nCause: ${err.cause}`);
    throw err;
  } finally {
    if (session) await session.close();
    if (driver) await driver.close();
  }
};

