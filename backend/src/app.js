import express from 'express';
import mongoose from 'mongoose';
import repositoriesRoutes from "./routes/repository.route.js"
import cors from 'cors';
import {connectDB} from './db.js'
connectDB();
const app = express();
//app.use(morgan("dev"));
app.use(express.json());
app.use(cors());


app.use("/api", repositoriesRoutes);
app.get("/", (req, resp) => {

    resp.send("App is Working");
    // You can check backend is working or not by
    // entering http://loacalhost:5000

    // If you see App is working means
    // backend working properly
});
app.listen(5000);

export default app;
