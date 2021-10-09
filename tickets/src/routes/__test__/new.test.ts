import request from 'supertest';
import { app } from '../../app';
import { signup } from '../../test/utils';
import { EMAIL } from '../../test/constants';

it('should have a route handler listening to /api/tickets for creation requests ', async () => {  
  const response = await request(app)
    .get('/api/tickets')
    .send({});
    
  expect(response.status).not.toEqual(404);
});

it('should access only if the user is signed in', async () => {
  await request(app)
    .get('/api/tickets')
    .send({})
    .expect(401);
});

it('should return a status other than 401 if the user is signed in', async () => {
  const cookie = await signup();
  const response =  await request(app)
    .get('/api/tickets')
    .set('Cookie', cookie)
    .send({})

  expect(response.status).not.toEqual(401);
});

it('should return an error if an invalid title is provided', async () => {
  const cookie = await signup();
  await request(app)
    .get('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10
    })
    .expect(400);
  
  await request(app)
    .get('/api/tickets')
    .set('Cookie', cookie)
    .send({
      price: 10
    })
    .expect(400);
});

it('should return an error if an invalid prize is provided', async () => {
  const cookie = await signup();
  await request(app)
    .get('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'A title',
      price: -10
    })
    .expect(400);

  await request(app)
    .get('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'A title',
    })
    .expect(400);
});

it('should create a valid ticket when valid inputs are provided', async () => {
  const cookie = await signup();
  await request(app)
    .get('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'A title',
      price: 20
    })
    .expect(201);
});
