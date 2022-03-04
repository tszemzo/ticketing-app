import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { signup } from '../../test/utils';
import { Ticket } from '../../models/ticket';
import { TICKET } from '../../test/constants'

const buildOrders = async () => {
  const ticket = Ticket.build({ ...TICKET, id: mongoose.Types.ObjectId().toHexString() });
  await ticket.save();
  return ticket;
}

it('should return the order requested', async () => {
  // Create a tickets
  const ticket = Ticket.build({ ...TICKET, id: mongoose.Types.ObjectId().toHexString() });
  await ticket.save();

  const cookie = await signup();

  // Create an order for the user
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder} = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('should return an error if one user tries to fetch another users order', async () => {
  // Create a tickets
  const ticket = Ticket.build({ ...TICKET, id: mongoose.Types.ObjectId().toHexString() });
  await ticket.save();

  const cookie = await signup();
  const anotherUser = await signup();

  // Create an order for the user
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder} = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', anotherUser)
    .send()
    .expect(401);  
});