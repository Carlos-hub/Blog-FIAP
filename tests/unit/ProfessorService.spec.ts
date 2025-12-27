import ProfessorService from '../../src/Domain/Professor/Services/ProfessorService';
import type { ProfessorDTO } from '../../src/Domain/Professor/DTOs/ProfessorDTO';

class FakeProfessorRepo {
  private byId: Record<string, ProfessorDTO> = {};
  async findAll(): Promise<ProfessorDTO[]> { return Object.values(this.byId); }
  async findById(id: string): Promise<ProfessorDTO | null> { return this.byId[id] ?? null; }
  async create(dto: ProfessorDTO): Promise<ProfessorDTO> {
    const id = 'prof1';
    const created = { ...dto, id };
    this.byId[id] = created;
    return created;
  }
  async update(id: string, dto: ProfessorDTO): Promise<ProfessorDTO | null> {
    if (!this.byId[id]) return null;
    this.byId[id] = { ...(this.byId[id] as ProfessorDTO), ...dto };
    return this.byId[id] as ProfessorDTO;
  }
  async delete(id: string): Promise<boolean> {
    const existed = Boolean(this.byId[id]);
    delete this.byId[id];
    return existed;
  }
}

function sampleProfessor(overrides: Partial<ProfessorDTO> = {}): ProfessorDTO {
  return {
    name: 'Prof',
    email: 'p@example.com',
    password: '123456789012',
    discipline: 'Mat',
    ...overrides
  };
}

describe('ProfessorService', () => {
  it('hashes password on create', async () => {
    const repo = new FakeProfessorRepo() as any;
    const svc = new ProfessorService(repo);
    const created = await svc.createProfessor(sampleProfessor());
    expect(created.password).not.toBe('123456789012');
  });

  it('lists professors', async () => {
    const repo = new FakeProfessorRepo() as any;
    const svc = new ProfessorService(repo);
    await svc.createProfessor(sampleProfessor({ email: 'a@example.com' }));
    const all = await svc.getProfessors();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBe(1);
  });

  it('gets professor by id and throws when not found', async () => {
    const repo = new FakeProfessorRepo() as any;
    const svc = new ProfessorService(repo);
    const created = await svc.createProfessor(sampleProfessor({ email: 'b@example.com' }));
    const got = await svc.getProfessorById(created.id as string);
    expect(got.email).toBe('b@example.com');
    await expect(svc.getProfessorById('missing-id')).rejects.toThrow(/not found/);
  });

  it('updates professor and throws when not found', async () => {
    const repo = new FakeProfessorRepo() as any;
    const svc = new ProfessorService(repo);
    const created = await svc.createProfessor(sampleProfessor({ email: 'c@example.com' }));
    const updated = await svc.updateProfessor(created.id as string, { ...created, name: 'Edited' });
    expect(updated.name).toBe('Edited');
    await expect(svc.updateProfessor('missing', created)).rejects.toThrow(/not found/);
  });

  it('deletes professor', async () => {
    const repo = new FakeProfessorRepo() as any;
    const svc = new ProfessorService(repo);
    const created = await svc.createProfessor(sampleProfessor({ email: 'd@example.com' }));
    const ok = await svc.deleteProfessor(created.id as string);
    expect(ok).toBe(true);
  });
});

