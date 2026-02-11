import express, { type NextFunction, type Request, type Response } from 'express';
import { createServer } from 'node:http';
import { initSocket } from './utils/io.ts';
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import { httpLogger } from './middlewares/httpLogger.ts';
import router from './routes/index.ts';
import cookieParser from 'cookie-parser';

const app = express();
const server = createServer(app);

app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json())

app.set("trust proxy", 1); // use real IP not a proxy one
app.use(helmet())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(httpLogger);

app.use("/api", router)

app.use((_req, res) => {
  res.status(404).json({
    message: "Route not found",
    success: false
  });
});


initSocket(server);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    success: false
  });
});

export { server };