import { server } from "./app.ts";
import { ENV } from "./utils/env.ts";

const port = ENV.port;

server.listen(port, () => {
    console.info(`Server is running on Port ${port}`)
})