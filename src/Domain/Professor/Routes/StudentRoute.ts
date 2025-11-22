import { Express, Request, Response } from 'express';

export default class StudentRoute {
    constructor(private app: Express) {
        this.app.get('/students', this.getStudents.bind(this));
    }

    private getStudents(req: Request, res: Response) {
        res.send('Hello World');
    }
}