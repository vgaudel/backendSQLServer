import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de gestion des routes non trouvées (404).
 */
export function notFoundHandler(req: Request, res: Response): void {
	res.status(404).json({
		success: false,
		message: 'Route non trouvée',
	});
}

/**
 * Middleware de gestion globale des erreurs (500).
 */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
	console.error('❌ Erreur:', err);
	res.status(500).json({
		success: false,
		message: 'Erreur interne du serveur',
		error: process.env.NODE_ENV === 'development' ? err.message : undefined,
	});
}
