import { startTestMongo, stopTestMongo } from '../setup/mongo';
import ProfessorRepository from '../../src/Domain/Professor/Repositories/ProfessorRepository';
import type { ProfessorDTO } from '../../src/Domain/Professor/DTOs/ProfessorDTO';

function sample(overrides: Partial<ProfessorDTO> = {}): ProfessorDTO {
  return {
    name: 'Prof Repo',
    email: 'repo.prof@example.com',
    password: '123456789012',
    discipline: 'Matematica',
    ...overrides
  };
}

describe('ProfessorRepository', () => {
  let repo: ProfessorRepository;
  let id = '';

  beforeAll(async () => {
    await startTestMongo();
    repo = new ProfessorRepository();
  });
  afterAll(async () => {
    await stopTestMongo();
  });

  it('creates and reads', async () => {
    const created = await repo.create(sample());
    id = created.id as string;
    const got = await repo.findById(id);
    expect(got?.email).toBe('repo.prof@example.com');
  });
});

