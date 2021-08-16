import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  // Check the env variable has been defined
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  // auth-mongo-srv: name of the IP service we created
  // 27017 is the default port of mongo we setted up
  // auth is the name of the DB, we want to create
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!');
  });
}

start();
