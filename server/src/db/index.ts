import mongoose from 'mongoose'
import { ENV } from '../utils/env.ts'

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(ENV.dbUrl)
        console.log("Database connected successfully!! - ", connection.connection.host)
    } catch (error) {
        console.error("Error while connecting a Database: ", error);
        process.exit(1)
    }
}