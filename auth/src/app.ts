import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error';

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

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// This will catch every route not found, and even the async errors
app.all('*', async (req, res) => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };
