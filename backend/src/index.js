//import app from './app.js';
import {connectDB} from './db.js'
import mongoose from 'mongoose'
import Repository from './models/repository.model.js'
//import taskRoutes from './routes/tasks.routes.js'
connectDB();
//app.listen(3000);
// Code  for mongoose config in backend
// Filename - backend/index.js

// To connect with your mongoDB database
/*const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/', {
    dbName: 'yourDB-name',
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => err ? console.log(err) :
    console.log('Connected to yourDB-name database'));
*/
// Schema for users of app
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
const User = mongoose.model('users', UserSchema);
User.createIndexes();

// For backend and express
import express from 'express';
const app = express();
import cors from 'cors';
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {

    resp.send("App is Working");
    // You can check backend is working or not by
    // entering http://loacalhost:5000

    // If you see App is working means
    // backend working properly
});

app.get("/gola", (req, resp) => {resp.send("mondongo")});

app.post("/register", async (req, resp) => {
    try {
        const user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        if (result) {
            delete result.password;
            resp.send(req.body);
            console.log(result);
        } else {
            console.log("User already register");
        }

    } catch (e) {
        resp.send("Something Went Wrong");
    }
});

app.post("/add", async (req, resp) => {
    try {
        const repository = new Repository(req.body);
        let result = await repository.save();
    } catch (e)
    {console.log(e)}
});

//app.use("/", taskRoutes);

app.listen(5000);

