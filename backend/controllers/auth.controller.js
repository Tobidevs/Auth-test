import { User } from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"

export const signup = async (req, res) => {
    const {email, password, name} = req.body
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required")
        }

        const userAlreadyExists = await User.findOne({email})
        if (userAlreadyExists) {
            return res.status(400).json({message: "User Already Exists!"})
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        })
        await user.save();

        generateTokenAndSetCookie(res, user._id)

    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const login = async (req, res) => {
    res.send("sign up route")
}

export const logout = async (req, res) => {
    res.send("sign up route")
}