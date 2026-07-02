import { db } from '../config/database';
import { ZAppelResult, ZAppelCountByType } from '../models/zappel.model';

/**
 * Service pour les opérations sur les tables ZAPPEL et ZODM
 */
export class ZAppelService {
	/**
	 * Récupérer les appels avec jointure ZODM
	 * Équivalent à la requête du fichier SQL
	 */
	async getAppelsWithZODM(dateDebut: string = '20260101'): Promise<ZAppelResult[]> {
		const query = `
			SELECT 
				ZAPPEL.REFAPPEL_0,
				ZAPPEL.CREDAT_0, 
				ZODM.CREDAT_0 AS CREDAT_0_ZODM, 
				ZAPPEL.ZLIBINTBPR_0, 
				ZAPPEL.CONTACT_0, 
				ZAPPEL.BPADES_0, 
				ZAPPEL.MESSAGE_0, 
				ZAPPEL.TYPE_0, 
				ZODM.OBSINTERNE_0, 
				ZODM.OBSCLIENT_0, 
				ZODM.OBSCLIENT_1, 
				ZODM.OBSCLIENT_2,
				ZODM.REFBPCINTER_0, 
				ZODM.REFBPCEQUIP_0
			FROM ZAPPEL 
			LEFT OUTER JOIN ZODM ON ZAPPEL.REFOM_0 = ZODM.REFOM_0
			WHERE ZAPPEL.CREDAT_0 > @dateDebut
			ORDER BY ZAPPEL.CREDAT_0
		`;

		try {
			const result = await db.query<ZAppelResult>(query, { dateDebut });
			return result.recordset;
		} catch (error) {
			console.error('Erreur lors de la récupération des appels:', error);
			throw error;
		}
	}

	/**
	 * Récupérer un appel par référence
	 */
	async getAppelByRef(refAppel: string): Promise<ZAppelResult | null> {
		const query = `
			SELECT 
				ZAPPEL.REFAPPEL_0,
				ZAPPEL.CREDAT_0, 
				ZODM.CREDAT_0 AS CREDAT_0_ZODM, 
				ZAPPEL.ZLIBINTBPR_0, 
				ZAPPEL.CONTACT_0, 
				ZAPPEL.BPADES_0, 
				ZAPPEL.MESSAGE_0, 
				ZAPPEL.TYPE_0, 
				ZODM.OBSINTERNE_0, 
				ZODM.OBSCLIENT_0, 
				ZODM.OBSCLIENT_1, 
				ZODM.OBSCLIENT_2,
				ZODM.REFBPCINTER_0, 
				ZODM.REFBPCEQUIP_0
			FROM ZAPPEL 
			LEFT OUTER JOIN ZODM ON ZAPPEL.REFOM_0 = ZODM.REFOM_0
			WHERE ZAPPEL.REFAPPEL_0 = @refAppel
		`;

		try {
			const result = await db.query<ZAppelResult>(query, { refAppel });
			return result.recordset[0] || null;
		} catch (error) {
			console.error('Erreur lors de la récupération de l\'appel:', error);
			throw error;
		}
	}

	/**
	 * Compter les appels par type
	 */
	async countAppelsByType(): Promise<ZAppelCountByType[]> {
		const query = `
			SELECT TYPE_0, COUNT(*) as count
			FROM ZAPPEL
			GROUP BY TYPE_0
			ORDER BY count DESC
		`;

		try {
			const result = await db.query<ZAppelCountByType>(query);
			return result.recordset;
		} catch (error) {
			console.error('Erreur lors du comptage des appels:', error);
			throw error;
		}
	}
}

export const zappelService = new ZAppelService();
