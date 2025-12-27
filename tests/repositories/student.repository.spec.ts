import { startTestMongo, stopTestMongo } from '../setup/mongo';
import { StudentRepository } from '../../src/Domain/Student/Repositories/StudentRepository';
import type { StudentDTO } from '../../src/Domain/Student/DTOs/StudentDTO';

function sample(overrides: Partial<StudentDTO> = {}): StudentDTO {
  return {
    name: 'Aluno Repo',
    email: 'repo.student@example.com',
    password: '123456789012',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}

describe('StudentRepository', () => {
  let repo: StudentRepository;

  beforeAll(async () => {
    await startTestMongo();
    repo = new StudentRepository();
  });
  afterAll(async () => {
    await stopTestMongo();
  });

  it('creates and finds by email', async () => {
    await repo.create(sample());
    const found = await repo.findByEmail('repo.student@example.com');
    expect(found?.email).toBe('repo.student@example.com');
  });
});

