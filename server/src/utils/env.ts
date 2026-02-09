import dotenv from 'dotenv'
dotenv.config({quiet: true})


export const ENV = {
    port : process.env.PORT || 5000
}