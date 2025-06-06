import { User } from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail  } from "../mailtrap/emails.js"
import crypto from "crypto"

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

        await sendVerificationEmail(user.email, verificationToken)

        res.status(201).json({
            success: true,
            message: "User created Successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const verifyEmail = async (req, res) => {
    const {code} = req.body
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({success: false, message: "Invalid or expired verification code"})
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name)
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        return res.status(400).json({message: "Invalid verification code"})
    }
}
export const login = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({success: false, message: "Invalid Credentials"})
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({success: false, message: "Invalid Credentials"})
        }

        generateTokenAndSetCookie(res, user._id)
        user.lastLogin = new Date()
        await user.save()

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.error("Login error:", error)
        res.status(400).json({success: false, message: error.message})
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({message: "Logged out successfully"})
}

export const forgotPassword = async (req, res) => {
    const {email} = req.body
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({message: "User not found"})
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1 * 60 *60 *1000
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({
            success: true,
            message: "Password reset email sent successfully"
        });
    } catch (error) {
        console.log("Forgot password error:", error)
        res.status(400).json({success: false, message: "Failed to send password reset email: " + error.message});
    }
}
