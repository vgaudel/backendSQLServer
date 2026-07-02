import dotenv from 'dotenv';
import { config as MssqlConfig } from 'mssql';

dotenv.config();
/**
 * Configuration de connexion à SQL Server en mode SQL Authentication.
 * Seule la stratégie `default` est supportée.
 */
const server = process.env.DB_SERVER?.trim() || '127.0.0.1';
const port = process.env.DB_PORT?.trim() ? parseInt(process.env.DB_PORT, 10) : 1433;
const database = process.env.DB_NAME?.trim() || 'mobilesql';
const user = process.env.DB_USER?.trim() || '';
const password = process.env.DB_PASSWORD || '';
const encrypt = process.env.DB_ENCRYPT === 'true';
const trustServerCertificate = process.env.DB_TRUST_CERT !== 'false';

if (!user || !password) {
    console.warn('⚠️ DB_USER ou DB_PASSWORD manquant : la connexion SQL Server en mode default nécessite des identifiants.');
}

export const dbConfig: MssqlConfig = {
    server,
    port,
    database,
    authentication: {
        type: 'default',
        options: {
            userName: user,
            password,
        },
    },
    options: {
        encrypt,
        trustServerCertificate,
        enableArithAbort: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
};