import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export interface ProfessorTokenPayload {
  sub: string; // professor id
  role: 'professor';
}

export interface StudentTokenPayload {
  sub: string; // student id
  role: 'student';
}

export function signProfessorToken(professorId: string): string {
  const payload: ProfessorTokenPayload = { sub: professorId, role: 'professor' };
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function signStudentToken(studentId: string): string {
  const payload: StudentTokenPayload = { sub: studentId, role: 'student' };
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken<T extends object = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET as jwt.Secret) as unknown as T;
}

