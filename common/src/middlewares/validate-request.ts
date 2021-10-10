import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

export const validateRequest = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  // If everything is ok, just go to the next middleware or continue with the request handler
  next();
};