import express from "express"
import { connectDB } from "./db/connectDB.js"
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js"

dotenv.config();

const app = express()

app.use("/api/auth", authRoutes)

app.listen(3000, () => {
    connectDB()
    console.log(`Server is running on Port 3000`)
})

