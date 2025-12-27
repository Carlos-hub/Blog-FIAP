import express, { Router } from 'express';
import request from 'supertest';
import { startTestMongo, stopTestMongo } from '../setup/mongo';
import StudentRouteClass from '../../src/Domain/Student/Routes/StudentRoute';
import { StudentsModel } from '../../src/infra/Database/Models/Students/StudentsModel';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

function buildAppWithStudentRoute() {
  const app = express();
  app.use(express.json());
  const router = Router();
  const routeInstance = new (StudentRouteClass as any)(router);
  app.use(router);
  return { app, routeInstance };
}

describe('StudentRoute - 100% coverage', () => {
  beforeAll(async () => {
    await startTestMongo();
  });
  afterAll(async () => {
    await stopTestMongo();
  });

  it('POST /students/ - success and 400 for missing fields', async () => {
    const { app } = buildAppWithStudentRoute();
    const ok = await request(app)
      .post('/students/')
      .send({ name: 'Aluno A', email: 'alunoA@example.com', password: 'student-password-123' });
    expect(ok.status).toBe(201);

    const bad = await request(app).post('/students/').send({});
    expect(bad.status).toBe(400);
  });

  it('GET /students/ - success and forced error branch', async () => {
    const { app, routeInstance } = buildAppWithStudentRoute();
    const ok = await request(app).get('/students/');
    expect(ok.status).toBe(200);

    const original = (routeInstance as any).studentService.getStudents;
    (routeInstance as any).studentService.getStudents = jest.fn().mockRejectedValue(new Error('boom'));
    const err = await request(app).get('/students/');
    expect(err.status).toBe(500);
    (routeInstance as any).studentService.getStudents = original;
  });

  it('GET /students/:id - success and error (service throws)', async () => {
    const { app } = buildAppWithStudentRoute();
    const created = await StudentsModel.create({
      name: 'Aluno B',
      email: 'alunoB@example.com',
      password: await bcrypt.hash('student-password-123', 10)
    });
    const ok = await request(app).get(`/students/${String(created._id)}`);
    expect(ok.status).toBe(200);

    // when service throws (id inexistente), StudentService lança Error -> handleError devolve 500
    const notFound = await request(app).get(`/students/${new mongoose.Types.ObjectId().toString()}`);
    expect(notFound.status).toBe(500);
  });

  it('GET /students/:id - returns 404 when service resolves null (route-level 404 branch)', async () => {
    const { app, routeInstance } = buildAppWithStudentRoute();
    const original = (routeInstance as any).studentService.getStudentById;
    (routeInstance as any).studentService.getStudentById = jest.fn().mockResolvedValue(null);
    const res = await request(app).get(`/students/${new mongoose.Types.ObjectId().toString()}`);
    expect(res.status).toBe(404);
    (routeInstance as any).studentService.getStudentById = original;
  });

  it('PUT /students/:id - success and forced error', async () => {
    const { app, routeInstance } = buildAppWithStudentRoute();
    const created = await StudentsModel.create({
      name: 'Aluno C',
      email: 'alunoC@example.com',
      password: await bcrypt.hash('student-password-123', 10)
    });
    const ok = await request(app).put(`/students/${String(created._id)}`).send({ name: 'Aluno C Edit' });
    expect(ok.status).toBe(200);

    const original = (routeInstance as any).studentService.updateStudent;
    (routeInstance as any).studentService.updateStudent = jest.fn().mockRejectedValue(new Error('fail'));
    const err = await request(app).put(`/students/${String(created._id)}`).send({ name: 'X' });
    expect(err.status).toBe(500);
    (routeInstance as any).studentService.updateStudent = original;
  });

  it('DELETE /students/:id - success and forced error', async () => {
    const { app, routeInstance } = buildAppWithStudentRoute();
    const created = await StudentsModel.create({
      name: 'Aluno D',
      email: 'alunoD@example.com',
      password: await bcrypt.hash('student-password-123', 10)
    });
    const ok = await request(app).delete(`/students/${String(created._id)}`);
    expect(ok.status).toBe(200);

    const original = (routeInstance as any).studentService.deleteStudent;
    (routeInstance as any).studentService.deleteStudent = jest.fn().mockRejectedValue(new Error('oops'));
    const err = await request(app).delete(`/students/${String(created._id)}`);
    expect(err.status).toBe(500);
    (routeInstance as any).studentService.deleteStudent = original;
  });

  it('ID required branches for get/update/delete (invoke handlers without :id)', async () => {
    const { app, routeInstance } = buildAppWithStudentRoute();
    // mount wrappers directly calling the private handlers without params.id
    app.get('/__get_no_id', (req, res) => (routeInstance as any).getStudentById(req, res));
    app.put('/__put_no_id', (req, res) => (routeInstance as any).updateStudent(req, res));
    app.delete('/__delete_no_id', (req, res) => (routeInstance as any).deleteStudent(req, res));
    const r1 = await request(app).get('/__get_no_id');
    expect(r1.status).toBe(400);
    const r2 = await request(app).put('/__put_no_id').send({ name: 'X' });
    expect(r2.status).toBe(400);
    const r3 = await request(app).delete('/__delete_no_id');
    expect(r3.status).toBe(400);
  });
});

