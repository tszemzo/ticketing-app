import { Request, Response, NextFunction } from 'express';

import { NotAuthorizedError } from '../errors/not-authorized-error';

// assumption: we are not going to use this middleware without using the current-user Middleware before

export const requireAuth = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  if(!req.currentUser) {
    // Forbidden
    throw new NotAuthorizedError;
  }

  next();
};