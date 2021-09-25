import request from 'supertest';
import { app } from '../../app';

it('should return a 400 when the email supplied doesnt exist', () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'apassword'
    })
    .expect(400);
});

it('should fail when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'apassword'
    })
    .expect(201);

  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'anotherpass'
    })
    .expect(400);
});

it('should signin successfully when correct credentials are supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'apassword'
    })
    .expect(201);

  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'apassword'
    })
    .expect(200);
});
