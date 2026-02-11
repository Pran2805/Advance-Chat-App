import type { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service.ts";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Authentication required",
                success: false
            });
        }

        const decoded = AuthService.decodeToken(token);
        const user = await (AuthService.userFindById(decoded.id));

        if (!user) {
            return res.status(401).json({
                message: "User no longer exists",
                success: false
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
};
