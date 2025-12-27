import StudentService from '../../src/Domain/Student/Services/StudentService';
import type { StudentDTO } from '../../src/Domain/Student/DTOs/StudentDTO';

class FakeStudentRepo {
  private byEmail: Record<string, StudentDTO> = {};
  private byId: Record<string, StudentDTO> = {};
  async findAll(): Promise<StudentDTO[]> { return Object.values(this.byId); }
  async findById(id: string): Promise<StudentDTO | null> { return this.byId[id] ?? null; }
  async findByEmail(email: string): Promise<StudentDTO | null> { return this.byEmail[email] ?? null; }
  async create(dto: StudentDTO): Promise<StudentDTO> {
    const id = 's1';
    const created = { ...dto, id };
    this.byId[id] = created;
    this.byEmail[dto.email] = created;
    return created;
  }
  async update(id: string, dto: StudentDTO): Promise<StudentDTO | null> {
    if (!this.byId[id]) return null;
    this.byId[id] = { ...(this.byId[id] as StudentDTO), ...dto };
    return this.byId[id] as StudentDTO;
  }
  async delete(id: string): Promise<boolean> {
    const existed = Boolean(this.byId[id]);
    delete this.byId[id];
    return existed;
  }
}

function sampleStudent(overrides: Partial<StudentDTO> = {}): StudentDTO {
  return {
    name: 'Aluno',
    email: 'a@example.com',
    password: '123456789012',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}

describe('StudentService', () => {
  it('hashes password and avoids duplicate emails', async () => {
    const repo = new FakeStudentRepo() as any;
    const svc = new StudentService(repo);
    const s1 = await svc.createStudent(sampleStudent());
    expect(s1.password).not.toBe('123456789012');
    await expect(svc.createStudent(sampleStudent())).rejects.toThrow(/already exists/);
  });
});

