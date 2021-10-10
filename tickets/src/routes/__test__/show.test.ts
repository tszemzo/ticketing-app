import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

import { signup } from '../../test/utils';
import { TICKET } from '../../test/constants';

it('should return a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toString();
  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

it('should return the ticket if it is found', async () => {  
  const cookie = await signup();
  const { price, title } = TICKET;
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price
    })
    .expect(201);
  

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);
    
  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
