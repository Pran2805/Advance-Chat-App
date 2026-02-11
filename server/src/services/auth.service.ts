import { User } from "../models/user.model.ts";
import bcrypt from "bcrypt";
import { ENV } from "../utils/env.ts";
import jwt from 'jsonwebtoken'

export class AuthService {
    static async findExistingUser(email?: string, username?: string) {
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        }).populate("+password")

        return existingUser
    }

    static async createUser(email: string, username: string, password: string) {
        const user = await User.create({
            username,
            email,
            password
        });
        return user;
    }

    static async passwordHashing(password: string) {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    static async comparePassword(password: string, userPassword: string) {
        const isCorrect = await bcrypt.compare(password, userPassword);
        return isCorrect;
    }

    static createToken(id: string) {
        const token = jwt.sign(
            id,
            ENV.jwtSecret,
            { expiresIn: "7d" }
        );

        return token;
    }

    static async userFindById(id: any) {
        const user = await User.findById(id);
        return user;
    }

    static decodeToken(token: string) {
    const decoded = jwt.verify(token, ENV.jwtSecret) as { id: string };

    if (!decoded?.id) {
        throw new Error("Invalid Token");
    }

    return decoded;
}

}