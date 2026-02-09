import { server } from "./app.ts";
import { connectDB } from "./db/index.ts";
import { ENV } from "./utils/env.ts";

const port = ENV.port;


server.listen(port, async() => {
    await connectDB()
    console.info(`Server is running on Port ${port}`)
})