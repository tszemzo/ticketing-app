import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@ts-tickets/common';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';

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
    res.send({});
  }
);

export { router as newOrderRouter };
