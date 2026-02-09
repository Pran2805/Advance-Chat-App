import dotenv from 'dotenv'
dotenv.config({quiet: true})

interface env{
    port: number
    dbUrl: string
}

if(!process.env.DATABASE_URL){
    throw new Error("Database url is required")
}

export const ENV :env= {
    port : Number(process.env.PORT || 5000),
    dbUrl: process.env.DATABASE_URL
}