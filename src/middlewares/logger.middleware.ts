import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de journalisation des requêtes HTTP.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
	next();
}
