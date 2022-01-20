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
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const existingOrder = await Order.findOne({
      ticket: ticket,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete
        ]
      }
    })
    if (existingOrder) {
      throw new BadRequestError('Ticket is already reserved');
    }

    res.send({});
  }
);

export { router as newOrderRouter };
