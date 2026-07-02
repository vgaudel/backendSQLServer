import type { ConnectionPool, IResult } from 'mssql';
import mssql from 'mssql';
import { dbConfig } from './db.config';

const sql: typeof mssql = mssql;

/**
 * Service de gestion de la connexion à la base de données SQL Server
 */
class DatabaseService {
	private pool: ConnectionPool | null = null;
	private connecting: Promise<ConnectionPool> | null = null;

	/**
	 * Obtenir ou créer la connexion pool
	 */
	async getPool(): Promise<ConnectionPool> {
		if (this.pool && this.pool.connected) {
			return this.pool;
		}

		if (this.connecting) {
			return this.connecting;
		}

		this.connecting = sql.connect(dbConfig)
			.then(pool => {
				console.log('✅ Connexion à SQL Server établie');
				this.pool = pool;
				this.connecting = null;

				// Gestion des erreurs de pool
				pool.on('error', err => {
					console.error('❌ Erreur du pool SQL:', err);
					this.pool = null;
				});

				return pool;
			})
			.catch(err => {
				console.error('❌ Échec de connexion à SQL Server:', err);
				this.connecting = null;
				throw err;
			});

		return this.connecting;
	}

	/**
	 * Exécuter une requête SQL
	 */
	async query<T = any>(queryText: string, params?: Record<string, any>): Promise<IResult<T>> {
		const pool = await this.getPool();
		const request = pool.request();

		// Ajouter les paramètres si fournis
		if (params) {
			for (const [key, value] of Object.entries(params)) {
				request.input(key, value);
			}
		}

		return request.query<T>(queryText);
	}

	/**
	 * Fermer la connexion
	 */
	async close(): Promise<void> {
		if (this.pool) {
			await this.pool.close();
			this.pool = null;
			console.log('🔌 Connexion SQL Server fermée');
		}
	}
}

// Exporter une instance singleton
export const db = new DatabaseService();
