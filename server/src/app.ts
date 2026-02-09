import express from 'express';
import { createServer } from 'node:http';
import { initSocket } from './utils/io.ts';

const app = express();
const server = createServer(app);


app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

initSocket(server);
export { server };