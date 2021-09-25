import request from 'supertest';
import { app } from '../../app';

it('should return a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'apassword'
    })
    .expect(201)
});

it('should return a 400 when an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test_no_email',
      password: 'apassword'
    })
    .expect(400)
});

it('should return a 400 when a very short password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'asd'
    })
    .expect(400)
});

it('should return a 400 when a very long password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'asdasdasdasdasdasdasdasdasd'
    })
    .expect(400)
});

it('should return a 400 when missing email and password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400)
});