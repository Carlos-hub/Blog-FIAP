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

  // CORS middleware (configurable via env)
  // CORS_ORIGINS: comma-separated list (e.g., "http://localhost:5173,https://app.example.com"); "*" allows all
  // CORS_CREDENTIALS: "true" to enable credentials (only when not using "*")
  const parsedAllowedOrigins = (process.env.CORS_ORIGINS ?? '*')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const allowAllOrigins = parsedAllowedOrigins.includes('*');

  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestOrigin = (req.headers.origin as string | undefined) ?? '';

    if (allowAllOrigins) {
      res.header('Access-Control-Allow-Origin', '*');
    } else if (requestOrigin && parsedAllowedOrigins.includes(requestOrigin)) {
      res.header('Access-Control-Allow-Origin', requestOrigin);
      res.header('Vary', 'Origin');
    }

    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const allowCredentials = process.env.CORS_CREDENTIALS === 'true';
    if (allowCredentials && !allowAllOrigins) {
      res.header('Access-Control-Allow-Credentials', 'true');
    }

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

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

