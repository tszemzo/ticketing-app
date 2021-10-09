import request from 'supertest';
import { app } from '../../app';
import { signup } from '../../test/utils';
import { TICKET } from '../../test/constants';
import { Ticket } from '../../models/ticket';

it('should have a route handler listening to /api/tickets for creation requests ', async () => {  
  const response = await request(app)
    .post('/api/tickets')
    .send({});
    
  expect(response.status).not.toEqual(404);
});

it('should access only if the user is signed in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
});

it('should return a status other than 401 if the user is signed in', async () => {
  const cookie = await signup();
  const response =  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({})

  expect(response.status).not.toEqual(401);
});

it('should return an error if an invalid title is provided', async () => {
  const cookie = await signup();
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10
    })
    .expect(400);
  
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      price: 10
    })
    .expect(400);
});

it('should return an error if an invalid price is provided', async () => {
  const cookie = await signup();
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'A title',
      price: -10
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'A title',
    })
    .expect(400);
});

it('should create a valid ticket when valid inputs are provided', async () => {
  const { price, title } = TICKET;
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const cookie = await signup();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});
