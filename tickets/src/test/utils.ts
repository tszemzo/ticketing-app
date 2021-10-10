import request from 'supertest';

import { app } from '../app';
import { EMAIL } from './constants';
import jwt from 'jsonwebtoken';

async function signup() {
  // For this service, we are going to fake the generation of the cookie
  // as we dont want to depend on other services for our testing.

  // 1) Build a JWT payload: { id, email, iat }
  const payload = {
    id: '123123',
    email: EMAIL
  }

  // 2) Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // 3) Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // 4) Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // 5) Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // 6) return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
}

export { signup };