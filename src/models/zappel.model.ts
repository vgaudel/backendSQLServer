/**
 * Interface pour les résultats de la requête ZAPPEL (jointure ZAPPEL/ZODM)
 */
export interface ZAppelResult {
	REFAPPEL_0: string;
	CREDAT_0: Date;
	CREDAT_0_ZODM: Date;
	ZLIBINTBPR_0: string;
	CONTACT_0: string;
	BPADES_0: string;
	MESSAGE_0: string;
	TYPE_0: string;
	OBSINTERNE_0: string;
	OBSCLIENT_0: string;
	OBSCLIENT_1: string;
	OBSCLIENT_2: string;
	REFBPCINTER_0: string;
	REFBPCEQUIP_0: string;
}

/**
 * Résultat d'une statistique d'appels regroupés par type
 */
export interface ZAppelCountByType {
	TYPE_0: string;
	count: number;
}
