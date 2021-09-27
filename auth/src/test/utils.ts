import request from 'supertest';

import { app } from '../app';
import { EMAIL } from './constants';

async function signup() {
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: EMAIL,
      password,
    })
    .expect(201);
  
  const cookie = response.get('Set-Cookie');
  return cookie;
}

export { signup };