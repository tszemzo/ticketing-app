import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@ts-tickets/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

const app = express();
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'local';
// Adding this step to be sure express is aware that is behind a proxy of Ingress Nginx.
// And to be sure that it should still trust traffic as being secure even though it comes from that proxy.
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: !isTestEnv,
  })
);
// This needs to be after setting the cookie session, as we are going to check the session.
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

// This will catch every route not found, and even the async errors
app.all('*', async (req, res) => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };
