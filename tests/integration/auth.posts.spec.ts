import request from 'supertest';
import { createApp } from '../../src/app';
import { startTestMongo, stopTestMongo } from '../setup/mongo';
import { ProfessorModel } from '../../src/infra/Database/Models/Professor/ProfessorModel';
import { StudentsModel } from '../../src/infra/Database/Models/Students/StudentsModel';
import bcrypt from 'bcrypt';

const app = createApp();

describe('Auth + Posts integration', () => {
  beforeAll(async () => {
    await startTestMongo();
  });
  afterAll(async () => {
    await stopTestMongo();
  });

  it('requires student auth to read posts', async () => {
    const res = await request(app).get('/posts');
    expect(res.status).toBe(401);
  });

  it('student can login and then list posts (empty array)', async () => {
    const student = await StudentsModel.create({
      name: 'Aluno',
      email: 'stud@example.com',
      password: await bcrypt.hash('student-password-123', 10)
    });
    const login = await request(app)
      .post('/auth/student/login')
      .send({ email: 'stud@example.com', password: 'student-password-123' });
    expect(login.status).toBe(200);
    const token = login.body.data.token as string;
    const list = await request(app).get('/posts').set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.data)).toBe(true);
  });

  it('professor can create post with proper token, and only self can edit', async () => {
    const prof = await ProfessorModel.create({
      name: 'Prof',
      email: 'profA@example.com',
      password: await bcrypt.hash('example-password-123', 10),
      discipline: 'Matematica'
    });
    const loginProf = await request(app)
      .post('/auth/login')
      .send({ email: 'profA@example.com', password: 'example-password-123' });
    expect(loginProf.status).toBe(200);
    const ptoken = loginProf.body.data.token as string;

    const create = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${ptoken}`)
      .send({ title: 'T1', content: 'C1' });
    expect(create.status).toBe(201);
    const postId = create.body.data.id as string | undefined;

    // Another professor tries to edit -> forbidden
    const prof2 = await ProfessorModel.create({
      name: 'ProfB',
      email: 'profB@example.com',
      password: await bcrypt.hash('example-password-456', 10),
      discipline: 'Matematica'
    });
    const loginProf2 = await request(app)
      .post('/auth/login')
      .send({ email: 'profB@example.com', password: 'example-password-456' });
    const ptoken2 = loginProf2.body.data.token as string;
    const editByOther = await request(app)
      .put(`/posts/${postId}`)
      .set('Authorization', `Bearer ${ptoken2}`)
      .send({ title: 'Hacker' });
    expect(editByOther.status).toBe(403);

    // Owner can edit
    const editByOwner = await request(app)
      .put(`/posts/${postId}`)
      .set('Authorization', `Bearer ${ptoken}`)
      .send({ title: 'Edited' });
    expect(editByOwner.status).toBe(200);
    expect(editByOwner.body.data.title).toBe('Edited');
  });
});

