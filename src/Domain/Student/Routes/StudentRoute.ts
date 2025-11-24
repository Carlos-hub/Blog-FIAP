import { StudentRepository } from "../Repositories/StudentRepository";
import StudentService from "../Services/StudentService";
import { Express, Request, Response, Router } from 'express';

export default class StudentRoute {
    private readonly studentService: StudentService;
    private routePrefix: string = '/students';
    constructor(private readonly router: Router) {

        const studentRepository = new StudentRepository();
        const studentService = new StudentService(studentRepository);
        this.studentService = studentService;
        router.post(this.routePrefix+'/', this.createStudent.bind(this));
        router.get(this.routePrefix+'/', this.getStudents.bind(this));
        router.get(this.routePrefix+'/:id', this.getStudentById.bind(this));
        router.put(this.routePrefix+'/:id', this.updateStudent.bind(this));
        router.delete(this.routePrefix+'/:id', this.deleteStudent.bind(this));
    }

    private async getStudents(req: Request, res: Response) {
        try {
            const students = await this.studentService.getStudents();
            res.json(students);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
    private getStudentById(req: Request, res: Response) {
        res.send('Hello World');
    }
    private async createStudent(req: Request, res: Response) {
        try {
            const body = req.body;
            console.log(body);
            const student = await this.studentService.createStudent(body);
            res.json(student);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
    private updateStudent(req: Request, res: Response) {
        res.send('Hello World');
    }
    private deleteStudent(req: Request, res: Response) {
        res.send('Hello World');
    }
}