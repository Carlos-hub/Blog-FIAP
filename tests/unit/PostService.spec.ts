import PostService from '../../src/Domain/Posts/Services/PostService';
import type { PostDTO } from '../../src/Domain/Posts/DTOs/PostDTO';

class FakePostsRepo {
  public created: PostDTO | null = null;
  public byId: Record<string, PostDTO> = {};
  public all: PostDTO[] = [];
  async create(dto: PostDTO): Promise<PostDTO> {
    this.created = dto;
    const withId = { ...dto, id: dto.id ?? '1' };
    this.byId[withId.id as string] = withId;
    this.all.push(withId);
    return withId;
  }
  async findById(id: string): Promise<PostDTO | null> {
    return this.byId[id] ?? null;
  }
  async findAll(): Promise<PostDTO[]> {
    return this.all;
  }
  async update(id: string, dto: PostDTO): Promise<PostDTO | null> {
    if (!this.byId[id]) return null;
    this.byId[id] = { ...(this.byId[id] as PostDTO), ...dto };
    return this.byId[id] as PostDTO;
  }
  async delete(id: string): Promise<boolean> {
    if (!this.byId[id]) return false;
    delete this.byId[id];
    this.all = this.all.filter(p => p.id !== id);
    return true;
  }
}

function samplePost(overrides: Partial<PostDTO> = {}): PostDTO {
  return {
    id: 'p1',
    title: 't',
    content: 'c',
    authorId: 'a1',
    discipline: 'Mat',
    createdAt: new Date(),
    updatedAt: new Date(),
    likes: 0,
    deslikes: 0,
    ...overrides
  };
}

describe('PostService', () => {
  it('creates and fetches posts', async () => {
    const repo = new FakePostsRepo() as any;
    const svc = new PostService(repo);
    const post = await svc.createPost(samplePost());
    expect(post.id).toBeDefined();
    const got = await svc.getPostById(post.id as string);
    expect(got.title).toBe('t');
  });

  it('updates a post', async () => {
    const repo = new FakePostsRepo() as any;
    const svc = new PostService(repo);
    const post = await svc.createPost(samplePost());
    const updated = await svc.updatePost(post.id as string, samplePost({ title: 'new' }));
    expect(updated.title).toBe('new');
  });

  it('deletes a post', async () => {
    const repo = new FakePostsRepo() as any;
    const svc = new PostService(repo);
    const post = await svc.createPost(samplePost());
    const deleted = await svc.deletePost(post.id as string);
    expect(deleted).toBe(true);
  });
});

