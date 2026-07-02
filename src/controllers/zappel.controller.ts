import { Request, Response, NextFunction } from 'express';
import { zappelService } from '../services/zappel.service';

/**
 * Contrôleur pour les appels (ZAPPEL / ZODM)
 */
export class ZAppelController {
	/**
	 * GET /api/zappel
	 * Récupérer tous les appels avec jointure ZODM
	 * Query params: dateDebut (optionnel, format YYYYMMDD)
	 */
	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const dateDebut = (req.query.dateDebut as string) || '20260101';
			const appels = await zappelService.getAppelsWithZODM(dateDebut);

			res.json({
				success: true,
				count: appels.length,
				data: appels,
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * GET /api/zappel/stats/by-type
	 * Statistiques des appels par type
	 */
	async getStatsByType(req: Request, res: Response, next: NextFunction) {
		try {
			const stats = await zappelService.countAppelsByType();

			res.json({
				success: true,
				data: stats,
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * GET /api/zappel/:refAppel
	 * Récupérer un appel spécifique par référence
	 */
	async getByRef(req: Request, res: Response, next: NextFunction) {
		try {
			const refAppel = String(req.params.refAppel);
			const appel = await zappelService.getAppelByRef(refAppel);

			if (!appel) {
				return res.status(404).json({
					success: false,
					message: 'Appel non trouvé',
				});
			}

			res.json({
				success: true,
				data: appel,
			});
		} catch (error) {
			next(error);
		}
	}
}

export const zappelController = new ZAppelController();
