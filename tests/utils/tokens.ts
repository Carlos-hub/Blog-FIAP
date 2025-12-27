import { signProfessorToken, signStudentToken } from '../../src/infra/Auth/Jwt';

export function makeProfessorToken(id: string): string {
  return signProfessorToken(id);
}

export function makeStudentToken(id: string): string {
  return signStudentToken(id);
}

