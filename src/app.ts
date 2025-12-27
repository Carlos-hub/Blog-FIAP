import express, { Express, NextFunction, Request, Response, Router } from 'express';
import StudentRoute from './Domain/Student/Routes/StudentRoute';
import PostRouter from './Domain/Posts/Routes/PostRouter';
import ProfessorRoute from './Domain/Professor/Routes/ProfessorRoute';
import AuthRoute from './Domain/Auth/Routes/AuthRoute';
import { CustomError } from './Exceptions/Exceptions';
import { fail } from './infra/Http/ApiResponse';

export function createApp(): Express {
  const app: Express = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const router = Router();
  // instantiate routes
  new StudentRoute(router);
  new PostRouter(router);
  new ProfessorRoute(router);
  new AuthRoute(router);
  app.use(router);

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
  });

  app.get('/teste', (req: Request, res: Response) => {
    res.send('Hello World');
  });

  // Global error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
      return fail(res, err.statusCode, err.message);
    }
    return fail(res, 500, 'Internal Server Error');
  });

  return app;
}

