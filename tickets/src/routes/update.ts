import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { 
  NotFoundError, 
  NotAuthorizedError, 
  requireAuth, 
  validateRequest 
} from '@ts-tickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, 
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) { 
      throw new NotAuthorizedError
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price
    });
    // Persist data
    await ticket.save();
    res.send(ticket);
  }
);

export { router as updateTicketRouter };
