
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from "@ts-tickets/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 100,
    userId: 'asd',
  });
  await ticket.save();

  // create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: 'asd-asd',
    version: 0,
    status: OrderStatus.Created,
    expiresAt: 'asd',
    userId: 'asd',
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('should sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('should ack the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('should publish a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
