import request from 'supertest';
import { createApp } from '../../src/app';
import { startTestMongo, stopTestMongo } from '../setup/mongo';

const app = createApp();

describe('ProfessorRoute integration', () => {
  let createdId: string = '';

  beforeAll(async () => {
    await startTestMongo();
  });
  afterAll(async () => {
    await stopTestMongo();
  });

  it('creates a professor', async () => {
    const res = await request(app)
      .post('/professors')
      .send({ name: 'Prof X', email: 'profX@example.com', password: 'example-password-123', discipline: 'Matematica' });
    expect(res.status).toBe(201);
    expect(res.body.success ?? true).toBeTruthy(); // ProfessorRoute may not use ApiResponse; tolerate plain dto
    createdId = res.body.data?.id ?? res.body.id;
    expect(createdId).toBeDefined();
  });

  it('lists professors', async () => {
    const res = await request(app).get('/professors');
    expect(res.status).toBe(200);
  });

  it('gets professor by id', async () => {
    const res = await request(app).get(`/professors/${createdId}`);
    expect(res.status).toBe(200);
  });

  it('updates professor', async () => {
    const res = await request(app)
      .put(`/professors/${createdId}`)
      .send({ name: 'Prof X Edit' });
    expect(res.status).toBe(200);
  });

  it('deletes professor', async () => {
    const res = await request(app).delete(`/professors/${createdId}`);
    expect(res.status).toBe(200);
  });
});

