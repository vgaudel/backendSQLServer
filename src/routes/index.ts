import { Router, Request, Response } from 'express';
import { db } from '../config/database';
import zappelRoutes from './zappel.routes';

const router = Router();

/**
 * Page d'accueil de l'API : liste des endpoints disponibles.
 */
router.get('/', (req: Request, res: Response) => {
	res.json({
		message: 'API mobilesql - Serveur actif',
		endpoints: {
			appels: '/api/zappel',
			appelById: '/api/zappel/:refAppel',
			stats: '/api/zappel/stats/by-type',
		},
	});
});

/**
 * Route de santé : vérifie l'état du serveur et de la connexion SQL.
 */
router.get('/health', async (req: Request, res: Response) => {
	try {
		await db.getPool();
		res.json({
			status: 'healthy',
			database: 'connected',
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		res.status(503).json({
			status: 'unhealthy',
			database: 'disconnected',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

// Routes ZAPPEL
router.use('/api/zappel', zappelRoutes);

export default router;
