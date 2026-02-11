import type { Request, Response } from "express";
import { User } from "../models/user.model.ts";

export class UserController {
    static async getUsers(req: Request, res: Response) {
        try {
            const userId = req.user?._id;

            const users = await User.find({
                _id: {
                    $ne: userId
                }
            }).select("username email avatar").limit(50)

            if (!users) {
                return res.status(200).json({
                    message: "No User Found",
                    success: true
                })
            }

            return res.status(200).json({
                users,
                success: true
            })
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                success: false
            });
        }
    }
}