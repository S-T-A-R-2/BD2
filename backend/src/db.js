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
export const couchClient = await couch.db.use('test');
export const couchDBCommit = await couch.db.use('commits');


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
  
  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    await driver.verifyConnectivity();
    
    session = driver.session({ database: 'neo4j' });
        // Destructure operation and parameters from dbOperation
    const { operation, parameters } = dbOperation;
    
    // Execute the operation with session.run
    const result = await session.run(operation, parameters);
      
    return result;

  } catch (err) {
    console.error(`Request error\n${err}`);
    throw err;
  } finally {
    if (session) await session.close();
    if (driver) await driver.close();
  }
};

export const connectNeo4JRead = async (dbOperation) => { 
  const URI = process.env.NEO4J_URI;
  const USER = 'neo4j';
  const PASSWORD = process.env.NEO4J_PASSWORD;
  let driver;

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    await driver.verifyConnectivity(); 

    const { operation, parameters } = dbOperation;
    console.log(operation + "\n" + parameters );

    let { records, summary } = await driver.executeQuery(operation, parameters, {database: 'neo4j'});
    // Destructure operation and parameters from dbOperation

    // Execute the operation with session.run

    return { records, summary };

  } catch (err) {
    console.error(`Request error\n${err}`);
    throw err;
  } finally {
    if (driver) await driver.close();
  }
};

