import { Request, Response, NextFunction } from 'express';
export function audit(action: string, entity?: string) {
  return async (req: Request, _res: Response, next: NextFunction) => { next(); };
}