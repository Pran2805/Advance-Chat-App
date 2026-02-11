import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../utils/env.ts";
import { AuthService } from "../services/auth.service.ts";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: ENV.nodeEnv === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({
                    message: "All fields are required",
                    success: false
                });
            }

            const existingUser = await (AuthService.findExistingUser(email, username))

            if (existingUser) {
                return res.status(409).json({
                    message: "User already exists",
                    success: false
                });
            }

            const hashedPassword = await (AuthService.passwordHashing(password));

            const user = await (AuthService.createUser(email, username, hashedPassword))

            const token = AuthService.createToken(user?._id.toString())

            res.cookie("accessToken", token, COOKIE_OPTIONS);

            return res.status(201).json({
                message: "User registered successfully",
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch {
            return res.status(500).json({
                message: "Server error",
                success: false
            });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: "Email and password required",
                    success: false
                });
            }

            const user = await (AuthService.findExistingUser(email))

            if (!user) {
                return res.status(401).json({
                    message: "Invalid credentials",
                    success: false
                });
            }

            const isPasswordValid = await (AuthService.comparePassword(password, user.password))

            if (!isPasswordValid) {
                return res.status(401).json({
                    message: "Invalid credentials",
                    success: false
                });
            }

            const token = AuthService.createToken(user._id.toString())

            res.cookie("accessToken", token, COOKIE_OPTIONS);

            return res.status(200).json({
                message: "Login successful",
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch {
            return res.status(500).json({
                message: "Server error",
                success: false
            });
        }
    }

    static async logout(req: Request, res: Response) {
        try {
            if(!req.user){
                return res.status(400).json({message: "User not logged in", success: false})
            }
            res.clearCookie("accessToken", COOKIE_OPTIONS);

            return res.status(200).json({
                message: "User logged out successfully",
                success: true
            });
        } catch {
            return res.status(500).json({
                message: "Server error",
                success: false
            });
        }
    }
}
