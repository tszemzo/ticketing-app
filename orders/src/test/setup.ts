import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Add our mocked nats wrapper to every test we run
jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdasd';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {{
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
}})

afterAll(async () => {{
  await mongo.stop();
  await mongoose.connection.close();
}})