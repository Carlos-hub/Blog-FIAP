import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { ProfessorModel } from "../infra/Database/Models/Professor/ProfessorModel";

const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://tech-challenge-mongo:27017/tech_challenge";

const TEST_PROFESSOR_NAME = process.env.TEST_PROFESSOR_NAME ?? "Professor Teste";
const TEST_PROFESSOR_EMAIL =
  process.env.TEST_PROFESSOR_EMAIL ?? "professor.teste@fiap.com";
const TEST_PROFESSOR_PASSWORD =
  process.env.TEST_PROFESSOR_PASSWORD ?? "Professor@1234";
const TEST_PROFESSOR_DISCIPLINE =
  process.env.TEST_PROFESSOR_DISCIPLINE ?? "Arquitetura de Software";

async function connectWithRetry(maxRetries = 15, waitMs = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await mongoose.connect(MONGODB_URI);
      return;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
}

async function seedProfessor() {
  await connectWithRetry();

  const existing = await ProfessorModel.findOne({ email: TEST_PROFESSOR_EMAIL });
  if (existing) {
    console.log(`[seed] Professor já existe: ${TEST_PROFESSOR_EMAIL}`);
    return;
  }

  const passwordHash = await bcrypt.hash(TEST_PROFESSOR_PASSWORD, 10);

  await ProfessorModel.create({
    name: TEST_PROFESSOR_NAME,
    email: TEST_PROFESSOR_EMAIL,
    password: passwordHash,
    discipline: TEST_PROFESSOR_DISCIPLINE,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log(`[seed] Professor criado: ${TEST_PROFESSOR_EMAIL}`);
}

seedProfessor()
  .catch((error) => {
    console.error("[seed] Erro ao criar professor inicial:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
