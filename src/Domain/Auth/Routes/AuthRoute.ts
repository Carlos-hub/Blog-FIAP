import { Router, Request, Response } from 'express';
import { ok, handleError } from '../../../infra/Http/ApiResponse';
import { ProfessorModel } from '../../../infra/Database/Models/Professor/ProfessorModel';
import { StudentsModel } from '../../../infra/Database/Models/Students/StudentsModel';
import bcrypt from 'bcrypt';
import { signProfessorToken, signStudentToken } from '../../../infra/Auth/Jwt';

export default class AuthRoute {
    private routePrefix: string = '/auth';
    constructor(private readonly router: Router) {
        router.post(this.routePrefix + '/login', this.loginProfessor.bind(this));
        router.post(this.routePrefix + '/student/login', this.loginStudent.bind(this));
    }

    private async loginProfessor(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, error: { message: 'Email and password are required' } });
            }
            const prof = await ProfessorModel.findOne({ email }).lean();
            if (!prof) {
                return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
            }
            const valid = await bcrypt.compare(password, prof.password);
            if (!valid) {
                return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
            }
            const token = signProfessorToken(String(prof._id));
            return ok(res, { token });
        } catch (error) {
            return handleError(res, error);
        }
    }

    private async loginStudent(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, error: { message: 'Email and password are required' } });
            }
            const student = await StudentsModel.findOne({ email }).lean();
            if (!student) {
                return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
            }
            const valid = await bcrypt.compare(password, student.password);
            if (!valid) {
                return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
            }
            const token = signStudentToken(String(student._id));
            return ok(res, { token });
        } catch (error) {
            return handleError(res, error);
        }
    }
}

