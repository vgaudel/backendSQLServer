import { config as MssqlConfig } from 'mssql';

/**
 * Configuration de connexion à SQL Server (base MOBILESQL).
 * Toutes les valeurs sont lues depuis les variables d'environnement (.env),
 * avec des valeurs par défaut adaptées à un poste de développement local.
 * Aucun identifiant n'est stocké en dur dans le code.
 */

// Mode d'authentification :
//   'trusted' -> session Windows courante (msnodesqlv8, sans mot de passe)
//   'ntlm'    -> Windows via tedious (DB_USER / DB_PASSWORD / DB_DOMAIN)
//   'default' -> login SQL classique (DB_USER / DB_PASSWORD)
export const authType = (process.env.DB_AUTH || 'trusted') as 'trusted' | 'ntlm' | 'default';

// 127.0.0.1 (IPv4) plutôt que 'localhost' qui peut résoudre en IPv6 (::1)
// alors que l'instance locale n'écoute souvent que sur l'IPv4.
const server = process.env.DB_SERVER || '127.0.0.1';
const port = parseInt(process.env.DB_PORT || '1433', 10);
const database = process.env.DB_NAME || 'mobilesql';
const instance = process.env.DB_INSTANCE || '';
const user = process.env.DB_USER || '';
const password = process.env.DB_PASSWORD || '';
const domain = process.env.DB_DOMAIN || '';
const encrypt = process.env.DB_ENCRYPT === 'true';
const trustServerCertificate = process.env.DB_TRUST_CERT !== 'false';
const odbcDriver = process.env.DB_ODBC_DRIVER || 'ODBC Driver 17 for SQL Server';

/**
 * Construit la configuration mssql selon le mode d'authentification.
 */
function buildConfig(): MssqlConfig {
	// Authentification Windows intégrée via ODBC (nécessite le driver msnodesqlv8).
	if (authType === 'trusted') {
		// Cible : soit une instance nommée (Server=host\instance), soit host,port.
		const target = instance ? `${server}\\${instance}` : `${server},${port}`;
		return {
			connectionString:
				`Driver={${odbcDriver}};Server=${target};` +
				`Database=${database};Trusted_Connection=yes;`,
			pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
		} as unknown as MssqlConfig;
	}

	// Authentification via tedious : NTLM (Windows) ou login SQL classique.
	const authentication: MssqlConfig['authentication'] =
		authType === 'ntlm'
			? {
					type: 'ntlm',
					options: { domain, userName: user, password },
			  }
			: {
					type: 'default',
					options: { userName: user, password },
			  };

	return {
		server,
		//port,
		database,
		authentication,
		options: {
			encrypt,
			trustServerCertificate,
			enableArithAbort: true,
			// Instance nommée via tedious (nécessite SQL Browser).
			...(instance ? { instanceName: instance } : {}),
		},
		pool: {
			max: 10,
			min: 0,
			idleTimeoutMillis: 30000,
		},
	};
}

export const dbConfig: MssqlConfig = buildConfig();
