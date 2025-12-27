import { createApp } from './app';
import connectToMongoDB from './infra/Database/MongoDB/Connect';

const app = createApp();
const port = Number(process.env.PORT) || 3000;

const db = connectToMongoDB();

app.listen(port, () => {
  console.log(`MongoDB connected: ${db.readyState}`);
  console.log(`API listening on http://0.0.0.0:${port}`);
});