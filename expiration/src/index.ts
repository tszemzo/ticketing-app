import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
  // Check the env variable has been defined
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  // tickets-mongo-srv: name of the IP service we created
  // 27017 is the default port of mongo we setted up
  // auth is the name of the DB, we want to create
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID, // clusterId -> setted up in infra/nats-depl
      process.env.NATS_CLIENT_ID, // clientId -> random string for now
      process.env.NATS_URL // url -> setted up in infra/nats-depl
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
}

start();
