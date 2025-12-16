import express from 'express';
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv";
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser'; 
import cors from 'cors';
import messageRoutes from './routes/message.route.js';
import { app, server } from "./lib/socket.js";


//const app = express();
//router.use(app);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));




app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
}));

app.use(cookieParser());

dotenv.config();

//const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.json());



app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes);


server.listen(PORT , () => {
  console.log('Server is running on port:', PORT);
  connectDB();
});  