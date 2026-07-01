import { Router, Request, Response, NextFunction } from 'express';
import { zappelService } from './zappel.service';

const router = Router();

/**
 * GET /api/zappel
 * Récupérer tous les appels avec jointure ZODM
 * Query params: dateDebut (optionnel, format YYYYMMDD)
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const dateDebut = req.query.dateDebut as string || '20260101';
		const appels = await zappelService.getAppelsWithZODM(dateDebut);

		res.json({
			success: true,
			count: appels.length,
			data: appels
		});
	} catch (error) {
		next(error);
	}
});

/**
 * GET /api/zappel/:refAppel
 * Récupérer un appel spécifique par référence
 */
router.get('/:refAppel', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const refAppel = String(req.params.refAppel);
		const appel = await zappelService.getAppelByRef(refAppel);

		if (!appel) {
			return res.status(404).json({
				success: false,
				message: 'Appel non trouvé'
			});
		}

		res.json({
			success: true,
			data: appel
		});
	} catch (error) {
		next(error);
	}
});

/**
 * GET /api/zappel/stats/by-type
 * Statistiques des appels par type
 */
router.get('/stats/by-type', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const stats = await zappelService.countAppelsByType();

		res.json({
			success: true,
			data: stats
		});
	} catch (error) {
		next(error);
	}
});

export default router;
