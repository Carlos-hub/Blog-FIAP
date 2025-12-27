import mongoose, { Model, Schema } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import AbstractRepository from '../../src/Domain/Abstract/Repository/AbstractRepository';
import RepositoryMapper from '../../src/Domain/Abstract/DTOs/RepositoryMapperInterface';

interface TestEntity {
  _id?: any;
  name: string;
  value: number;
}

interface TestDTO {
  id?: string;
  name: string;
  value: number;
}

class TestMapper implements RepositoryMapper<TestEntity, TestDTO> {
  toEntity(dto: TestDTO): Partial<TestEntity> {
    return { name: dto.name, value: dto.value };
  }
  toDTO(entity: TestEntity): TestDTO {
    return {
      id: String((entity as any)._id ?? (entity as any).id ?? ''),
      name: entity.name,
      value: entity.value,
    };
  }
}

class TestRepository extends AbstractRepository<TestEntity, TestDTO> {
  constructor(model: Model<TestEntity>, mapper: RepositoryMapper<TestEntity, TestDTO>) {
    super(model, mapper);
  }
}

describe('AbstractRepository', () => {
  let mongod: MongoMemoryServer;
  let model: Model<TestEntity>;
  let repo: TestRepository;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    const schema = new Schema<TestEntity>({
      name: { type: String, required: true },
      value: { type: Number, required: true },
    });
    model = mongoose.models.__tests__ as any || mongoose.model<TestEntity>('__tests__', schema);
    repo = new TestRepository(model, new TestMapper());
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('create() stores and returns dto (toObject branch)', async () => {
    const created = await repo.create({ name: 'a', value: 1 });
    expect(created.id).toBeDefined();
    expect(created.name).toBe('a');
  });

  it('findAll() returns array of dtos', async () => {
    const all = await repo.findAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
  });

  it('findById() returns null when not found', async () => {
    const notFound = await repo.findById(new mongoose.Types.ObjectId().toString());
    expect(notFound).toBeNull();
  });

  it('findById() returns dto when found', async () => {
    const created = await repo.create({ name: 'b', value: 2 });
    const got = await repo.findById(created.id as string);
    expect(got?.name).toBe('b');
  });

  it('update() returns null when missing', async () => {
    const upd = await repo.update(new mongoose.Types.ObjectId().toString(), { name: 'x', value: 9 });
    expect(upd).toBeNull();
  });

  it('update() updates and returns dto', async () => {
    const created = await repo.create({ name: 'c', value: 3 });
    const upd = await repo.update(created.id as string, { name: 'c2', value: 4 });
    expect(upd?.name).toBe('c2');
    expect(upd?.value).toBe(4);
  });

  it('delete() returns false when missing', async () => {
    const res = await repo.delete(new mongoose.Types.ObjectId().toString());
    expect(res).toBe(false);
  });

  it('delete() returns true when deleted', async () => {
    const created = await repo.create({ name: 'd', value: 5 });
    const res = await repo.delete(created.id as string);
    expect(res).toBe(true);
  });

  it('create() handles plain object without toObject (else branch)', async () => {
    const spy = jest.spyOn((repo as any).model, 'create').mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      name: 'plain',
      value: 42,
      // no toObject here to trigger the else branch
    } as any);
    const created = await repo.create({ name: 'plain', value: 42 });
    expect(created.name).toBe('plain');
    spy.mockRestore();
  });
});

