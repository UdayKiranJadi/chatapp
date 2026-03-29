import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";

import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/authRoutes.js"

const app = express();

const httpServer = http.createServer(app);

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials:true,

}))

app.use(cookieParser());

app.use(express.json());
app.use('/api/auth', authRoutes);

try {
    await connectDB();
    const PORT = process.env.PORT || 4444;
    httpServer.listen(PORT, () => {
        console.log(`Server is Running at ${PORT}`)
    });
} catch (error) {
    console.error("The server failed to start".error);
    process.exit(1);
}


