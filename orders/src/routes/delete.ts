import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@ts-tickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.delete('/api/orders/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  order.status = OrderStatus.Cancelled;
  await order.save();

  // Publish an event saying it has been cancelled

  res.status(204).send(order);
});

export { router as deleteOrderRouter };
