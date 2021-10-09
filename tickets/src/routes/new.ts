import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@ts-tickets/common';

const router = express.Router();

router.get('/api/tickets', requireAuth, [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('prize').isFloat({ gt: 0 }).withMessage('Prize must be greater than 0')
],
validateRequest,
(req: Request, res: Response ) => {
  res.sendStatus(200);
});

export { router as createTicketRouter };
