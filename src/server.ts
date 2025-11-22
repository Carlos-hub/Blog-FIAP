import express, { Express, Request, Response } from 'express';
import connectToMongoDB from './infra/Database/MongoDB/Connect';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

const port = Number(process.env.PORT) || 3000;

const db = connectToMongoDB();

app.listen(port, () => {
  console.log(`MongoDB connected: ${db.readyState}`);
  console.log(`API listening on http://0.0.0.0:${port}`);
});