import express from "express"
import { connectDB } from "./db/connectDB.js"
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js"
import cors from "cors";
dotenv.config();

const app = express()
app.use(express.json())
app.use(cors())
const PORT = process.env.PORT || 4000;

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})

