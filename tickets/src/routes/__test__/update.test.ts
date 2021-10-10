import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { signup } from '../../test/utils';
import { TICKET } from '../../test/constants';

const { price, title } = TICKET;

const createTicket = async () => {
  const cookie = await signup();
  return request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ticket_1',
      price: 10
    })
    .expect(201);
}


it('should return an 404 error if the provided id does not exist', async () => {  
  const id = new mongoose.Types.ObjectId().toString();
  const cookie = await signup();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price
    })
    .expect(404);
});

it('should return an 401 error if the user is not authenticated', async () => { 
  const id = new mongoose.Types.ObjectId().toString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title,
      price
    })
    .expect(401); 
});

it('should return an 401 error if the user does not own the ticket', async () => {
  const response = await createTicket();

  const newCookie = await signup();
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', newCookie)
    .send({
      title: 'A new title',
      price: 1000
    })
    .expect(401);
});

it('should return an 400 error if the user provides an invalid title or price', async () => {
  const cookie = await signup();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      // Invalid title
      title: '',
      price
    })
    .expect(400);
});

it('should update the ticket provided valid inputs', async () => {  
  const cookie = await signup();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'A valid title',
      price: 1000
    })
    .expect(200);

  const ticketUpdated = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketUpdated.body.title).toEqual('A valid title');
  expect(ticketUpdated.body.price).toEqual(1000);
});
