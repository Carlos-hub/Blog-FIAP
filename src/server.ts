import express, { Express, Request, Response, Router } from 'express';
import connectToMongoDB from './infra/Database/MongoDB/Connect';
import StudentRoute from './Domain/Student/Routes/StudentRoute';
import PostRouter from './Domain/Posts/Routes/PostRouter';
import ProfessorRoute from './Domain/Professor/Routes/ProfessorRoute';

const app: Express = express();

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = Router();
const studentRoute = new StudentRoute(router);
const postRoute = new PostRouter(router);
const professorRoute = new ProfessorRoute(router);
app.use(router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.get('/teste', (req: Request, res: Response) => {
  res.send("Hello World");
});


const port = Number(process.env.PORT) || 3000;

const db = connectToMongoDB();

app.listen(port, () => {
  console.log(`MongoDB connected: ${db.readyState}`);
  console.log(`API listening on http://0.0.0.0:${port}`);
});