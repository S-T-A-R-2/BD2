import express from 'express';
import mongoose from 'mongoose';
import repositoriesRoutes from "./routes/repository.route.js"
import authRoutes from './routes/auth.route.js'
import filesRoutes from './routes/file.route.js'
import cookieParser from 'cookie-parser'
import branchesRoutes from './routes/branches.route.js'
import graphRoutes from './routes/graph.route.js'
import cors from 'cors';
import {connectDB} from './db.js'
import bodyParser from 'body-parser'
connectDB();


const app = express();
//app.use(morgan("dev"));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());


app.use("/api", repositoriesRoutes);
app.use("/api", authRoutes);
app.use("/api", filesRoutes);
app.use("/api", branchesRoutes);
app.use("/api", graphRoutes);
app.get("/", (req, resp) => {

    resp.send("App is Working");
    // You can check backend is working or not by
    // entering http://loacalhost:5000

    // If you see App is working means
    // backend working properly
});
app.listen(5000);

export default app;
