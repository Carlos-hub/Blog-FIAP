import express, { Router } from 'express';
import request from 'supertest';
import { startTestMongo, stopTestMongo } from '../setup/mongo';
import ProfessorRouteClass from '../../src/Domain/Professor/Routes/ProfessorRoute';
import { ProfessorModel } from '../../src/infra/Database/Models/Professor/ProfessorModel';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

function buildAppWithProfessorRoute() {
  const app = express();
  app.use(express.json());
  const router = Router();
  const routeInstance = new (ProfessorRouteClass as any)(router);
  app.use(router);
  return { app, routeInstance };
}

describe('ProfessorRoute - 100% coverage', () => {
  beforeAll(async () => {
    await startTestMongo();
  });
  afterAll(async () => {
    await stopTestMongo();
  });

  it('GET /professors - success and error branch', async () => {
    const { app, routeInstance } = buildAppWithProfessorRoute();
    await ProfessorModel.create({
      name: 'Prof A',
      email: 'a@example.com',
      password: await bcrypt.hash('example-password-123', 10),
      discipline: 'Matematica'
    });
    const okRes = await request(app).get('/professors');
    expect(okRes.status).toBe(200);

    const original = (routeInstance as any).professorService.getProfessors;
    (routeInstance as any).professorService.getProfessors = jest.fn().mockRejectedValue(new Error('boom'));
    const errRes = await request(app).get('/professors');
    expect(errRes.status).toBe(500);
    (routeInstance as any).professorService.getProfessors = original;
  });

  it('POST /professors - success and missing-fields error', async () => {
    const { app } = buildAppWithProfessorRoute();
    const ok = await request(app)
      .post('/professors')
      .send({ name: 'Prof B', email: 'b@example.com', password: 'example-password-123', discipline: 'Matematica' });
    expect(ok.status).toBe(201);

    const bad = await request(app).post('/professors').send({});
    expect(bad.status).toBe(400);
  });

  it('GET /professors/:id - success and not-found error', async () => {
    const { app } = buildAppWithProfessorRoute();
    const doc = await ProfessorModel.create({
      name: 'Prof C',
      email: 'c@example.com',
      password: await bcrypt.hash('example-password-123', 10),
      discipline: 'Matematica'
    });
    const ok = await request(app).get(`/professors/${String(doc._id)}`);
    expect(ok.status).toBe(200);

    const notFound = await request(app).get(`/professors/${new mongoose.Types.ObjectId().toString()}`);
    expect(notFound.status).toBe(500);
  });

  it('PUT /professors/:id - success and forced error', async () => {
    const { app, routeInstance } = buildAppWithProfessorRoute();
    const doc = await ProfessorModel.create({
      name: 'Prof D',
      email: 'd@example.com',
      password: await bcrypt.hash('example-password-123', 10),
      discipline: 'Matematica'
    });
    const ok = await request(app).put(`/professors/${String(doc._id)}`).send({ name: 'Prof D Edit' });
    expect(ok.status).toBe(200);

    const original = (routeInstance as any).professorService.updateProfessor;
    (routeInstance as any).professorService.updateProfessor = jest.fn().mockRejectedValue(new Error('fail'));
    const err = await request(app).put(`/professors/${String(doc._id)}`).send({ name: 'X' });
    expect(err.status).toBe(500);
    (routeInstance as any).professorService.updateProfessor = original;
  });

  it('DELETE /professors/:id - success and forced error', async () => {
    const { app, routeInstance } = buildAppWithProfessorRoute();
    const doc = await ProfessorModel.create({
      name: 'Prof E',
      email: 'e@example.com',
      password: await bcrypt.hash('example-password-123', 10),
      discipline: 'Matematica'
    });
    const ok = await request(app).delete(`/professors/${String(doc._id)}`);
    expect(ok.status).toBe(200);

    const original = (routeInstance as any).professorService.deleteProfessor;
    (routeInstance as any).professorService.deleteProfessor = jest.fn().mockRejectedValue(new Error('oops'));
    const err = await request(app).delete(`/professors/${String(doc._id)}`);
    expect(err.status).toBe(500);
    (routeInstance as any).professorService.deleteProfessor = original;
  });
}
)

