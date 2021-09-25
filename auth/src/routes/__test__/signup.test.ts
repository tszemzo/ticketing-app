import request from 'supertest';
import { app } from '../../app';

it('should return a 201 on successful signup', () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'apassword'
    })
    .expect(201);
});

it('should return a 400 when an invalid email', () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test_no_email',
      password: 'apassword'
    })
    .expect(400);
});

it('should return a 400 when a very short password', () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'asd'
    })
    .expect(400);
});

it('should return a 400 when a very long password', () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'asdasdasdasdasdasdasdasdasd'
    })
    .expect(400);
});

it('should return a 400 when missing email and password', () => {
  return request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400);
});

it('should disallow duplicate emails', async () => {
  // This should create the user successfully
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'asdasd'
    })
    .expect(201);
  
  // This should fire a 400 error
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'asdasd'
    })
    .expect(400);
});
