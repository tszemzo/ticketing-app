import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';

import { app } from './app';

const start = async () => {
  // Check the env variable has been defined
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  // tickets-mongo-srv: name of the IP service we created
  // 27017 is the default port of mongo we setted up
  // auth is the name of the DB, we want to create
  try {
    await natsWrapper.connect(
      'ticketing', // clusterId -> setted up in infra/nats-depl
      'asdasd', // clientId -> random string for now
      'http://nats-srv:4222' // url -> setted up in infra/nats-depl
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGINT', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI, {
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
