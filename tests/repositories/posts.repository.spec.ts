import { startTestMongo, stopTestMongo } from '../setup/mongo';
import PostsRepository from '../../src/Domain/Posts/Repositories/PostsRepository';
import type { PostDTO } from '../../src/Domain/Posts/DTOs/PostDTO';

function sample(overrides: Partial<PostDTO> = {}): PostDTO {
  return {
    title: 'Alpha',
    content: 'Lorem',
    authorId: 'auth1',
    discipline: 'Matematica',
    createdAt: new Date(),
    updatedAt: new Date(),
    likes: 0,
    deslikes: 0,
    ...overrides
  };
}

describe('PostsRepository', () => {
  let repo: PostsRepository;
  let createdId: string = '';

  beforeAll(async () => {
    await startTestMongo();
    repo = new PostsRepository();
  });
  afterAll(async () => {
    await stopTestMongo();
  });

  it('creates and finds by id', async () => {
    const created = await repo.create(sample());
    expect(created).toBeTruthy();
    createdId = (created as any).id;
    const got = await repo.findById(createdId);
    expect(got?.title).toBe('Alpha');
  });

  it('searches by term', async () => {
    await repo.create(sample({ title: 'Beta content' }));
    const results = await repo.searchByTerm('Beta');
    expect(results.length).toBeGreaterThan(0);
  });

  it('updates and deletes', async () => {
    const upd = await repo.update(createdId, sample({ title: 'Updated' }));
    expect(upd?.title).toBe('Updated');
    const del = await repo.delete(createdId);
    expect(del).toBe(true);
  });
});

