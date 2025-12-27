import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectToMongoDB from '../../src/infra/Database/MongoDB/Connect';

let mongod: MongoMemoryServer | null = null;

export async function startTestMongo(): Promise<void> {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  await connectToMongoDB();
}

export async function stopTestMongo(): Promise<void> {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) {
    await mongod.stop();
    mongod = null;
  }
}

