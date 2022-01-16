import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:id', async (req: Request, res: Response) => {
  res.send({});
});

export { router as showOrderRouter };
