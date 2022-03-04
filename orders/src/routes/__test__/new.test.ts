import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { signup } from '../../test/utils';
import { TICKET } from '../../test/constants'
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('should return an error if the ticket does not exist', async () => {
  const cookie = await signup();
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId })
    .expect(404);
});

it('should return an error if the tickets is already reserved', async () => {
  const cookie = await signup();
  const ticket = Ticket.build({ ...TICKET, id: mongoose.Types.ObjectId().toHexString() });
  await ticket.save();

  const order = Order.build({ 
    ticket,
    userId: '1',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('should reserve a ticket correctly', async () => {
  const cookie = await signup();
  const ticket = Ticket.build({ ...TICKET, id: mongoose.Types.ObjectId().toHexString() });
  await ticket.save();

  const response =  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })

  expect(response.status).toEqual(201);
});

it('emits an order created event', async () => {
  const cookie = await signup();
  const ticket = Ticket.build({ ...TICKET, id: mongoose.Types.ObjectId().toHexString() });
  await ticket.save();

  const response =  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })

  expect(response.status).toEqual(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
