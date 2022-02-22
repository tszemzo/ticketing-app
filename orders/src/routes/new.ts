import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { 
  BadRequestError, 
  NotFoundError, 
  OrderStatus, 
  requireAuth, 
  validateRequest  
} from '@ts-tickets/common';
import { natsWrapper } from '../nats-wrapper';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';

const router = express.Router();
// This variable could be an env variable, or something in the DB
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders', 
  requireAuth, 
  [
    body('ticketId')
      .not()
      .isEmpty()
      .withMessage('TicketId must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // Build the order and save into the DB
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    });
    await order.save();


    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
