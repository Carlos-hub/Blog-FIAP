import request from 'supertest';
import { createApp } from '../../src/app';
import { startTestMongo, stopTestMongo } from '../setup/mongo';

const app = createApp();

describe('StudentRoute integration', () => {
  let createdId: string = '';

  beforeAll(async () => {
    await startTestMongo();
  });
  afterAll(async () => {
    await stopTestMongo();
  });

  it('creates a student', async () => {
    const res = await request(app)
      .post('/students')
      .send({ name: 'Aluno A', email: 'alunoA@example.com', password: 'student-password-123' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    createdId = res.body.data.id;
    expect(createdId).toBeDefined();
  });

  it('rejects duplicate email', async () => {
    const res = await request(app)
      .post('/students')
      .send({ name: 'Aluno A2', email: 'alunoA@example.com', password: 'student-password-123' });
    expect([400, 409]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });

  it('lists students', async () => {
    const res = await request(app).get('/students');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('gets a student by id', async () => {
    const res = await request(app).get(`/students/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdId);
  });

  it('updates a student', async () => {
    const res = await request(app)
      .put(`/students/${createdId}`)
      .send({ name: 'Aluno Atualizado' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Aluno Atualizado');
  });

  it('deletes a student', async () => {
    const res = await request(app).delete(`/students/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

