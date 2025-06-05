import express from "express"
import { connectDB } from "./db/connectDB.js"
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js"
dotenv.config();

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes)

app.listen(5000, () => {
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})

