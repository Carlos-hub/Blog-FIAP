import { NextFunction, Request, Response } from 'express';
import { verifyToken, ProfessorTokenPayload, StudentTokenPayload } from './Jwt';
import { ProfessorModel } from '../Database/Models/Professor/ProfessorModel';
import { StudentsModel } from '../Database/Models/Students/StudentsModel';

export async function requireProfessorAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization || '';
    const [, token] = auth.split(' ');
    if (!token) {
      return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
    }
    const payload = verifyToken<ProfessorTokenPayload>(token);
    if (payload.role !== 'professor') {
      return res.status(403).json({ success: false, error: { message: 'Forbidden' } });
    }
    const professor = await ProfessorModel.findById(payload.sub).lean();
    if (!professor || professor.isActive === false) {
      return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
    }
    (req as any).user = { id: String(professor._id), discipline: professor.discipline, role: 'professor' };
    return next();
  } catch {
    return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
  }
}

export async function requireStudentAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization || '';
    const [, token] = auth.split(' ');
    if (!token) {
      return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
    }
    const payload = verifyToken<StudentTokenPayload>(token);
    if (payload.role !== 'student') {
      return res.status(403).json({ success: false, error: { message: 'Forbidden' } });
    }
    const student = await StudentsModel.findById(payload.sub).lean();
    if (!student) {
      return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
    }
    (req as any).user = { id: String(student._id), role: 'student' };
    return next();
  } catch {
    return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
  }
}

export async function requireStudentOrProfessorAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization || '';
    const [, token] = auth.split(' ');
	if (!token) {
		return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
	  }
	const payload = verifyToken<StudentTokenPayload | ProfessorTokenPayload>(token);
	if (payload.role !== 'student' && payload.role !== 'professor') {
		return res.status(403).json({ success: false, error: { message: 'Forbidden' } });
	}
	if (payload.role === 'student') {
		const student = await StudentsModel.findById(payload.sub).lean();
		if (!student) {
			return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
		}
	}
	if (payload.role === 'professor') {
		const professor = await ProfessorModel.findById(payload.sub).lean();
		if (!professor) {
			return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
		}
	}
	(req as any).user = { id: String(payload.sub), role: payload.role };
	return next();
  } catch {
	return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
  }
}