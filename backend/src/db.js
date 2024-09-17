import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import nano from 'nano';

import neo4j from 'neo4j-driver';


dotenv.config();

//Neo4j
export const connectNeo4J = async (dbOperation) => { 
    const URI = 'neo4j+s://0a20726c.databases.neo4j.io';
    const USER = 'neo4j';
    const PASSWORD = 'rTRcIeeETgIFAe_pxx1-OTW0aFQUwwLxnPdFiaSFltw';
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
      console.error(`Request error\n${err}\nCause: ${err.cause}`);
      throw err;
    } finally {
      if (session) await session.close();
      if (driver) await driver.close();
    }
  };

//redis
export const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
export const redisClient = await client.connect();

// CouchDB
//admin es el nombre de usuario y con123 la contraseña que hayan puesto
const couch = nano('http://admin:con123@127.0.0.1:5984');
//test es el nombre de la base de datos
//export const couchClient = await couch.db.use('test');
let couchClient;
(async () => {
    try {
        // Check if the database exists, create if not
        const dbName = 'test';
        const dbList = await couch.db.list();
        if (!dbList.includes(dbName)) {
            await couch.db.create(dbName);
            console.log(`Database "${dbName}" created.`);
        }
        couchClient = couch.db.use(dbName);
        //console.log('CouchDB connected');
    } catch (err) {
        console.error('CouchDB connection error:', err);
    }
})();
export { couchClient };

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



